import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { User, Project, Expenditure } from './types/types';
import { projectService } from './services/projectService';
import { expenditureService } from './services/expenditureService';
import { userService } from './services/userService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // These handlers are now just pass-throughs or legacy. 
  // Ideally sections should handle their own mutations to update their own state.
  // For now, we keep them to satisfy the DashboardLayout interface, but they won't update global state.
  const handleAddExpenditure = async (newExpenditure: Omit<Expenditure, 'id'>) => {
    await expenditureService.createExpenditure(newExpenditure);
  };

  const handleAddProject = async (newProject: Omit<Project, 'id' | 'totalExpenditure'>) => {
    await projectService.createProject({
      ...newProject,
      totalExpenditure: 0,
    });
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    await projectService.updateProject(id, updates);
  };

  const handleUpdateExpenditureStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    await expenditureService.updateExpenditureStatus(id, status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout
      user={currentUser}
      onLogout={handleLogout}
      onUpdateExpenditureStatus={handleUpdateExpenditureStatus}
      onAddExpenditure={handleAddExpenditure}
      onAddProject={handleAddProject}
      onUpdateProject={handleUpdateProject}
    />
  );
}