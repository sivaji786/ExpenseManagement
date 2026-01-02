interface BudgetProgressProps {
  spent: number;
  budget: number;
  showPercentage?: boolean;
}

export function BudgetProgress({ spent, budget, showPercentage = true }: BudgetProgressProps) {
  const percentage = (spent / budget) * 100;
  const safePercentage = Math.min(percentage, 100);

  const getColor = () => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div>
      {showPercentage && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Budget Usage</span>
          <span className="text-gray-900">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getColor()}`}
          style={{ width: `${safePercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
