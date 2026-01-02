import { useState, useEffect } from 'react';
import { Project, User } from '../../types/types';
import { userService } from '../../services/userService';
import { ArrowLeft } from 'lucide-react';

interface AddProjectSectionProps {
  onBack: () => void;
  onAddProject: (project: Omit<Project, 'id' | 'totalExpenditure'>) => void;
}

export function AddProjectSection({ onBack, onAddProject }: AddProjectSectionProps) {
  const [managers, setManagers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userService.getAllUsers();
        setManagers(users.filter(u => u.role === 'manager'));
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: new Date().toISOString().split('T')[0],
    managerId: '',
    status: 'active' as 'active' | 'on-hold' | 'completed',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddProject({
      name: formData.name,
      description: formData.description,
      budget: parseFloat(formData.budget),
      startDate: formData.startDate,
      managerId: formData.managerId,
      status: formData.status,
    });

    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-gray-900 mb-2">Add New Project</h2>
          <p className="text-gray-600">Create a new infrastructure project</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Project Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Delhi Metro Phase 5"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter project description..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Budget (₹) *</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <p className="text-gray-500 text-sm mt-1">Enter amount in Indian Rupees (₹)</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Assign Manager *</label>
              <select
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} ({manager.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Project Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'on-hold' | 'completed' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h4 className="text-gray-900 mb-2">📋 Project Creation Guidelines</h4>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>• Ensure the project name is unique and descriptive</li>
          <li>• Budget should be realistic and aligned with project scope</li>
          <li>• Assign an available manager who isn't overloaded with projects</li>
          <li>• Project start date can be backdated if needed</li>
        </ul>
      </div>
    </div>
  );
}
