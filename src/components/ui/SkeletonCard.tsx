const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-card">
    <div className="aspect-square shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 rounded shimmer" />
      <div className="h-4 w-1/2 rounded shimmer" />
    </div>
  </div>
);

export default SkeletonCard;
