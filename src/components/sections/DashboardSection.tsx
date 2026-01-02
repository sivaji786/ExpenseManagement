import { useState, useEffect } from 'react';
import { User, Project, Expenditure } from '../../types/types';
import { projectService } from '../../services/projectService';
import { expenditureService } from '../../services/expenditureService';
import { userService } from '../../services/userService';
import { StatCard } from '../ui/StatCard';
import { StatusBadge } from '../ui/StatusBadge';
import { BudgetProgress } from '../ui/BudgetProgress';
import { DataTable, Column } from '../ui/DataTable';
import { FolderKanban, IndianRupee, AlertCircle, Plus, Paperclip, Eye } from 'lucide-react';

interface DashboardSectionProps {
  user: User;
  onUpdateExpenditureStatus?: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  onAddExpenditure?: () => void;
  onViewExpenditure?: (expenditure: Expenditure) => void;
}

export function DashboardSection({
  user,
  onUpdateExpenditureStatus,
  onAddExpenditure,
  onViewExpenditure
}: DashboardSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, expendituresData, usersData] = await Promise.all([
          projectService.getAllProjects(),
          expenditureService.getAllExpenditures(),
          userService.getAllUsers(),
        ]);
        setProjects(projectsData);
        setExpenditures(expendituresData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch one time on mount

  // Helper functions
  const getManagerName = (managerId: string): string => {
    const manager = users.find(u => u.id === managerId);
    return manager ? manager.name : 'Unknown';
  };

  const getProjectName = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown';
  };

  // Admin sees all projects, Manager sees only their project
  const visibleProjects = isAdmin
    ? projects
    : projects.filter(p => p.id === user.projectId);

  const visibleExpenditures = isAdmin
    ? expenditures
    : expenditures.filter(e => e.projectId === user.projectId);

  const totalBudget = visibleProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = visibleProjects.reduce((sum, p) => sum + p.totalExpenditure, 0);
  const pendingApprovals = visibleExpenditures.filter(e => e.status === 'pending').length;

  // Calculate additional stats
  const activeProjects = visibleProjects.filter(p => p.status === 'active').length;
  const onHoldProjects = visibleProjects.filter(p => p.status === 'on-hold').length;
  const completedProjects = visibleProjects.filter(p => p.status === 'completed').length;
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const remainingBudget = totalBudget - totalSpent;
  const approvedCount = visibleExpenditures.filter(e => e.status === 'approved').length;
  const rejectedCount = visibleExpenditures.filter(e => e.status === 'rejected').length;

  // Export functions
  const exportToCSV = (data: Expenditure[], filename: string) => {
    const headers = isAdmin
      ? ['Project', 'Category', 'Description', 'Amount', 'Date', 'Status', 'Attachments']
      : ['Category', 'Description', 'Amount', 'Date', 'Status', 'Attachments'];

    const rows = data.map(exp => {
      const row = isAdmin
        ? [
          getProjectName(exp.projectId),
          exp.category,
          exp.description,
          exp.amount.toString(),
          exp.date,
          exp.status,
          exp.attachments?.length || '0'
        ]
        : [
          exp.category,
          exp.description,
          exp.amount.toString(),
          exp.date,
          exp.status,
          exp.attachments?.length || '0'
        ];
      return row;
    });

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    exportToCSV(visibleExpenditures, `expenditures-all-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportSelected = (selected: Expenditure[]) => {
    exportToCSV(selected, `expenditures-selected-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Define table columns
  const columns: Column<Expenditure>[] = [
    ...(isAdmin ? [{
      key: 'projectId' as keyof Expenditure,
      label: 'Project',
      sortable: true,
      render: (exp: Expenditure) => (
        <span className="text-gray-900">{getProjectName(exp.projectId)}</span>
      ),
    }] : []),
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (exp: Expenditure) => (
        <span className="text-gray-900">{exp.category}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (exp: Expenditure) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{exp.description}</span>
          {exp.attachments && exp.attachments.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-600 rounded">
              <Paperclip className="w-3 h-3" />
              <span className="text-xs">{exp.attachments.length}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (exp: Expenditure) => (
        <span className="text-gray-900">₹{exp.amount.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (exp: Expenditure) => (
        <span className="text-gray-600">{exp.date}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (exp: Expenditure) => (
        <StatusBadge status={exp.status} />
      ),
    },
    {
      key: 'actions' as keyof Expenditure,
      label: 'Actions',
      sortable: false,
      render: (exp: Expenditure) => (
        <div className="flex gap-2">
          {onViewExpenditure && (
            <button
              onClick={() => onViewExpenditure(exp)}
              className="flex items-center gap-1 px-3 py-1 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition-colors text-xs"
            >
              <Eye className="w-3 h-3" />
              View
            </button>
          )}
          {isAdmin && onUpdateExpenditureStatus && exp.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateExpenditureStatus(exp.id, 'approved')}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
              >
                Approve
              </button>
              <button
                onClick={() => onUpdateExpenditureStatus(exp.id, 'rejected')}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        {!isAdmin && onAddExpenditure && (
          <button
            onClick={onAddExpenditure}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Expenditure
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Projects"
          value={visibleProjects.length.toString()}
          icon={FolderKanban}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          subtitle={`${activeProjects} Active • ${onHoldProjects} On Hold • ${completedProjects} Completed`}
        />
        <StatCard
          title="Budget"
          value={`₹${(totalBudget / 10000000).toFixed(2)} Cr`}
          icon={IndianRupee}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          subtitle={`${budgetUtilization}% Utilized • ₹${(remainingBudget / 10000000).toFixed(2)} Cr Remaining`}
        />
        <StatCard
          title="Expenditure"
          value={`₹${(totalSpent / 10000000).toFixed(2)} Cr`}
          icon={IndianRupee}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          subtitle={`${visibleExpenditures.length} Transactions • ${approvedCount} Approved`}
        />
        <StatCard
          title="Approvals"
          value={pendingApprovals.toString()}
          icon={AlertCircle}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          subtitle={`${approvedCount} Approved • ${rejectedCount} Rejected`}
        />
      </div>

      {/* Project Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">{project.name}</h3>
                {isAdmin && <p className="text-gray-600 text-sm">Manager: {getManagerName(project.managerId)}</p>}
              </div>
              <StatusBadge status={project.status} showIcon={false} />
            </div>
            <BudgetProgress spent={project.totalExpenditure} budget={project.budget} />
          </div>
        ))}
      </div>

      {/* Recent Expenditures with DataTable */}
      <div>
        <h3 className="text-gray-900 mb-4">Recent Expenditures</h3>
        <DataTable
          data={visibleExpenditures}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search expenditures..."
          itemsPerPage={10}
          onExportAll={handleExportAll}
          onExportSelected={handleExportSelected}
          getRowId={(exp) => exp.id}
          searchKeys={['category', 'description', 'amount', 'date', 'status']}
        />
      </div>
    </div>
  );
}