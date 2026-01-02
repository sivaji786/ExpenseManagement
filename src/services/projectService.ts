import api from './apiConfig';
import { Project, normalizeProject } from '../types/types';

export const projectService = {
    async getAllProjects(): Promise<Project[]> {
        const response = await api.get('/projects');

        if (response.data.status === 'success' && response.data.data) {
            return response.data.data.map(normalizeProject);
        }

        return [];
    },

    async getProject(id: string): Promise<Project> {
        const response = await api.get(`/projects/${id}`);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeProject(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to get project');
    },

    async createProject(projectData: Partial<Project>): Promise<Project> {
        const payload = {
            name: projectData.name,
            manager_id: projectData.managerId || projectData.manager_id,
            budget: projectData.budget,
            total_expenditure: projectData.totalExpenditure || projectData.total_expenditure || 0,
            status: projectData.status || 'active',
            start_date: projectData.startDate || projectData.start_date,
            description: projectData.description,
        };

        const response = await api.post('/projects', payload);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeProject(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to create project');
    },

    async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
        const payload: any = {};

        if (projectData.name) payload.name = projectData.name;
        if (projectData.managerId) payload.manager_id = projectData.managerId;
        if (projectData.manager_id) payload.manager_id = projectData.manager_id;
        if (projectData.budget !== undefined) payload.budget = projectData.budget;
        if (projectData.totalExpenditure !== undefined) payload.total_expenditure = projectData.totalExpenditure;
        if (projectData.total_expenditure !== undefined) payload.total_expenditure = projectData.total_expenditure;
        if (projectData.status) payload.status = projectData.status;
        if (projectData.startDate) payload.start_date = projectData.startDate;
        if (projectData.start_date) payload.start_date = projectData.start_date;
        if (projectData.description !== undefined) payload.description = projectData.description;

        const response = await api.put(`/projects/${id}`, payload);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeProject(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to update project');
    },

    async deleteProject(id: string): Promise<void> {
        const response = await api.delete(`/projects/${id}`);

        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to delete project');
        }
    },

    async getProjectExpenditures(id: string): Promise<any[]> {
        const response = await api.get(`/projects/${id}/expenditures`);

        if (response.data.status === 'success' && response.data.data) {
            return response.data.data;
        }

        return [];
    },
};
