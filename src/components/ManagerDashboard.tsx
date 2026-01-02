import { useState } from 'react';
import { User, Project, Expenditure, EXPENDITURE_CATEGORIES } from '../types/types';
import { Header } from './ui/Header';
import { StatCard } from './ui/StatCard';
import { StatusBadge } from './ui/StatusBadge';
import { BudgetProgress } from './ui/BudgetProgress';
import { Modal } from './ui/Modal';
import { Plus, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface ManagerDashboardProps {
  user: User;
  projects: Project[];
  expenditures: Expenditure[];
  onLogout: () => void;
  onAddExpenditure: (expenditure: Omit<Expenditure, 'id'>) => void;
}

export function ManagerDashboard({ user, projects, expenditures, onLogout, onAddExpenditure }: ManagerDashboardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const myProject = projects.find(p => p.id === user.projectId);
  const myExpenditures = expenditures.filter(e => e.projectId === user.projectId);

  const pendingCount = myExpenditures.filter(e => e.status === 'pending').length;
  const approvedCount = myExpenditures.filter(e => e.status === 'approved').length;
  const rejectedCount = myExpenditures.filter(e => e.status === 'rejected').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myProject) return;

    onAddExpenditure({
      projectId: myProject.id,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      createdBy: user.id,
      status: 'pending',
    });

    setFormData({
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddModal(false);
  };

  if (!myProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">No Project Assigned</h2>
          <p className="text-gray-600 mb-4">You don't have a project assigned yet.</p>
          <button
            onClick={onLogout}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const remaining = myProject.budget - myProject.totalExpenditure;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manager Portal" userName={user.name} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-900 mb-2">{myProject.name}</h2>
              <StatusBadge status={myProject.status} showIcon={false} />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Expenditure
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Total Budget</span>
              </div>
              <div className="text-gray-900">₹{myProject.budget.toLocaleString('en-IN')}</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">Total Spent</span>
              </div>
              <div className="text-gray-900">₹{myProject.totalExpenditure.toLocaleString('en-IN')}</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Remaining</span>
              </div>
              <div className="text-gray-900">₹{remaining.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <BudgetProgress spent={myProject.totalExpenditure} budget={myProject.budget} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Clock}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
            label="Pending Approval"
            value={pendingCount}
          />
          <StatCard
            icon={CheckCircle}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            label="Approved"
            value={approvedCount}
          />
          <StatCard
            icon={XCircle}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
            label="Rejected"
            value={rejectedCount}
          />
        </div>

        {/* Expenditures List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">My Expenditures</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myExpenditures.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-600">
                        No expenditures yet. Click "Add Expenditure" to create one.
                      </td>
                    </tr>
                  ) : (
                    myExpenditures.map((exp) => (
                      <tr key={exp.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{exp.category}</td>
                        <td className="py-3 px-4 text-gray-600">{exp.description}</td>
                        <td className="py-3 px-4 text-gray-900">₹{exp.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-gray-600">{exp.date}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={exp.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Expenditure Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Expenditure"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select category</option>
              {EXPENDITURE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter description..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Expenditure
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}