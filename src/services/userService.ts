import api from './apiConfig';
import { User, normalizeUser } from '../types/types';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        const response = await api.get('/users');

        if (response.data.status === 'success' && response.data.data) {
            return response.data.data.map(normalizeUser);
        }

        return [];
    },

    async getUser(id: string): Promise<User> {
        const response = await api.get(`/users/${id}`);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeUser(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to get user');
    },

    async createUser(userData: Partial<User>): Promise<User> {
        const payload = {
            username: userData.username,
            password: userData.password,
            role: userData.role,
            name: userData.name,
            email: userData.email,
            project_id: userData.projectId || userData.project_id,
        };

        const response = await api.post('/users', payload);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeUser(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to create user');
    },

    async updateUser(id: string, userData: Partial<User>): Promise<User> {
        const payload: any = {};

        if (userData.username) payload.username = userData.username;
        if (userData.password) payload.password = userData.password;
        if (userData.role) payload.role = userData.role;
        if (userData.name) payload.name = userData.name;
        if (userData.email) payload.email = userData.email;
        if (userData.projectId !== undefined) payload.project_id = userData.projectId;
        if (userData.project_id !== undefined) payload.project_id = userData.project_id;

        const response = await api.put(`/users/${id}`, payload);

        if (response.data.status === 'success' && response.data.data) {
            return normalizeUser(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to update user');
    },

    async deleteUser(id: string): Promise<void> {
        const response = await api.delete(`/users/${id}`);

        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to delete user');
        }
    },
};
