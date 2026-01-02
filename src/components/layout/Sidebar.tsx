import { LayoutDashboard, FolderKanban, Tag, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Project Management', icon: FolderKanban },
  { id: 'categories', label: 'Category Management', icon: Tag, adminOnly: true },
  { id: 'users', label: 'User Administration', icon: Users, adminOnly: true },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'admin' | 'manager';
}

export function Sidebar({ activeSection, onSectionChange, userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredMenuItems = menuItems.filter(
    item => !item.adminOnly || userRole === 'admin'
  );

  return (
    <div
      className={`bg-gradient-to-b from-indigo-900 to-indigo-800 text-white transition-all duration-300 flex flex-col h-screen ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo Section */}
      <div className={`p-6 border-b border-indigo-700 ${isCollapsed ? 'px-4' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex-1">
              <h2 className="text-white mb-1">ExpenseTrack</h2>
              <p className="text-indigo-300 text-sm">Infrastructure Projects</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-white text-indigo-900 shadow-lg font-medium'
                    : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon 
                  className={`flex-shrink-0 transition-all ${
                    isActive ? 'w-5 h-5 text-indigo-900' : 'w-5 h-5 text-indigo-300 group-hover:text-white'
                  }`} 
                />
                {!isCollapsed && (
                  <span className="text-left flex-1 whitespace-nowrap">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Role Badge */}
      <div className={`p-4 border-t border-indigo-700 ${isCollapsed ? 'px-2' : ''}`}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center">
              <span className="text-white text-xs uppercase">{userRole[0]}</span>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-700/50 rounded-xl px-4 py-3 text-center border border-indigo-600">
            <div className="text-xs text-indigo-300 mb-1">Logged in as</div>
            <div className="text-white capitalize">{userRole}</div>
          </div>
        )}
      </div>
    </div>
  );
}