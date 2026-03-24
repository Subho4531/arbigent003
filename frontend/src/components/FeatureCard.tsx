import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "green" | "amber" | "blue";
  delay?: number;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  badge, 
  badgeColor = "green",
  delay = 0 
}: FeatureCardProps) => {
  const badgeColors = {
    green: "bg-success/15 text-success border-success/25",
    amber: "bg-warning/15 text-warning border-warning/25",
    blue: "bg-primary/15 text-primary border-primary/25",
  };

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
        y: -6,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      </div>
      
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
          >
            <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </motion.div>
          <h3 className="font-display text-base font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        
        {badge && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
            className={`mt-4 inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-mono font-semibold tracking-wide ${badgeColors[badgeColor]}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
            {badge}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;
