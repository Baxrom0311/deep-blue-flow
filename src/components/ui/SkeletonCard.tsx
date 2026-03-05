const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-card border border-border/50">
    <div className="aspect-[4/3] shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-1/3 rounded-lg shimmer" />
      <div className="h-5 w-3/4 rounded-lg shimmer" />
      <div className="h-4 w-1/2 rounded-lg shimmer" />
    </div>
  </div>
);

export default SkeletonCard;
