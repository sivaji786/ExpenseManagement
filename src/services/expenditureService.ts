import api from './apiConfig';
import { Expenditure, normalizeExpenditure } from '../types/types';

export const expenditureService = {
    async getAllExpenditures(): Promise<Expenditure[]> {
        const response = await api.get('/expenditures');

        if (response.data.status === 'success' && response.data.data) {
            return response.data.data.map(normalizeExpenditure);
        }

        return [];
    },

    async getExpenditure(id: string): Promise<Expenditure> {
        const response = await api.get(`/expenditures/${id}`);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeExpenditure(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to get expenditure');
    },

    async createExpenditure(expenditureData: Partial<Expenditure>): Promise<Expenditure> {
        const payload = {
            project_id: expenditureData.projectId || expenditureData.project_id,
            category: expenditureData.category,
            amount: expenditureData.amount,
            description: expenditureData.description,
            date: expenditureData.date,
            created_by: expenditureData.createdBy || expenditureData.created_by,
            status: expenditureData.status || 'pending',
        };

        const response = await api.post('/expenditures', payload);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeExpenditure(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to create expenditure');
    },

    async updateExpenditure(id: string, expenditureData: Partial<Expenditure>): Promise<Expenditure> {
        const payload: any = {};

        if (expenditureData.projectId) payload.project_id = expenditureData.projectId;
        if (expenditureData.project_id) payload.project_id = expenditureData.project_id;
        if (expenditureData.category) payload.category = expenditureData.category;
        if (expenditureData.amount !== undefined) payload.amount = expenditureData.amount;
        if (expenditureData.description !== undefined) payload.description = expenditureData.description;
        if (expenditureData.date) payload.date = expenditureData.date;
        if (expenditureData.createdBy) payload.created_by = expenditureData.createdBy;
        if (expenditureData.created_by) payload.created_by = expenditureData.created_by;
        if (expenditureData.status) payload.status = expenditureData.status;

        const response = await api.put(`/expenditures/${id}`, payload);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeExpenditure(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to update expenditure');
    },

    async deleteExpenditure(id: string): Promise<void> {
        const response = await api.delete(`/expenditures/${id}`);

        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to delete expenditure');
        }
    },

    async updateExpenditureStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Expenditure> {
        const response = await api.patch(`/expenditures/${id}/status`, { status });

        if (response.data.status === 'success' && response.data.data) {
            return normalizeExpenditure(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to update expenditure status');
    },
};
