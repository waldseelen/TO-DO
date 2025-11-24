export const ProgressBar = ({ percentage, colorClass }: { percentage: number; colorClass: string }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
    <div
      className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${colorClass}`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);
