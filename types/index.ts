// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  tags: string[];
  category: string;
  whyCreated?: string;
  problemSolved?: string;
  startDate?: string;
  completionDate?: string;
  author: string;
  featured: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  projectId: string;
  author: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

// Audit log types
export interface AuditLog {
  timestamp: string;
  route: string;
  method: string;
  action: string;
  status: 'success' | 'error';
  user: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  tags: string;
  category: string;
  whyCreated?: string;
  problemSolved?: string;
  startDate?: string;
  completionDate?: string;
  author: string;
  featured: boolean;
}

// Auth session types
export interface User {
  id: string;
  login: string;
  avatar_url?: string;
  email?: string;
}
