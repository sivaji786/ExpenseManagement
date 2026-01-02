import api from './apiConfig';

export interface Category {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    errors?: Record<string, string>;
}

/**
 * Get all categories
 */
export const getAll = async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data || [];
};

/**
 * Get a single category by ID
 */
export const getById = async (id: number): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    if (!response.data.data) {
        throw new Error('Category not found');
    }
    return response.data.data;
};

/**
 * Create a new category
 */
export const create = async (name: string): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', { name });
    if (!response.data.data) {
        throw new Error(response.data.message || 'Failed to create category');
    }
    return response.data.data;
};

/**
 * Update an existing category
 */
export const update = async (id: number, name: string): Promise<Category> => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name });
    if (!response.data.data) {
        throw new Error(response.data.message || 'Failed to update category');
    }
    return response.data.data;
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
};

const categoryService = {
    getAll,
    getById,
    create,
    update,
    delete: deleteCategory,
};

export default categoryService;
