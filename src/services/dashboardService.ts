import {
  portfolioSummary,
  positions,
  signals,
  marketEvents,
  trades,
  logs,
  evaluations,
  researchReports,
  variantReports,
  comparisonReports,
  botState,
} from '../data/mockData';

export const dashboardService = {
  getPortfolioSummary: () => Promise.resolve(portfolioSummary),
  getPositions: () => Promise.resolve(positions),
  getSignals: () => Promise.resolve(signals),
  getMarketEvents: () => Promise.resolve(marketEvents),
  getTrades: () => Promise.resolve(trades),
  getLogs: () => Promise.resolve(logs),
  getEvaluations: () => Promise.resolve(evaluations),
  getResearchReports: () => Promise.resolve(researchReports),
  getVariantReports: () => Promise.resolve(variantReports),
  getComparisonReports: () => Promise.resolve(comparisonReports),
  getBotState: () => Promise.resolve(botState),
};
