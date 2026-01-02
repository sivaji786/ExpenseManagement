import { useState } from 'react';
import { User, Project, Expenditure } from '../types/types';
import { Sidebar } from './layout/Sidebar';
import { Header } from './ui/Header';
import { DashboardSection } from './sections/DashboardSection';
import { ProjectManagementSection } from './sections/ProjectManagementSection';
import { CategoryManagementSection } from './sections/CategoryManagementSection';
import { UserAdministrationSection } from './sections/UserAdministrationSection';
import { SettingsSection } from './sections/SettingsSection';
import { AddExpenditureSection } from './sections/AddExpenditureSection';
import { ExpenditureDetailsSection } from './sections/ExpenditureDetailsSection';
import { AddProjectSection } from './sections/AddProjectSection';
import { EditProjectSection } from './sections/EditProjectSection';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  onUpdateExpenditureStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  onAddExpenditure: (expenditure: Omit<Expenditure, 'id'>) => void;
  onAddProject: (project: Omit<Project, 'id' | 'totalExpenditure'>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

export function DashboardLayout({
  user,
  onLogout,
  onUpdateExpenditureStatus,
  onAddExpenditure,
  onAddProject,
  onUpdateProject,
}: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [subSection, setSubSection] = useState<string | null>(null);
  const [selectedExpenditure, setSelectedExpenditure] = useState<Expenditure | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleAddExpenditureClick = () => {
    setSubSection('add-expenditure');
  };

  const handleViewExpenditureClick = (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure);
    setSubSection('view-expenditure');
  };

  const handleAddProjectClick = () => {
    setSubSection('add-project');
  };

  const handleEditProjectClick = (project: Project) => {
    setSelectedProject(project);
    setSubSection('edit-project');
  };

  const handleBackToDashboard = () => {
    setSubSection(null);
    setSelectedExpenditure(null);
    setSelectedProject(null);
  };

  const renderSection = () => {
    // Handle subsections
    if (subSection === 'add-expenditure') {
      return (
        <AddExpenditureSection
          project={null} // Will be fetched inside or selected
          userId={user.id}
          onBack={handleBackToDashboard}
          onAddExpenditure={onAddExpenditure}
        />
      );
    }

    if (subSection === 'view-expenditure' && selectedExpenditure) {
      return (
        <ExpenditureDetailsSection
          expenditure={selectedExpenditure}
          onBack={handleBackToDashboard}
          isAdmin={user.role === 'admin'}
          onUpdateStatus={onUpdateExpenditureStatus}
        />
      );
    }

    if (subSection === 'add-project') {
      return (
        <AddProjectSection
          onBack={handleBackToDashboard}
          onAddProject={onAddProject}
        />
      );
    }

    if (subSection === 'edit-project' && selectedProject) {
      return (
        <EditProjectSection
          project={selectedProject}
          onBack={handleBackToDashboard}
          onUpdateProject={onUpdateProject}
        />
      );
    }

    // Main sections
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection
            user={user}
            onUpdateExpenditureStatus={onUpdateExpenditureStatus}
            onAddExpenditure={user.role === 'manager' ? handleAddExpenditureClick : undefined}
            onViewExpenditure={handleViewExpenditureClick}
          />
        );
      case 'projects':
        return (
          <ProjectManagementSection
            user={user}
            onAddExpenditure={onAddExpenditure}
            onAddProject={user.role === 'admin' ? handleAddProjectClick : undefined}
            onEditProject={user.role === 'admin' ? handleEditProjectClick : undefined}
          />
        );
      case 'categories':
        return <CategoryManagementSection />;
      case 'users':
        return <UserAdministrationSection />;
      case 'settings':
        return <SettingsSection user={user} />;
      default:
        return (
          <DashboardSection
            user={user}
            onUpdateExpenditureStatus={onUpdateExpenditureStatus}
            onAddExpenditure={user.role === 'manager' ? handleAddExpenditureClick : undefined}
            onViewExpenditure={handleViewExpenditureClick}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setSubSection(null);
          setSelectedExpenditure(null);
          setSelectedProject(null);
        }}
        userRole={user.role}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={user.role === 'admin' ? 'Admin Portal' : 'Manager Portal'}
          userName={user.name}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}