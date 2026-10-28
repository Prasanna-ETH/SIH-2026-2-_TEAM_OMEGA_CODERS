import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Download,
  AlertOctagon,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-600 text-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b2545] mb-2"></div>
        <p>Generating National Educational Governance Analytics...</p>
      </div>
    );
  }

  if (!data) return null;

  const { summary, category_distribution, error_trends, state_breakdown, risk_distribution, historical_trends } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            AICTE National Intelligence &amp; Oversight
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">
            Analytics &amp; Compliance Reporting
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Quantitative metrics, intake utilisation efficiency, demographic representation, and anomaly risk scoring
          </p>
        </div>

        {/* Quick Report Download Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href="/api/reports/enrolment.csv"
            className="flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-300 px-2.5 py-1.5 rounded font-semibold text-slate-700 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Enrolment CSV</span>
          </a>
          <a
            href="/api/reports/validation.csv"
            className="flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-300 px-2.5 py-1.5 rounded font-semibold text-slate-700 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Validation CSV</span>
          </a>
          <a
            href="/api/reports/compliance.csv"
            className="flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-300 px-2.5 py-1.5 rounded font-semibold text-slate-700 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Intake CSV</span>
          </a>
        </div>
      </div>

      {/* Top 4 Regulatory Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">National Sanctioned Seats</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{summary.total_approved_intake}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">AICTE approved capacity ceiling</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Actual Students Admitted</div>
          <div className="text-2xl font-bold text-emerald-800 font-mono">{summary.total_actual_enrolment}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Verified APAAR-linked enrolments</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Intake Utilisation Efficiency</div>
          <div className="text-2xl font-bold text-blue-900 font-mono">{summary.overall_utilisation_pct}%</div>
          <div className="text-[11px] text-blue-700 mt-0.5">National seat absorption rate</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Unresolved Anomaly Signals</div>
          <div className="text-2xl font-bold text-amber-800 font-mono">{summary.active_anomalies}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Active investigation inquiries</div>
        </div>
      </div>

      {/* Anomaly & Risk Scoring Transparent Model (Section 22) */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-2xs space-y-3">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-[#0b2545] text-sm">
              Transparent Risk Assessment &amp; Anomaly Detection Model
            </h3>
          </div>
          <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
            PROTOTYPE RISK ASSESSMENT
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The regulatory risk score is calculated via deterministic weighted rules rather than opaque generative AI algorithms:
        </p>

        <div className="bg-slate-50 p-3 rounded border border-slate-300 font-mono text-xs text-slate-800">
          Risk Score = (Duplicate APAAR Signals × 25) + (Capacity Intake Overflow × 20) + (Repeated Format Re-submissions × 15) + (Cross-Institution Enrolments × 30)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
            <span className="font-bold text-emerald-800 block">Low Risk Institutions (Score 0–29)</span>
            <span className="text-slate-600 text-[11px]">Normal statutory compliance. Standard reporting workflow.</span>
            <div className="mt-1 font-mono font-bold text-emerald-900">{risk_distribution.low_risk} Institutions</div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded">
            <span className="font-bold text-amber-800 block">Moderate Attention (Score 30–59)</span>
            <span className="text-slate-600 text-[11px]">Supernumerary variance or minor format correction queries.</span>
            <div className="mt-1 font-mono font-bold text-amber-900">{risk_distribution.moderate_risk} Institutions</div>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded">
            <span className="font-bold text-rose-800 block">High Risk / Inquiry Required (Score 60+)</span>
            <span className="text-slate-600 text-[11px]">Active concurrent duplicate enrolment or intake breaches.</span>
            <div className="mt-1 font-mono font-bold text-rose-900">{risk_distribution.high_risk} Institutions</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Demographic Distribution */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs space-y-3">
          <h3 className="font-bold text-[#0b2545] text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
            Social Category Representation
          </h3>
          <div className="space-y-2 text-xs">
            {category_distribution.map((cat: any) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>{cat.name}</span>
                  <span className="font-bold font-mono">{cat.count} students</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#134074] h-full"
                    style={{ width: `${(cat.count / summary.total_actual_enrolment) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Error Trends */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs space-y-3">
          <h3 className="font-bold text-[#0b2545] text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
            Validation Error Trends by Rule
          </h3>
          <div className="space-y-2 text-xs">
            {error_trends.map((err: any) => (
              <div key={err.rule} className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">{err.rule}</span>
                  <span className="text-[10px] text-slate-500 block">Regulatory validation code</span>
                </div>
                <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold font-mono">
                  {err.count} occurrences
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Longitudinal Trends */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-[#0b2545] text-sm">Four-Year Enrolment &amp; Compliance Trajectory</h3>
          <p className="text-xs text-slate-500">Longitudinal monitoring of national intake utilisation and regulatory compliance rate</p>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Academic Year</th>
                <th className="text-right">Sanctioned Intake Capacity</th>
                <th className="text-right">Actual Student Enrolment</th>
                <th className="text-right">Compliance Rate</th>
                <th>Regulatory Standing</th>
              </tr>
            </thead>
            <tbody>
              {historical_trends.map((h: any) => (
                <tr key={h.academic_year}>
                  <td className="font-bold text-slate-900">{h.academic_year}</td>
                  <td className="text-right font-mono">{h.approved_intake}</td>
                  <td className="text-right font-mono font-bold">{h.actual_enrolment}</td>
                  <td className="text-right font-mono text-emerald-800 font-bold">{h.compliance_rate}</td>
                  <td>
                    <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-semibold">
                      Statutory Clearance Logged
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
