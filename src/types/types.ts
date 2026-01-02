export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'manager';
  name: string;
  email: string;
  projectId?: string;
  project_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  managerId: string;
  manager_id?: string;
  budget: number;
  totalExpenditure: number;
  total_expenditure?: number;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  start_date?: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Expenditure {
  id: string;
  projectId: string;
  project_id?: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdBy: string;
  created_by?: string;
  status: 'pending' | 'approved' | 'rejected';
  attachments?: {
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

export const EXPENDITURE_CATEGORIES = [
  'Materials',
  'Labor',
  'Equipment',
  'Subcontractor',
  'Permits',
  'Safety',
  'Consulting',
  'Environmental',
  'Utilities',
  'Landscaping',
  'Transportation',
  'Insurance',
  'Other'
];

// Helper function to convert API response format to frontend format
export const normalizeUser = (user: any): User => ({
  id: user.id?.toString() || '',
  username: user.username || '',
  role: user.role || 'manager',
  name: user.name || '',
  email: user.email || '',
  projectId: user.project_id?.toString() || user.projectId?.toString(),
});

export const normalizeProject = (project: any): Project => ({
  id: project.id?.toString() || '',
  name: project.name || '',
  managerId: project.manager_id?.toString() || project.managerId?.toString() || '',
  budget: Number(project.budget) || 0,
  totalExpenditure: Number(project.total_expenditure ?? project.totalExpenditure) || 0,
  status: project.status || 'active',
  startDate: project.start_date || project.startDate || '',
  description: project.description || '',
});

export const normalizeExpenditure = (expenditure: any): Expenditure => ({
  id: expenditure.id?.toString() || '',
  projectId: expenditure.project_id?.toString() || expenditure.projectId?.toString() || '',
  category: expenditure.category || '',
  amount: Number(expenditure.amount) || 0,
  description: expenditure.description || '',
  date: expenditure.date || '',
  createdBy: expenditure.created_by?.toString() || expenditure.createdBy?.toString() || '',
  status: expenditure.status || 'pending',
  attachments: expenditure.attachments,
});
