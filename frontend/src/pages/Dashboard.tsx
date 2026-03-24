import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Wallet, TrendingUp, Bot, ArrowRight,
  Shield, Vault, Activity, ExternalLink, RefreshCw
} from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import CryptoLogo from "@/components/CryptoLogo";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import UpdateNotification from "@/components/UpdateNotification";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useVault } from "@/hooks/useVault";
import { useMarketData } from "@/hooks/useMarketData";
import { apiService } from "@/services/ApiService";
import useArbiGent from "@/hooks/useArbiGent";

// Enhanced animated background with subtle orbs
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <motion.div 
      animate={{ 
        x: [0, 20, 0],
        y: [0, -15, 0],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-primary/[0.06] rounded-full blur-[100px]" 
    />
    <motion.div 
      animate={{ 
        x: [0, -30, 0],
        y: [0, 20, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute -bottom-20 right-1/4 w-[450px] h-[450px] bg-amber-500/[0.05] rounded-full blur-[120px]" 
    />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-primary/[0.03] via-transparent to-transparent rounded-full" />
    {/* Subtle grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_30%,transparent_100%)]" />
  </div>
);

const Dashboard = () => {
  const { connected, account } = useWallet();
  const { vault, isLoading: vaultLoading } = useVault();
  const { tokenPrices, opportunities, isLoading: marketLoading, refreshOpportunities } = useMarketData();

  // ArbiGent hook for agent status
  const {
    isRunning,
    logs,
    agentState,
    agentConfig,
    runningDuration,
    startAgent,
    stopAgent,
    clearLogs,
    updateConfig,
    updateVaultBalances: updateAgentVaultBalances,
    updatePrices,
    setWalletAddress,
    onStatsUpdate,
  } = useArbiGent();

  // State for arbitrage stats
  const [arbitrageStats, setArbitrageStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastStatsUpdate, setLastStatsUpdate] = useState<Date | null>(null);
  const [previousStats, setPreviousStats] = useState<any>(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'info' | 'profit' | 'loss'>('info');

  // Use ref to avoid dependency issues
  const arbitrageStatsRef = useRef<any>(null);

  // Fetch arbitrage stats
  const fetchArbitrageStats = useCallback(async (isBackground = false) => {
    if (!connected || !account?.address) {
      console.log('Not fetching stats - not connected or no address');
      setArbitrageStats(null);
      setIsInitialLoad(false);
      return;
    }


    // Only show loading spinner for manual refreshes, not background updates
    if (!isBackground) {
      setIsLoadingStats(true);
    }

    try {
      const response = await apiService.getArbitrageStats(account.address);

      if (response.success) {

        // Store previous stats for smooth transitions
        const currentStats = arbitrageStatsRef.current;
        if (currentStats) {
          setPreviousStats(currentStats);

          // Show notification for significant changes
          const profitChange = response.data.arbitrageStats.totalProfitLoss - currentStats.totalProfitLoss;
          if (Math.abs(profitChange) > 0.01) {
            setNotificationMessage(`Arbitrage updated: ${profitChange >= 0 ? '+' : ''}$${profitChange.toFixed(2)}`);
            setNotificationType(profitChange >= 0 ? 'profit' : 'loss');
            setShowUpdateNotification(true);
          }
        }

        setArbitrageStats(response.data.arbitrageStats);
        arbitrageStatsRef.current = response.data.arbitrageStats;
        setLastStatsUpdate(new Date());
        setIsInitialLoad(false);
      } else {
        console.warn('❌ Failed to fetch arbitrage stats:', response.error);
        if (isInitialLoad) {
          setArbitrageStats(null);
        }
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error('💥 Error fetching arbitrage stats:', error);
      if (isInitialLoad) {
        setArbitrageStats(null);
      }
      setIsInitialLoad(false);
    } finally {
      if (!isBackground) {
        setIsLoadingStats(false);
      }
    }
  }, [connected, account?.address]);

  // Fetch arbitrage stats on mount and when wallet changes
  useEffect(() => {
    fetchArbitrageStats();
  }, [fetchArbitrageStats]);

  // Set wallet address when account changes
  useEffect(() => {
    if (account?.address) {
      setWalletAddress(account.address);
    }
  }, [account?.address, setWalletAddress]);

  // Set up stats update callback - only for agent-triggered updates
  useEffect(() => {
    onStatsUpdate(() => {
      console.log('Stats update callback triggered from agent');
      setTimeout(() => {
        fetchArbitrageStats(true); // Background refresh when agent updates stats
      }, 500); // Small delay to ensure backend has processed
    });
  }, [onStatsUpdate, fetchArbitrageStats]);

  // Calculate total vault value in USD
  const calculateTotalVaultValue = () => {
    if (!vault || !tokenPrices) return { total: 0, aptBalance: 0 };

    let total = 0;
    let aptBalance = 0;

    vault.balances.forEach(balance => {
      const symbol = balance.coinSymbol.toUpperCase();
      const price = tokenPrices[symbol];
      if (price) {
        const decimals = symbol === 'APT' ? 8 : 6;
        const balanceNum = (parseFloat(balance.balance) || 0) / Math.pow(10, decimals);
        const priceStr = price.price.replace('$', '').replace(',', '');
        const priceNum = parseFloat(priceStr) || 0;
        const value = balanceNum * priceNum;
        total += value;

        if (symbol === 'APT') {
          aptBalance = balanceNum;
        }
      }
    });

    return { total, aptBalance };
  };

  const vaultStats = calculateTotalVaultValue();
  const aptPrice = tokenPrices.APT?.price || '$0.00';
  const aptChange = tokenPrices.APT?.change || '+0.0%';

  // Transform opportunities for display
  const displayOpportunities = (opportunities || []).slice(0, 5).map(opp => {
    const fromToken = opp.route.from_pair?.split('_')[0]?.toUpperCase() || 'UNKNOWN';
    const toToken = opp.route.to_pair?.split('_')[1]?.toUpperCase() || 'APT';

    return {
      pair: `${fromToken}/${toToken}`,
      route: `${opp.route.from_dex} → ${opp.route.to_dex}`,
      spread: `${(opp.profitability.price_difference_percent || 0).toFixed(2)}%`,
      profit: `$${opp.profitability.net_profit_usd.toFixed(2)}`,
      gas: `${(opp.charges?.gas_fees?.total_gas_cost_apt || 0).toFixed(3)} APT`,
      risk: opp.risk_level.toUpperCase(),
      isExecutable: opp.profitability.is_profitable && opp.profitability.net_profit_usd > 1
    };
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW": return "bg-success/20 text-success border-success/30";
      case "MEDIUM": case "MED": return "bg-warning/20 text-warning border-warning/30";
      case "HIGH": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-background dark relative overflow-hidden">
        <AnimatedBackground />
        <Header />
        <main className="pt-32 pb-16 relative z-10">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-md mx-auto"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-6">
                <Wallet className="h-9 w-9 text-primary" />
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-wide text-foreground mb-4">
                DASHBOARD
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Please connect your wallet to access the dashboard.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Show skeleton loader during initial load
  if (isInitialLoad && connected) {
    return <DashboardSkeleton />;
  }


  return (
    <div className="min-h-screen bg-background dark relative overflow-hidden">
      <AnimatedBackground />
      <Header />

      {/* Update Notification */}
      <UpdateNotification
        show={showUpdateNotification}
        message={notificationMessage}
        type={notificationType}
        onHide={() => setShowUpdateNotification(false)}
      />

      <main className="pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl lg:text-5xl font-bold tracking-wide text-foreground mb-3"
              >
                DASHBOARD
              </motion.h1>
              <p className="text-muted-foreground text-lg">
                Manage your autonomous trading agents.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="default"
                onClick={() => fetchArbitrageStats(false)}
                disabled={isLoadingStats}
                className="text-primary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
                Refresh Stats
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatsCard
              icon={Wallet}
              label="Total Vault Balance"
              value={`$${vaultStats.total.toFixed(2)}`}
              // subValue={`APT: ${vaultStats.aptBalance.toFixed(4)}`}
              delay={0}
              isLoading={vaultLoading}
            />
            {(() => {
              const plValue = isInitialLoad ? 0 : (arbitrageStats?.totalProfitLoss || 0);

              // Temporary simple display for debugging
              if (!isInitialLoad && arbitrageStats?.totalProfitLoss !== undefined) {
              }

              return (
                <StatsCard
                  icon={TrendingUp}
                  label="Total Arbitrage"
                  value={plValue}
                  subValue={`${arbitrageStats?.totalTrades || 0} trades • ${arbitrageStats?.totalSessions || 0} sessions`}
                  trend={{
                    value: arbitrageStats?.totalProfitLoss > 0 ? `+${((arbitrageStats.totalProfitLoss / Math.max(vaultStats.total, 100)) * 100).toFixed(1)}%` : "0.0%",
                    isPositive: (arbitrageStats?.totalProfitLoss || 0) >= 0
                  }}
                  delay={0.1}
                  isLoading={isInitialLoad}
                  isAnimated={true}
                  previousValue={previousStats?.totalProfitLoss}
                  showChangeIndicator={true}
                  isUpdating={isLoadingStats && !isInitialLoad}
                />
              );
            })()}
            <StatsCard
              icon={Bot}
              label="Active Agents"
              value={isRunning ? "1" : "0"}
              subValue={isRunning ? `ArbiGent running • ${runningDuration}` : "No agents running"}
              delay={0.2}
            />
            <StatsCard
              icon={Activity}
              label="APT Price"
              value={aptPrice}
              subValue={`24h: ${aptChange}`}
              delay={0.3}
              isLoading={marketLoading}
            />
          </div>

          {/* Quick Actions */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="rounded-xl border border-border bg-card p-6">


            
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold tracking-wide text-foreground mb-2">NO ACTIVE AGENTS</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Deploy your first autonomous trading agent to start capturing arbitrage opportunities across Aptos DEXs.
                </p>
                <Button variant="glow" size="lg" asChild>
                  <Link to="/agents">
                    Launch Your First Agent
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-7 hover:border-primary/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold tracking-wide text-foreground flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  ACTIVE AGENTS
                </h2>
                <div className="flex items-center gap-3">
                  {isRunning && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/15 border border-success/30 shadow-lg shadow-success/10"
                    >
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
                      </span>
                      <span className="text-xs font-mono font-semibold text-success tracking-wide">RUNNING</span>
                    </motion.div>
                  )}
                  {/* <span className="text-sm text-muted-foreground">
                    {isRunning ? '1 Active' : '0 Active'}
                  </span> */}
                  {isRunning ?null: (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 text-white">
    <div className="flex gap-3">
      <Button variant="outline" size="default" asChild>
        <Link to="/vault">
          <Vault className="h-4 w-4" />
          Go to Vault
        </Link>
      </Button>
      <Button variant="default" size="default" asChild>
        <Link to="/agents">
          + Launch New Agent
        </Link>
      </Button>
    </div>
  </div>
) }
                </div>
              </div>

              {isRunning ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Agent Status Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-2xl border border-border bg-muted/30 backdrop-blur-sm p-5 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-success" />
                        </span>
                        <span className="font-display font-bold text-foreground text-lg">ArbiGent #1</span>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">Running: {runningDuration}</span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">Strategy:</span>
                        <span className="font-mono text-foreground font-medium">{agentConfig.selectedPair}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">Risk Level:</span>
                        <span className="font-mono text-foreground font-medium">{agentConfig.riskTolerance}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">Min Profit:</span>
                        <span className="font-mono text-foreground font-medium">{agentConfig.minProfitThreshold.toFixed(4)}%</span>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mt-5 pt-4 border-t border-border">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-xl bg-success/10 border border-success/20">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Session P/L</p>
                          <p className="font-mono text-lg font-bold text-success">+${agentState.totalProfit.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/50">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Trades</p>
                          <p className="font-mono text-lg font-bold text-foreground">{agentState.tradesExecuted}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Success</p>
                          <p className="font-mono text-lg font-bold text-primary">
                            {agentState.tradesExecuted > 0
                              ? ((agentState.tradesExecuted / (agentState.tradesExecuted + agentState.tradesSkipped)) * 100).toFixed(0)
                              : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-2xl border border-border bg-muted/30 backdrop-blur-sm p-5"
                  >
                    <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Recent Activity
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                      {logs.slice(-5).reverse().map((log, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 text-xs p-2.5 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                        >
                          <span className="text-muted-foreground whitespace-nowrap font-mono">{log.time}</span>
                          <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[10px] ${
                            log.type === 'SUCCESS' ? 'text-success bg-success/15' :
                            log.type === 'ERROR' ? 'text-destructive bg-destructive/15' :
                            log.type === 'WARNING' ? 'text-warning bg-warning/15' :
                            log.type === 'SCAN' ? 'text-primary bg-primary/15' :
                            'text-muted-foreground bg-muted'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-foreground truncate flex-1">{log.message}</span>
                        </motion.div>
                      ))}
                      {logs.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">No activity yet</p>
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 mx-auto mb-5 border border-border">
                    <Shield className="h-9 w-9 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium mb-2">No active agents</p>
                  <p className="text-sm text-muted-foreground">Start an agent to begin autonomous trading</p>
                </motion.div>
              )}
            </div>
          </motion.div>


          {/* Opportunities Table */}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
