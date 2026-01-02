import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, ArrowLeft, Save, X } from 'lucide-react';
import categoryService, { Category } from '../../services/categoryService';
import { toast } from 'react-hot-toast';

export function CategoryManagementSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: number; value: string } | null>(null);

  // Load categories from API on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };


  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const category = await categoryService.create(newCategory.trim());
      setCategories([...categories, category]);
      setNewCategory('');
      setView('list');
      toast.success('Category added successfully');
    } catch (error: any) {
      console.error('Failed to add category:', error);
      toast.error(error.message || 'Failed to add category');
    }
  };


  const handleEditCategory = (id: number, name: string) => {
    setEditingCategory({ id, value: name });
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !editingCategory.value.trim()) return;

    try {
      const updatedCategory = await categoryService.update(editingCategory.id, editingCategory.value.trim());
      setCategories(categories.map((cat: Category) =>
        cat.id === editingCategory.id ? updatedCategory : cat
      ));
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (error: any) {
      console.error('Failed to update category:', error);
      toast.error(error.message || 'Failed to update category');
    }
  };


  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await categoryService.delete(id);
      setCategories(categories.filter((cat: Category) => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading categories...</div>
      </div>
    );
  }

  if (view === 'add') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setView('list');
              setNewCategory('');
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-gray-900 mb-2">Add New Category</h2>
            <p className="text-gray-600">Create a new expenditure category</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleAddCategory} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Category Name</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter category name..."
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setView('list');
                  setNewCategory('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Category Management</h2>
          <p className="text-gray-600">Manage expenditure categories</p>
        </div>
        <button
          onClick={() => setView('add')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">All Categories ({categories.length})</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                {editingCategory?.id === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingCategory.value}
                      onChange={(e) => setEditingCategory({ ...editingCategory, value: e.target.value })}
                      className="flex-1 px-3 py-2 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') setEditingCategory(null);
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Tag className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-gray-900">{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category.id, category.name)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}