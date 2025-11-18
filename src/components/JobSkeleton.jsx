export default function JobSkeleton() {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white animate-pulse">
      {/* Title */}
      <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>

      {/* Category + Date */}
      <div className="h-3 bg-gray-300 rounded mb-2 w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded mb-4 w-1/3"></div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
}
