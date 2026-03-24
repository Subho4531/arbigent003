import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PriceDataPoint {
  time: number;
  APT: number;
  USDC: number;
  USDT: number;
}

interface TokenPriceInfo {
  price: number;
  prevPrice: number;
  color: string;
  name: string;
}

type TokenKey = 'APT' | 'USDC' | 'USDT';

// Coinbase API endpoints
const COINBASE_APT_API = 'https://api.coinbase.com/v2/prices/APT-USD/spot';
const COINBASE_USDC_API = 'https://api.coinbase.com/v2/prices/USDC-USD/spot';
const COINBASE_USDT_API = 'https://api.coinbase.com/v2/prices/USDT-USD/spot';

// 5 minute window = 300 seconds, at 3s intervals = 100 max points
const MAX_POINTS = 100;
const REFRESH_INTERVAL = 3000;

const PriceChart = () => {
  const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([]);
  const [prices, setPrices] = useState<Record<string, TokenPriceInfo>>({
    APT: { price: 0, prevPrice: 0, color: '#ef4444', name: 'APT' },
    USDC: { price: 1, prevPrice: 1, color: '#3b82f6', name: 'USDC' },
    USDT: { price: 1, prevPrice: 1, color: '#22c55e', name: 'USDT' }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<PriceDataPoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedToken, setSelectedToken] = useState<TokenKey>('APT');

  const fetchPrices = useCallback(async () => {
    try {
      const [aptResponse, usdcResponse, usdtResponse] = await Promise.all([
        fetch(COINBASE_APT_API),
        fetch(COINBASE_USDC_API),
        fetch(COINBASE_USDT_API)
      ]);

      let aptPrice = 1.5;
      let usdcPrice = 1;
      let usdtPrice = 1;

      if (aptResponse.ok) {
        const data = await aptResponse.json();
        aptPrice = parseFloat(data.data?.amount) || 1.5;
      }
      if (usdcResponse.ok) {
        const data = await usdcResponse.json();
        usdcPrice = parseFloat(data.data?.amount) || 1;
      }
      if (usdtResponse.ok) {
        const data = await usdtResponse.json();
        usdtPrice = parseFloat(data.data?.amount) || 1;
      }

      setPrices(prev => ({
        APT: { ...prev.APT, price: aptPrice, prevPrice: prev.APT.price || aptPrice },
        USDC: { ...prev.USDC, price: usdcPrice, prevPrice: prev.USDC.price || usdcPrice },
        USDT: { ...prev.USDT, price: usdtPrice, prevPrice: prev.USDT.price || usdtPrice }
      }));

      const newPoint: PriceDataPoint = {
        time: Date.now(),
        APT: aptPrice,
        USDC: usdcPrice,
        USDT: usdtPrice
      };

      setPriceHistory(prev => {
        const updated = [...prev, newPoint];
        // Rolling 5-minute window
        if (updated.length > MAX_POINTS) {
          return updated.slice(-MAX_POINTS);
        }
        return updated;
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Price fetch error:', err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchPrices();
    
    // Set up interval for continuous updates
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.5, 10));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  // Chart dimensions
  const chartWidth = 900;
  const chartHeight = 280;
  const padding = { top: 25, right: 80, bottom: 20, left: 20 };

  // Y-axis: fixed step of 0.0015 per grid cell
  const yAxisStep = 0.0015;
  const numYGridLines = 8;
  const baseYRange = yAxisStep * numYGridLines; // 0.012 total range at 100%
  const zoomedYRange = baseYRange / zoomLevel;
  
  // Center on current price
  const currentPrice = prices[selectedToken]?.price || 1;
  const tokenColor = prices[selectedToken]?.color || '#ef4444';
  const minPrice = currentPrice - zoomedYRange / 2;
  const maxPrice = currentPrice + zoomedYRange / 2;
  const priceRange = maxPrice - minPrice;

  // Dynamic width scaling based on data points
  const dataPoints = priceHistory.length;
  const effectiveWidth = dataPoints > 1 
    ? chartWidth - padding.left - padding.right
    : chartWidth - padding.left - padding.right;

  const scaleX = (index: number) => {
    if (dataPoints <= 1) return padding.left + effectiveWidth / 2;
    return (index / (dataPoints - 1)) * effectiveWidth + padding.left;
  };

  const scaleY = (price: number) => {
    const clampedPrice = Math.max(minPrice, Math.min(maxPrice, price));
    return chartHeight - padding.bottom - ((clampedPrice - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleFactorX = chartWidth / rect.width;
    const scaleFactorY = chartHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleFactorX;
    const y = (e.clientY - rect.top) * scaleFactorY;
    setMousePos({ x, y });

    if (dataPoints > 1) {
      const index = Math.round((x - padding.left) / (effectiveWidth / (dataPoints - 1)));
      if (index >= 0 && index < dataPoints) {
        setHoveredPoint(priceHistory[index]);
      }
    }
  };

  const renderGridlines = () => {
    const lines = [];
    
    // Y-axis: use fixed step of 0.0015 (adjusted by zoom)
    const actualYStep = yAxisStep / zoomLevel;
    const startPrice = Math.floor(minPrice / actualYStep) * actualYStep;
    
    for (let price = startPrice; price <= maxPrice + actualYStep; price += actualYStep) {
      const y = scaleY(price);
      if (y >= padding.top && y <= chartHeight - padding.bottom) {
        lines.push(
          <g key={`h-${price.toFixed(6)}`}>
            <line
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              stroke="rgba(148, 163, 184, 0.08)"
              strokeWidth="1"
            />
            <text
              x={chartWidth - padding.right + 8}
              y={y + 4}
              fontSize="10"
              fill="#64748b"
              fontFamily="monospace"
            >
              ${price.toFixed(4)}
            </text>
          </g>
        );
      }
    }

    // X-axis: 5 second intervals
    const xIntervalSec = 5;
    const totalSeconds = dataPoints > 1 ? (dataPoints - 1) * 3 : 0; // 3s per data point
    const numXLines = Math.floor(totalSeconds / xIntervalSec);
    
    for (let i = 0; i <= numXLines; i++) {
      const secondsFromStart = i * xIntervalSec;
      const dataIndex = secondsFromStart / 3; // Convert to data point index
      const x = scaleX(dataIndex);
      
      if (x >= padding.left && x <= chartWidth - padding.right) {
        lines.push(
          <g key={`v-${i}`}>
            <line
              x1={x}
              y1={padding.top}
              x2={x}
              y2={chartHeight - padding.bottom}
              stroke="rgba(148, 163, 184, 0.05)"
              strokeWidth="1"
            />
          </g>
        );
      }
    }

    return lines;
  };

  const renderLine = (dataKey: TokenKey, color: string) => {
    if (dataPoints < 1 || dataKey !== selectedToken) return null;

    // Single point - render just a dot
    if (dataPoints === 1) {
      const point = priceHistory[0];
      return (
        <g key={dataKey}>
          <circle
            cx={scaleX(0)}
            cy={scaleY(point[dataKey])}
            r="5"
            fill={color}
            stroke="#0f172a"
            strokeWidth="2"
          />
        </g>
      );
    }

    const points = priceHistory.map((p, i) => `${scaleX(i)},${scaleY(p[dataKey])}`).join(' ');

    return (
      <g key={dataKey}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon
          points={`${scaleX(0)},${chartHeight - padding.bottom} ${points} ${scaleX(dataPoints - 1)},${chartHeight - padding.bottom}`}
          fill={`url(#gradient-${dataKey})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        {priceHistory.map((p, i) => (
          <circle
            key={`${dataKey}-${i}`}
            cx={scaleX(i)}
            cy={scaleY(p[dataKey])}
            r={i === dataPoints - 1 ? 5 : 2}
            fill={color}
            stroke="#0f172a"
            strokeWidth="1.5"
            opacity={i === dataPoints - 1 ? 1 : 0.7}
          />
        ))}
        {/* Current price label */}
        <g>
          <rect
            x={chartWidth - padding.right + 2}
            y={scaleY(priceHistory[dataPoints - 1][dataKey]) - 12}
            width="72"
            height="24"
            fill={color}
            rx="4"
          />
          <text
            x={chartWidth - padding.right + 38}
            y={scaleY(priceHistory[dataPoints - 1][dataKey]) + 4}
            fontSize="11"
            fill="#fff"
            textAnchor="middle"
            fontFamily="monospace"
            fontWeight="bold"
          >
            ${priceHistory[dataPoints - 1][dataKey].toFixed(6)}
          </text>
        </g>
      </g>
    );
  };

  const getChangePercent = (token: TokenPriceInfo) => {
    if (token.prevPrice === 0) return 0;
    return ((token.price - token.prevPrice) / token.prevPrice) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-3xl border border-border bg-card/90 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-shadow duration-500"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg tracking-wide text-foreground">LIVE PRICE</span>
            {isLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />}
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0 rounded-lg hover:bg-muted/70">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetZoom} className="h-8 w-8 p-0 rounded-lg hover:bg-muted/70">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0 rounded-lg hover:bg-muted/70">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground ml-2 bg-muted/50 px-2 py-1 rounded-md">{(zoomLevel * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Token Selector Cards */}
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(prices) as [TokenKey, TokenPriceInfo][]).map(([key, info]) => {
            const change = getChangePercent(info);
            const isSelected = selectedToken === key;
            return (
              <motion.div
                key={key}
                onClick={() => setSelectedToken(key)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-offset-2 ring-offset-background shadow-lg' 
                    : 'opacity-60 hover:opacity-90'
                }`}
                style={{
                  backgroundColor: `${info.color}${isSelected ? '15' : '08'}`,
                  borderColor: `${info.color}${isSelected ? '60' : '30'}`,
                  ringColor: isSelected ? info.color : undefined,
                  boxShadow: isSelected ? `0 8px 24px ${info.color}20` : undefined
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: info.color, boxShadow: `0 0 8px ${info.color}60` }}
                    />
                    <span className="text-xs font-bold tracking-wide" style={{ color: info.color }}>{key}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${change >= 0 ? 'text-green-400 bg-green-400/15' : 'text-red-400 bg-red-400/15'}`}>
                    {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{change >= 0 ? '+' : ''}{change.toFixed(4)}%</span>
                  </div>
                </div>
                <motion.div
                  key={info.price}
                  initial={{ scale: 1.03, color: change >= 0 ? '#22c55e' : '#ef4444' }}
                  animate={{ scale: 1, color: info.color }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-xl font-bold tracking-tight"
                >
                  ${info.price.toFixed(6)}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="relative bg-slate-950/80" style={{ height: chartHeight }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
          className="cursor-crosshair"
        >
          {renderGridlines()}
          {renderLine(selectedToken, tokenColor)}

          {/* Crosshair */}
          {hoveredPoint && (
            <g>
              <line
                x1={padding.left}
                y1={mousePos.y}
                x2={chartWidth - padding.right}
                y2={mousePos.y}
                stroke="rgba(148, 163, 184, 0.5)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <line
                x1={mousePos.x}
                y1={padding.top}
                x2={mousePos.x}
                y2={chartHeight - padding.bottom}
                stroke="rgba(148, 163, 184, 0.5)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </g>
          )}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg p-3 text-xs z-30 pointer-events-none shadow-2xl"
            style={{
              left: mousePos.x > chartWidth / 2 ? mousePos.x - 150 : mousePos.x + 15,
              top: Math.max(mousePos.y - 60, 10)
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: tokenColor }}
                />
                <span className="text-gray-300 font-medium">{selectedToken}</span>
              </div>
              <span className="text-white font-mono font-bold">${hoveredPoint[selectedToken].toFixed(6)}</span>
            </div>
          </div>
        )}

        {/* Selected Token Indicator */}
        <div className="absolute bottom-2 left-4 flex items-center gap-2 text-xs bg-slate-900/70 px-3 py-1.5 rounded-lg">
          <div 
            className="w-3 h-1 rounded" 
            style={{ backgroundColor: tokenColor }}
          />
          <span className="text-gray-300 font-medium">{selectedToken}</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">{priceHistory.length} points</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceChart;
