import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import AnimatedValue from "./AnimatedValue";
import ValueChangeIndicator from "./ValueChangeIndicator";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
  isLoading?: boolean;
  isAnimated?: boolean;
  previousValue?: number;
  showChangeIndicator?: boolean;
  isUpdating?: boolean;
}

const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  trend, 
  delay = 0, 
  isLoading = false,
  isAnimated = false,
  previousValue,
  showChangeIndicator = false,
  isUpdating = false
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Loading shimmer effect */}
      {isLoading && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      )}
      
      <div className="relative z-10 flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground tracking-wide">{label}</span>
        <div className="flex items-center gap-2">
          {isUpdating && !isLoading && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          )}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-300">
            <Icon className={`h-4 w-4 transition-colors duration-300 ${isLoading ? 'text-muted-foreground/50' : 'text-primary'}`} />
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex items-end justify-between">
        <div>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-9 bg-muted/50 rounded-lg animate-pulse w-28" />
              {subValue && <div className="h-4 bg-muted/30 rounded-md animate-pulse w-36" />}
            </div>
          ) : (
            <>
              <p className="font-mono text-3xl font-bold text-foreground flex items-center gap-2 tracking-tight">
                {isAnimated && typeof value === 'number' ? (
                  <AnimatedValue 
                    value={Math.abs(value)} 
                    prefix={value >= 0 ? '+$' : '-$'} 
                    decimals={2}
                    className="inline-block"
                  />
                ) : (
                  value
                )}
                {showChangeIndicator && typeof value === 'number' && (
                  <ValueChangeIndicator 
                    currentValue={value} 
                    previousValue={previousValue}
                    showIndicator={!isLoading}
                  />
                )}
              </p>
              {subValue && (
                <p className="text-sm text-muted-foreground mt-2">{subValue}</p>
              )}
            </>
          )}
        </div>
        
        {trend && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2 }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-semibold ${
              trend.isPositive 
                ? "bg-success/15 text-success border border-success/20" 
                : "bg-destructive/15 text-destructive border border-destructive/20"
            }`}
          >
            <span className="text-[10px]">{trend.isPositive ? "▲" : "▼"}</span>
            {trend.value}
          </motion.div>
        )}
        
        {isLoading && (
          <div className="h-7 bg-muted/30 rounded-full animate-pulse w-20" />
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
