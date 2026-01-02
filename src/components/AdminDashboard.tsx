import { useState } from 'react';
import { User, Project, Expenditure } from '../types/types';
import { Header } from './ui/Header';
import { StatCard } from './ui/StatCard';
import { StatusBadge } from './ui/StatusBadge';
import { BudgetProgress } from './ui/BudgetProgress';
import { FolderKanban, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  projects: Project[];
  expenditures: Expenditure[];
  users?: User[];
  onLogout: () => void;
  onUpdateExpenditureStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
}

export function AdminDashboard({ user, projects, expenditures, users = [], onLogout, onUpdateExpenditureStatus }: AdminDashboardProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenditures'>('overview');

  // Helper functions
  const getManagerName = (managerId: string): string => {
    const manager = users.find(u => u.id === managerId);
    return manager ? manager.name : 'Unknown';
  };

  const getProjectName = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown';
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.totalExpenditure, 0);
  const pendingApprovals = expenditures.filter(e => e.status === 'pending').length;

  const filteredExpenditures = selectedProject
    ? expenditures.filter(e => e.projectId === selectedProject)
    : expenditures;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Portal" userName={user.name} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FolderKanban}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            label="Total Projects"
            value={projects.length}
          />
          <StatCard
            icon={DollarSign}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            label="Total Budget"
            value={`₹${totalBudget.toLocaleString('en-IN')}`}
          />
          <StatCard
            icon={TrendingUp}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            label="Total Spent"
            value={`₹${totalSpent.toLocaleString('en-IN')}`}
          />
          <StatCard
            icon={AlertCircle}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
            label="Pending Approvals"
            value={pendingApprovals}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 border-b-2 transition-colors ${activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Projects Overview
              </button>
              <button
                onClick={() => setActiveTab('expenditures')}
                className={`px-6 py-4 border-b-2 transition-colors ${activeTab === 'expenditures'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                All Expenditures
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' ? (
              <div className="space-y-4">
                {projects.map((project) => {
                  const projectExpenditures = expenditures.filter(e => e.projectId === project.id);

                  return (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-gray-900">{project.name}</h3>
                            <StatusBadge status={project.status} showIcon={false} />
                          </div>
                          <p className="text-gray-600">Manager: {getManagerName(project.managerId)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-gray-600 mb-1">Budget</div>
                          <div className="text-gray-900">₹{project.budget.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-gray-600 mb-1">Spent</div>
                          <div className="text-gray-900">₹{project.totalExpenditure.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-gray-600 mb-1">Remaining</div>
                          <div className="text-gray-900">₹{(project.budget - project.totalExpenditure).toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <BudgetProgress spent={project.totalExpenditure} budget={project.budget} />
                      </div>

                      <div className="mt-4 text-gray-600">
                        Total Expenditures: {projectExpenditures.length}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Filter by Project</label>
                  <select
                    value={selectedProject || ''}
                    onChange={(e) => setSelectedProject(e.target.value || null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-700">Project</th>
                        <th className="text-left py-3 px-4 text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 text-gray-700">Description</th>
                        <th className="text-left py-3 px-4 text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenditures.map((exp) => (
                        <tr key={exp.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{getProjectName(exp.projectId)}</td>
                          <td className="py-3 px-4 text-gray-900">{exp.category}</td>
                          <td className="py-3 px-4 text-gray-600">{exp.description}</td>
                          <td className="py-3 px-4 text-gray-900">₹{exp.amount.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 text-gray-600">{exp.date}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={exp.status} />
                          </td>
                          <td className="py-3 px-4">
                            {exp.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => onUpdateExpenditureStatus(exp.id, 'approved')}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => onUpdateExpenditureStatus(exp.id, 'rejected')}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}