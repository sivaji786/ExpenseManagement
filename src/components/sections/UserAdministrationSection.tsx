import React from 'react';
import { useState, useEffect } from 'react';
import { User, Project } from '../../types/types';
import { userService } from '../../services/userService';
import { projectService } from '../../services/projectService';
import { Plus, Edit2, Trash2, UserCircle, Shield, ArrowLeft } from 'lucide-react';

interface UserAdministrationSectionProps { }

export function UserAdministrationSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    role: 'manager' as 'admin' | 'manager',
    projectId: '',
  });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, projectsData] = await Promise.all([
          userService.getAllUsers(),
          projectService.getAllProjects(),
        ]);
        setUsers(usersData);
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching user admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Populate form data when editing a user
  useEffect(() => {
    if (editingUser && view === 'edit') {
      setFormData({
        name: editingUser.name,
        username: editingUser.username,
        password: '', // Don't pre-fill password for security
        email: editingUser.email,
        role: editingUser.role,
        projectId: editingUser.projectId || '',
      });
    }
  }, [editingUser, view]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await userService.createUser({
        ...formData,
        projectId: formData.role === 'manager' ? formData.projectId : undefined,
      });
      setUsers([...users, newUser]);
      setFormData({
        name: '',
        username: '',
        password: '',
        email: '',
        role: 'manager',
        projectId: '',
      });
      setView('list');
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Failed to add user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter((u: User) => u.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setView('edit');
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updateData: Partial<User> = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        projectId: formData.role === 'manager' ? formData.projectId : undefined,
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await userService.updateUser(editingUser.id, updateData);
      setUsers(users.map((u: User) => u.id === updatedUser.id ? updatedUser : u));
      setFormData({
        name: '',
        username: '',
        password: '',
        email: '',
        role: 'manager',
        projectId: '',
      });
      setEditingUser(null);
      setView('list');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user. Please try again.');
    }
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'N/A';
    return projects.find((p: Project) => p.id === projectId)?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (view === 'add' || view === 'edit') {
    const isEditMode = view === 'edit';
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setView('list');
              setEditingUser(null);
              setFormData({
                name: '',
                username: '',
                password: '',
                email: '',
                role: 'manager',
                projectId: '',
              });
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-gray-900 mb-2">{isEditMode ? 'Edit User' : 'Add New User'}</h2>
            <p className="text-gray-600">{isEditMode ? 'Update user account details' : 'Create a new user account'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={isEditMode ? handleUpdateUser : handleAddUser} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Password {isEditMode && <span className="text-gray-500 text-sm">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required={!isEditMode}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'manager' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role === 'manager' && (
                <div>
                  <label className="block text-gray-700 mb-2">Assign Project</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project: Project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setView('list')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {isEditMode ? 'Update User' : 'Add User'}
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
          <h2 className="text-gray-900 mb-2">User Administration</h2>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        <button
          onClick={() => setView('add')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">All Users ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-gray-700">User</th>
                <th className="text-left py-4 px-6 text-gray-700">Username</th>
                <th className="text-left py-4 px-6 text-gray-700">Email</th>
                <th className="text-left py-4 px-6 text-gray-700">Role</th>
                <th className="text-left py-4 px-6 text-gray-700">Project</th>
                <th className="text-left py-4 px-6 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <UserCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.username}</td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {user.role === 'admin' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {getProjectName(user.projectId)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}