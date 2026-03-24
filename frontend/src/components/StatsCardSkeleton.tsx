import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardSkeletonProps {
  icon: LucideIcon;
  delay?: number;
}

const StatsCardSkeleton = ({ icon: Icon, delay = 0 }: StatsCardSkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-muted/40 rounded-lg animate-pulse w-28" />
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Main value skeleton */}
        <div className="h-9 bg-muted/50 rounded-lg animate-pulse w-32" />
        
        {/* Sub value skeleton */}
        <div className="h-4 bg-muted/30 rounded-md animate-pulse w-40" />
      </div>
    </motion.div>
  );
};

export default StatsCardSkeleton;
