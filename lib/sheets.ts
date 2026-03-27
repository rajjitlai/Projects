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
      range: 'projects!A2:J', // Skip header row
    });

    const rows = response.data.values || [];
    return rows.map((row) => ({
      id: row[0] as string,
      title: row[1] as string,
      description: row[2] as string,
      image: row[3] as string,
      liveUrl: row[4] as string,
      repoUrl: row[5] as string,
      tags: (row[6] as string).split(',').map((t) => t.trim()),
      author: row[7] as string,
      featured: row[8] === 'TRUE' || row[8] === true,
      createdAt: row[9] as string,
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
  ]];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'projects!A2:J',
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
  ]];

  // Find row number (header + 1-based index)
  const rowIndex = projects.findIndex((p) => p.id === id) + 2;

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `projects!A${rowIndex}:J${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
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
