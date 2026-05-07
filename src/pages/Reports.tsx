import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';

function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [comparisons, setComparisons] = useState<any[]>([]);

  useEffect(() => {
    dashboardService.getResearchReports().then(setReports);
    dashboardService.getVariantReports().then(setVariants);
    dashboardService.getComparisonReports().then(setComparisons);
  }, []);

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">Reports</p>
          <h2>Research summaries</h2>
        </div>
      </div>
      <div className="report-grid">
        {reports.map((report) => (
          <article className="report-card" key={report.id}>
            <h3>{report.name}</h3>
            <p>{report.summary}</p>
            <div className="report-metrics">
              {Object.entries(report.metrics).map(([key, value]) => (
                <div key={key}>
                  <small>{key}</small>
                  <strong>{String(value)}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="report-grid">
        {variants.map((variant) => (
          <article className="report-card" key={variant.id}>
            <h3>{variant.variant}</h3>
            <div>Win rate: {variant.winRate}</div>
            <div>Avg return: {variant.avgReturn}%</div>
            <div>R/R: {variant.riskReward}</div>
            <p>{variant.observations}</p>
          </article>
        ))}
      </div>
      <div className="comparison-grid">
        {comparisons.map((comparison) => (
          <article className="report-card" key={comparison.id}>
            <h3>{comparison.label}</h3>
            <div>Current {comparison.current}</div>
            <div>Benchmark {comparison.benchmark}</div>
            <div>Delta {comparison.delta}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Reports;
