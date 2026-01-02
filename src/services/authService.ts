import api from './apiConfig';
import { User, normalizeUser } from '../types/types';

export const authService = {
    async login(username: string, password: string): Promise<User> {
        const response = await api.post('/auth/login', { username, password });

        if (response.data.status === 'success' && response.data.data) {
            return normalizeUser(response.data.data);
        }

        throw new Error(response.data.message || 'Login failed');
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
        localStorage.removeItem('currentUser');
    },

    async getCurrentUser(userId: string): Promise<User> {
        const response = await api.get('/auth/me', {
            params: { user_id: userId }
        });

        if (response.data.status === 'success' && response.data.data) {
            return normalizeUser(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to get user');
    },
};
