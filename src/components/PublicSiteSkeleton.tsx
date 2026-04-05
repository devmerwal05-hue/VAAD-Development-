export default function PublicSiteSkeleton() {
  return (
    <div className="min-h-screen bg-page-bg px-5 py-8 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 rounded-xl bg-white/10" />
          <div className="h-14 w-3/4 rounded-2xl bg-white/8" />
          <div className="h-6 w-2/3 rounded-xl bg-white/6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="h-40 rounded-2xl bg-white/6" />
            <div className="h-40 rounded-2xl bg-white/6" />
            <div className="h-40 rounded-2xl bg-white/6" />
          </div>
          <div className="h-24 rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
