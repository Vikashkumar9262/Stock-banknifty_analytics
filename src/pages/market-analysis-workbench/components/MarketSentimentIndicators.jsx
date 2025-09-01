import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MarketSentimentIndicators = () => {
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [timeRange, setTimeRange] = useState('1D');

  // Mock sentiment data
  const sentimentData = {
    overall: {
      score: 72,
      trend: 'bullish',
      change: '+5.2',
      confidence: 'high'
    },
    news: {
      score: 68,
      trend: 'neutral',
      change: '+2.1',
      confidence: 'medium',
      sources: 247,
      positive: 156,
      negative: 91
    },
    social: {
      score: 75,
      trend: 'bullish',
      change: '+8.3',
      confidence: 'high',
      mentions: 12847,
      engagement: 89234
    },
    options: {
      score: 69,
      trend: 'neutral',
      change: '-1.4',
      confidence: 'medium',
      putCallRatio: 0.87,
      maxPain: 48500,
      impliedVolatility: 18.5
    },
    institutional: {
      score: 78,
      trend: 'bullish',
      change: '+3.7',
      confidence: 'high',
      netBuying: 1247.5,
      participation: 67.8
    }
  };

  const sentimentBreakdown = [
    { name: 'Very Bullish', value: 28, color: '#10B981' },
    { name: 'Bullish', value: 35, color: '#34D399' },
    { name: 'Neutral', value: 22, color: '#94A3B8' },
    { name: 'Bearish', value: 12, color: '#F87171' },
    { name: 'Very Bearish', value: 3, color: '#EF4444' }
  ];

  const historicalSentiment = [
    { time: '09:00', overall: 65, news: 62, social: 68, options: 61, institutional: 70 },
    { time: '10:00', overall: 67, news: 64, social: 71, options: 63, institutional: 72 },
    { time: '11:00', overall: 69, news: 66, social: 73, options: 65, institutional: 74 },
    { time: '12:00', overall: 71, news: 68, social: 75, options: 67, institutional: 76 },
    { time: '13:00', overall: 72, news: 68, social: 75, options: 69, institutional: 78 },
    { time: '14:00', overall: 70, news: 67, social: 74, options: 68, institutional: 77 },
    { time: '15:00', overall: 72, news: 68, social: 75, options: 69, institutional: 78 }
  ];

  const newsHeadlines = [
    {
      id: 1,
      headline: "RBI maintains repo rate at 6.5%, signals cautious optimism for banking sector",
      sentiment: 'positive',
      impact: 'high',
      source: 'Economic Times',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      headline: "HDFC Bank reports strong Q3 results, beats analyst expectations",
      sentiment: 'positive',
      impact: 'medium',
      source: 'Business Standard',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      headline: "Banking sector faces headwinds from rising NPAs in commercial lending",
      sentiment: 'negative',
      impact: 'medium',
      source: 'Mint',
      timestamp: '6 hours ago'
    },
    {
      id: 4,
      headline: "Foreign institutional investors increase stake in private banks",
      sentiment: 'positive',
      impact: 'high',
      source: 'Reuters',
      timestamp: '8 hours ago'
    }
  ];

  const getSentimentColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };

  const getSentimentBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-primary/10';
    if (score >= 40) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'bullish': return 'TrendingUp';
      case 'bearish': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'ThumbsUp';
      case 'negative': return 'ThumbsDown';
      default: return 'Minus';
    }
  };

  const getSentimentTextColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const renderMetricCard = (key, data) => {
    return (
      <div
        key={key}
        onClick={() => setSelectedMetric(key)}
        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
          selectedMetric === key 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-foreground capitalize">{key}</h4>
          <Icon 
            name={getTrendIcon(data?.trend)} 
            size={16} 
            className={getSentimentColor(data?.score)}
          />
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className={`text-2xl font-bold ${getSentimentColor(data?.score)}`}>
            {data?.score}
          </span>
          <span className={`text-sm ${data?.change?.startsWith('+') ? 'text-success' : 'text-error'}`}>
            {data?.change}%
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground capitalize">{data?.trend}</span>
          <span className={`px-2 py-1 rounded ${getSentimentBgColor(data?.score)} ${getSentimentColor(data?.score)}`}>
            {data?.confidence}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Market Sentiment</h3>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {['1H', '1D', '1W']?.map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-1 text-xs rounded transition-micro ${
                  timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => console.log('Refresh sentiment data')}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-60px)]">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Sentiment Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(sentimentData)?.map(([key, data]) => 
              renderMetricCard(key, data)
            )}
          </div>

          {/* Sentiment Breakdown Pie Chart */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Sentiment Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sentimentBreakdown?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {sentimentBreakdown?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-muted-foreground">{item?.name}: {item?.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Historical Sentiment Chart */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Sentiment Trends</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalSentiment} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey={selectedMetric} 
                    fill="var(--color-primary)" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* News Headlines */}
          <div className="bg-muted/30 rounded-lg p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Market News</h4>
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
                onClick={() => console.log('View all news')}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {newsHeadlines?.map((news) => (
                <div key={news?.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-micro">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getSentimentIcon(news?.sentiment)} 
                        size={14} 
                        className={getSentimentTextColor(news?.sentiment)}
                      />
                      <span className={`text-xs px-2 py-1 rounded ${getImpactColor(news?.impact)} bg-current/10`}>
                        {news?.impact?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{news?.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed mb-2">
                    {news?.headline}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{news?.source}</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Eye" size={12} />
                      <span>Read more</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">
              {sentimentData?.news?.sources}
            </div>
            <div className="text-xs text-muted-foreground">News Sources</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">
              {(sentimentData?.social?.mentions / 1000)?.toFixed(1)}K
            </div>
            <div className="text-xs text-muted-foreground">Social Mentions</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {sentimentData?.options?.putCallRatio}
            </div>
            <div className="text-xs text-muted-foreground">Put/Call Ratio</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              ₹{sentimentData?.institutional?.netBuying}Cr
            </div>
            <div className="text-xs text-muted-foreground">FII Net Buying</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentIndicators;