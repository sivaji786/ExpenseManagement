import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon: Icon, bgColor, iconColor, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-2">{title}</p>
          <p className="text-gray-900 text-2xl mb-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-xs">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}