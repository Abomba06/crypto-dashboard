import {
  LogEntry,
  Trade,
  Signal,
  MarketEvent,
  EvaluationRecord,
  ResearchReport,
  VariantReport,
  ComparisonReport,
  BotState,
} from '../types/trading';
import {
  logs,
  trades,
  signals,
  marketEvents,
  evaluations,
  researchReports,
  variantReports,
  comparisonReports,
  botState,
} from '../data/mockData';

export const fileService = {
  getCsvFile: (name: string): Promise<Trade[] | Signal[] | MarketEvent[] | EvaluationRecord[]> => {
    if (name === 'trades.csv') return Promise.resolve(trades);
    if (name === 'signals.csv') return Promise.resolve(signals);
    if (name === 'market_events.csv') return Promise.resolve(marketEvents);
    if (name === 'candidate_eval.csv' || name === 'rejected_signal_eval.csv') return Promise.resolve(evaluations);
    return Promise.resolve([]);
  },
  getJsonFile: (name: string): Promise<Record<string, unknown> | BotState> => {
    if (name === 'research_report.json') return Promise.resolve({ reports: researchReports });
    if (name === 'per_variant_report.json') return Promise.resolve({ variants: variantReports });
    if (name === 'comparison_report.json') return Promise.resolve({ comparisons: comparisonReports });
    if (name === 'state.json') return Promise.resolve(botState);
    return Promise.resolve({});
  },
  getLogFile: (): Promise<LogEntry[]> => Promise.resolve(logs),
};
