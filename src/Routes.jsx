import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import TradingIntelligenceDashboard from './pages/trading-intelligence-dashboard';
import MarketAnalysisWorkbench from './pages/market-analysis-workbench';
import ModelPerformanceAnalytics from './pages/model-performance-analytics';
import RiskManagementCenter from './pages/risk-management-center';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<MarketAnalysisWorkbench />} />
        <Route path="/trading-intelligence-dashboard" element={<TradingIntelligenceDashboard />} />
        <Route path="/market-analysis-workbench" element={<MarketAnalysisWorkbench />} />
        <Route path="/model-performance-analytics" element={<ModelPerformanceAnalytics />} />
        <Route path="/risk-management-center" element={<RiskManagementCenter />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
