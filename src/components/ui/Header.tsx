import { LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  userName: string;
  onLogout: () => void;
}

export function Header({ title, userName, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">{title}</h1>
            <p className="text-gray-600">Welcome back, {userName}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
