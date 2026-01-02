import { useState, useEffect } from 'react';
import { User, Project, Expenditure } from '../../types/types';
import { projectService } from '../../services/projectService';
import { expenditureService } from '../../services/expenditureService';
import { userService } from '../../services/userService';
import { StatusBadge } from '../ui/StatusBadge';
import { BudgetProgress } from '../ui/BudgetProgress';
import { Plus, Edit2, Eye, ArrowLeft, Paperclip, Download } from 'lucide-react';

interface ProjectManagementSectionProps {
  user: User;
  onAddExpenditure?: (expenditure: Omit<Expenditure, 'id'>) => void;
  onAddProject?: () => void;
  onEditProject?: (project: Project) => void;
}

export function ProjectManagementSection({
  user,
  onAddExpenditure,
  onAddProject,
  onEditProject
}: ProjectManagementSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<'list' | 'details'>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
        console.error('Error fetching project data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getManagerName = (managerId: string): string => {
    const manager = users.find(u => u.id === managerId);
    return manager ? manager.name : 'Unknown';
  };

  const isAdmin = user.role === 'admin';
  const visibleProjects = isAdmin
    ? projects
    : projects.filter(p => p.id === user.projectId);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setView('details');
  };

  const handleBack = () => {
    setView('list');
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const projectExpenditures = selectedProject
    ? expenditures.filter(e => e.projectId === selectedProject.id)
    : [];

  if (view === 'details' && selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="text-gray-900 mb-2">{selectedProject.name}</h2>
            <p className="text-gray-600">Project Details</p>
          </div>
          {isAdmin && onEditProject && (
            <button
              onClick={() => onEditProject(selectedProject)}
              className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Project
            </button>
          )}
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600 mb-1">Status</div>
                <StatusBadge status={selectedProject.status} showIcon={false} />
              </div>
              <div>
                <div className="text-gray-600 mb-1">Start Date</div>
                <div className="text-gray-900">{selectedProject.startDate}</div>
              </div>
            </div>

            <div>
              <div className="text-gray-600 mb-1">Description</div>
              <div className="text-gray-900">{selectedProject.description}</div>
            </div>

            {isAdmin && (
              <div>
                <div className="text-gray-600 mb-1">Project Manager</div>
                <div className="text-gray-900">{getManagerName(selectedProject.managerId)}</div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-gray-600 mb-1">Budget</div>
                <div className="text-gray-900">₹{selectedProject.budget.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-gray-600 mb-1">Spent</div>
                <div className="text-gray-900">₹{selectedProject.totalExpenditure.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-gray-600 mb-1">Remaining</div>
                <div className="text-gray-900">₹{(selectedProject.budget - selectedProject.totalExpenditure).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <BudgetProgress spent={selectedProject.totalExpenditure} budget={selectedProject.budget} />
          </div>
        </div>

        {/* Expenditures List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Expenditures ({projectExpenditures.length})</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {projectExpenditures.map((exp) => (
                <div key={exp.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-gray-900">{exp.category}</div>
                    <div className="text-gray-900">₹{exp.amount.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-gray-600 text-sm mb-3">{exp.description}</div>
                  {exp.attachments && exp.attachments.length > 0 && (
                    <div className="mb-3 space-y-1">
                      <div className="text-gray-700 text-sm flex items-center gap-1">
                        <Paperclip className="w-4 h-4" />
                        Attachments ({exp.attachments.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exp.attachments.map((file, idx) => (
                          <a
                            key={idx}
                            href={file.url}
                            download={file.name}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            {file.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600 text-sm">{exp.date}</div>
                    <StatusBadge status={exp.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Project Management</h2>
          <p className="text-gray-600">Manage and monitor all projects</p>
        </div>
        {isAdmin && onAddProject && (
          <button
            onClick={onAddProject}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleProjects.map((project) => {
          const projectExps = expenditures.filter(e => e.projectId === project.id);

          return (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{project.name}</h3>
                    <StatusBadge status={project.status} showIcon={false} />
                  </div>
                  {isAdmin && (
                    <p className="text-gray-600 mb-2">Manager: {getManagerName(project.managerId)}</p>
                  )}
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-gray-600 text-sm mb-1">Budget</div>
                    <div className="text-gray-900">₹{project.budget.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-gray-600 text-sm mb-1">Spent</div>
                    <div className="text-gray-900">₹{project.totalExpenditure.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <BudgetProgress spent={project.totalExpenditure} budget={project.budget} />

                <div className="flex items-center justify-between pt-2">
                  <div className="text-gray-600 text-sm">
                    {projectExps.length} Expenditures
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(project)}
                      className="flex items-center gap-1 px-3 py-1.5 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    {isAdmin && onEditProject && (
                      <button
                        onClick={() => onEditProject(project)}
                        className="flex items-center gap-1 px-3 py-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}