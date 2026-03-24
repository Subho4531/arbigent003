import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bot, Shield, Target, TrendingUp, ArrowRight, Zap, Radio } from "lucide-react";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import PriceChart from "@/components/PriceChart";
import { WalletConnectionPrompt } from "@/components/WalletConnectionPrompt";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);

  const handleConnect = () => {
    if (connected) {
      navigate("/dashboard");
    } else {
      setShowWalletPrompt(true);
    }
  };

  const handleCloseWalletPrompt = () => {
    setShowWalletPrompt(false);
  };

  // Enhanced animated background with floating orbs
  const AnimatedBackground = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Primary orb - top left */}
      <motion.div 
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-primary/[0.08] rounded-full blur-[100px]" 
      />
      {/* Secondary orb - bottom right */}
      <motion.div 
        animate={{ 
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-amber-500/[0.06] rounded-full blur-[120px]" 
      />
      {/* Center gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/[0.04] via-transparent to-transparent rounded-full" />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
    </div>
  );

  const features = [
    {
      icon: Bot,
      title: "AUTONOMOUS AGENTS",
      description: "AI agents continuously monitor market prices, analyze execution conditions, and autonomously execute trades",
      badge: "ALWAYS ON",
      badgeColor: "green" as const,
    },
    {
      icon: Shield,
      title: "LOW RISK EXECUTION",
      description: "Risk-assessed strategies with built-in safety limits and MEV protection.",
      badge: "RISK SCORE: 2.3/10",
      badgeColor: "green" as const,
    },
    {
      icon: Target,
      title: "HIGH SUCCESS RATE",
      description: "92.7% profitable trades over 30 days with advanced opportunity detection.",
      badge: "1,247 TRADES",
      badgeColor: "blue" as const,
    },
    {
      icon: TrendingUp,
      title: "MAXIMUM PROFITABILITY",
      description: "Attain maximum profit per trade, compounded automatically across DEXs.",
      badge: "+$47,332 TOTAL",
      badgeColor: "green" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background noise-overlay dark relative overflow-hidden">
      {/* Enhanced animated background */}
      <AnimatedBackground />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Left: Hero Content */}
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm px-5 py-2 mb-8 shadow-lg shadow-primary/10"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                  </span>
                  <span className="text-sm font-display font-bold text-primary tracking-wide">LIVE ON APTOS</span>
                </motion.div>
                
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-wide mb-8 text-gradient-hero text-balance">
                  AGENTIC<br />
                  ARBITRAGE<br />
                  PLATFORM
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg text-pretty">
                  Execute autonomous arbitrage agents that continuously scan Aptos DEX, monitor prices, simulate execution paths, and automatically execute profitable trades using confidential computation.
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button variant="hero" size="xl" onClick={handleConnect} className="group">
                    {connected ? 'Launch App' : 'Connect Wallet'}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Feature Cards Grid */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    {...feature}
                    delay={0.2 + index * 0.1}
                  />
                ))}
              </div>
            </div>
            
            {/* Right: Price Chart */}
            <div className="lg:pl-8">
              <PriceChart />
              
              {/* Additional Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 grid grid-cols-2 gap-4"
              >
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <p className="text-xs text-muted-foreground mb-2 font-display tracking-wide">Active Arbitrage Routes</p>
                  <p className="font-mono text-2xl font-bold text-foreground">47</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-xs text-success font-medium">+12 new today</span>
                    <span className="text-[10px] text-success">▲</span>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <p className="text-xs text-muted-foreground mb-2 font-display tracking-wide">Total Value Locked</p>
                  <p className="font-mono text-2xl font-bold text-foreground">$2.4M</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-xs text-success font-medium">+8.3% this week</span>
                    <span className="text-[10px] text-success">▲</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 border-t border-border/50 relative">
        {/* Section background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-20"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block text-sm font-mono text-primary mb-4 tracking-wider"
            >
              HOW IT WORKS
            </motion.span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-wide mb-6 text-foreground text-balance">
              A LOOK INSIDE THE ENGINE
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Our architecture separates private computation from public settlement, 
              giving you the best of both worlds.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "CONFIDENTIAL COMPUTE",
                description: "Your logic runs inside browser environment. No one sees your strategy, inputs, or state.",
              },
              {
                icon: Target,
                title: "ZK PROOF GENERATION",
                description: "A cryptographic proof is generated, confirming your logic executed correctly without revealing it.",
              },
              {
                icon: Zap,
                title: "MEV RESISTANCE",
                description: "Transactions are sent via private mempool, protecting you from sandwich attacks.",
              },
              {
                icon: Bot,
                title: "NON-CUSTODIAL",
                description: "You retain full control of your assets. On-chain contracts verify proofs, settling trades trustlessly.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-7 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-5 group-hover:bg-primary/15 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
                >
                  <item.icon className="h-6 w-6 text-primary" />
                </motion.div>
                <h3 className="font-display text-lg font-bold tracking-wide text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-12 lg:p-16 text-center"
          >
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-primary/10 via-transparent to-primary/5 opacity-50"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-wide mb-6 text-foreground text-balance">
                  START TRADING WITH AI
                </h2>
                <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                  Connect your Petra wallet and deploy your first autonomous trading agent in minutes.
                </p>
                <Button variant="glow" size="xl" onClick={handleConnect} className="font-display tracking-wide font-bold group shadow-2xl shadow-primary/30">
                  {connected ? 'Launch App' : 'Connect Petra Wallet'}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  No trading fees for first 30 days
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-lg font-bold tracking-wider">ARBIGENT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Arbigent. Built on Aptos.
            </p>
          </div>
        </div>
      </footer>

      {/* Wallet Connection Modal */}
      {showWalletPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={handleCloseWalletPrompt}
              className="absolute -top-2 -right-2 z-10 h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              ×
            </button>
            <WalletConnectionPrompt
              title="Connect to Start Trading"
              description="Connect your Petra wallet to access the dashboard and start deploying autonomous trading agents."
              targetRoute="/dashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
