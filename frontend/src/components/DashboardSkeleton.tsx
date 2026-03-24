import { motion } from "framer-motion";
import { Wallet, TrendingUp, Bot, Activity } from "lucide-react";
import StatsCardSkeleton from "./StatsCardSkeleton";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-background dark relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-primary/[0.06] rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-20 right-1/4 w-[450px] h-[450px] bg-amber-500/[0.05] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-primary/[0.03] via-transparent to-transparent rounded-full" />
      </div>
      
      <main className="pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10 flex items-center justify-between"
          >
            <div>
              <div className="h-14 bg-muted/50 rounded-xl animate-pulse w-72 mb-3" />
              <div className="h-5 bg-muted/30 rounded-lg animate-pulse w-56" />
            </div>
            <div className="flex gap-3">
              <div className="h-11 bg-muted/30 rounded-xl animate-pulse w-32" />
            </div>
          </motion.div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatsCardSkeleton icon={Wallet} delay={0} />
            <StatsCardSkeleton icon={TrendingUp} delay={0.1} />
            <StatsCardSkeleton icon={Bot} delay={0.2} />
            <StatsCardSkeleton icon={Activity} delay={0.3} />
          </div>
          
          {/* Quick Actions Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-7 relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted/50 rounded-xl animate-pulse" />
                  <div className="h-6 bg-muted/50 rounded-lg animate-pulse w-40" />
                </div>
                <div className="flex gap-3">
                  <div className="h-11 bg-muted/30 rounded-xl animate-pulse w-28" />
                  <div className="h-11 bg-muted/30 rounded-xl animate-pulse w-36" />
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 mb-5 animate-pulse" />
                <div className="h-6 bg-muted/50 rounded-lg animate-pulse w-56 mb-3" />
                <div className="h-4 bg-muted/30 rounded-lg animate-pulse w-72" />
              </div>
            </div>
          </motion.div>

          {/* Opportunities Table Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden relative">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
              
              <div className="p-7 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted/50 rounded-xl animate-pulse" />
                    <div>
                      <div className="h-6 bg-muted/50 rounded-lg animate-pulse w-56 mb-2" />
                      <div className="h-4 bg-muted/30 rounded-lg animate-pulse w-40" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-14 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 mx-auto mb-5 animate-pulse" />
                <div className="h-6 bg-muted/50 rounded-lg animate-pulse w-52 mx-auto mb-3" />
                <div className="h-4 bg-muted/30 rounded-lg animate-pulse w-72 mx-auto" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;
