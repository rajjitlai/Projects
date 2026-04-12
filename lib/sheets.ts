import { google } from 'googleapis';
import { Project, AuditLog } from '@/types';

const SHEET_ID = process.env.SHEET_ID;
const SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

if (!SHEET_ID || !SERVICE_ACCOUNT_JSON) {
  throw new Error('Missing SHEET_ID or GOOGLE_SERVICE_ACCOUNT_JSON environment variables');
}

// Parse service account JSON
let serviceAccount: { client_email: string; private_key: string };
try {
  serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);
} catch {
  throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON format');
}

// Create auth client
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'projects!A2:O', // Skip header row, including new date columns N, O
    });

    const rows = response.data.values || [];
    return rows.map((row) => ({
      id: row[0] as string,
      title: row[1] as string,
      description: row[2] as string,
      image: row[3] as string,
      liveUrl: row[4] as string,
      repoUrl: row[5] as string,
      tags: (row[6] as string || '').split(',').map((t) => t.trim()).filter(Boolean),
      author: row[7] as string,
      featured: row[8] === 'TRUE' || row[8] === true,
      createdAt: row[9] as string,
      category: row[10] as string || 'General',
      whyCreated: row[11] as string || '',
      problemSolved: row[12] as string || '',
      startDate: row[13] as string || '',
      completionDate: row[14] as string || '',
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const id = `PROJ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  const values = [[
    id,
    project.title,
    project.description,
    project.image,
    project.liveUrl || '',
    project.repoUrl || '',
    project.tags.join(','),
    project.author,
    project.featured ? 'TRUE' : 'FALSE',
    createdAt,
    project.category || 'General',
    project.whyCreated || '',
    project.problemSolved || '',
    project.startDate || '',
    project.completionDate || '',
  ]];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'projects!A2:O',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return {
      ...project,
      id,
      createdAt,
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) {
    throw new Error('Project not found');
  }

  const updatedProject = { ...project, ...updates };
  const values = [[
    updatedProject.id,
    updatedProject.title,
    updatedProject.description,
    updatedProject.image,
    updatedProject.liveUrl || '',
    updatedProject.repoUrl || '',
    updatedProject.tags.join(','),
    updatedProject.author,
    updatedProject.featured ? 'TRUE' : 'FALSE',
    updatedProject.createdAt,
    updatedProject.category || 'General',
    updatedProject.whyCreated || '',
    updatedProject.problemSolved || '',
    updatedProject.startDate || '',
    updatedProject.completionDate || '',
  ]];

  // Find row number (header + 1-based index)
  const rowIndex = projects.findIndex((p) => p.id === id) + 2;

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `projects!A${rowIndex}:O${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

/** Reviews Management **/
export async function getReviews(projectId?: string): Promise<any[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'reviews!A2:G',
    });
    const rows = response.data.values || [];
    const reviews = rows.map(row => ({
      id: row[0],
      projectId: row[1],
      author: row[2],
      content: row[3],
      rating: parseInt(row[4]) || 0,
      isApproved: row[5] === 'TRUE',
      createdAt: row[6],
    }));
    return projectId ? reviews.filter(r => r.projectId === projectId) : reviews;
  } catch {
    return [];
  }
}

export async function addReview(review: any): Promise<void> {
  const id = `REV_${Date.now()}`;
  const createdAt = new Date().toISOString();
  const values = [[
    id,
    review.projectId,
    review.author,
    review.content,
    review.rating,
    'FALSE', // Default to unapproved
    createdAt
  ]];
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'reviews!A2:G',
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

export async function updateReviewStatus(id: string, isApproved: boolean): Promise<void> {
  const reviews = await getReviews();
  const rowIndex = reviews.findIndex((r) => r.id === id) + 2;

  if (rowIndex < 2) throw new Error('Review not found');

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `reviews!F${rowIndex}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[isApproved ? 'TRUE' : 'FALSE']] },
  });
}

export async function deleteReviewRow(id: string): Promise<void> {
  const reviews = await getReviews();
  const rowIndex = reviews.findIndex((r) => r.id === id) + 2;

  if (rowIndex < 2) throw new Error('Review not found');

  // Need to find the sheetId for 'reviews'
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID! });
  const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === 'reviews');
  const sheetId = sheet?.properties?.sheetId || 0;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex - 1,
            endIndex: rowIndex,
          },
        },
      }],
    },
  });
}

export async function deleteProject(id: string): Promise<void> {
  const projects = await getProjects();
  const rowIndex = projects.findIndex((p) => p.id === id) + 2;

  if (rowIndex < 2) {
    throw new Error('Project not found');
  }

  try {
    // Delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming first sheet (projects)
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}

export async function appendAuditLog(log: Omit<AuditLog, 'timestamp'>): Promise<void> {
  const timestamp = new Date().toISOString();

  const values = [[
    timestamp,
    log.route,
    log.method,
    log.action,
    log.status,
    log.user,
  ]];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'audit_logs!A2:F',
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  } catch (error) {
    console.error('Error appending audit log:', error);
    // Don't throw - audit failures shouldn't break main operations
  }
}

export async function getAuditLogs(limit?: number): Promise<AuditLog[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'audit_logs!A2:F',
    });

    const rows = response.data.values || [];
    // Sort by timestamp descending and limit if specified
    const logs = rows
      .map((row) => ({
        timestamp: row[0] as string,
        route: row[1] as string,
        method: row[2] as string,
        action: row[3] as string,
        status: row[4] as 'success' | 'error',
        user: row[5] as string,
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return limit ? logs.slice(0, limit) : logs;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw new Error('Failed to fetch audit logs');
  }
}
