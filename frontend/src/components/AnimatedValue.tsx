import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Props for the AnimatedValue component
 */
interface AnimatedValueProps {
  /** The numeric value to animate */
  value: number;
  /** Optional prefix to display before the value (e.g., '$') */
  prefix?: string;
  /** Optional suffix to display after the value (e.g., '%') */
  suffix?: string;
  /** Number of decimal places to display */
  decimals?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AnimatedValue Component
 * 
 * Displays a numeric value with smooth spring animation and optional formatting.
 * Uses Framer Motion for smooth transitions and automatic value interpolation.
 * 
 * @example
 * ```tsx
 * <AnimatedValue value={1234.56} prefix="$" decimals={2} />
 * // Renders: $1234.56
 * ```
 */
const AnimatedValue = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 2, 
  duration = 0.8,
  className = ''
}: AnimatedValueProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const spring = useSpring(value, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001
  });
  
  const display = useTransform(spring, (latest) => {
    return `${prefix}${latest.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
    setDisplayValue(value);
  }, [value, spring]);

  return (
    <motion.span 
      className={className}
      initial={{ scale: 1 }}
      animate={{ scale: displayValue !== value ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span>{display}</motion.span>
    </motion.span>
  );
};

export default AnimatedValue;
