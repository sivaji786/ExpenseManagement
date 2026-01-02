import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'on-hold';
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          className: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'rejected':
        return {
          className: 'bg-red-100 text-red-800',
          icon: <XCircle className="w-4 h-4" />
        };
      case 'pending':
        return {
          className: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="w-4 h-4" />
        };
      case 'active':
        return {
          className: 'bg-green-100 text-green-800',
          icon: null
        };
      case 'completed':
        return {
          className: 'bg-blue-100 text-blue-800',
          icon: null
        };
      case 'on-hold':
        return {
          className: 'bg-orange-100 text-orange-800',
          icon: null
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800',
          icon: null
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${config.className}`}>
      {showIcon && config.icon}
      {status}
    </span>
  );
}
