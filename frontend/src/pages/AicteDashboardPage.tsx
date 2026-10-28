import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Copy,
  ArrowRight,
  Filter,
  Download
} from 'lucide-react';

interface AicteDashboardProps {
  onNavigate: (route: string) => void;
}

export const AicteDashboardPage: React.FC<AicteDashboardProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getAicteSummary();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load central AICTE monitoring data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-600 text-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b2545] mb-2"></div>
        <p>Loading AICTE National Student Data Registry...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded text-sm">
          {error || 'Unable to load dashboard records.'}
        </div>
      </div>
    );
  }

  const { kpis, attention_institutions, recent_validation_activity, total_approved_intake, total_actual_enrolment } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">AICTE Student Data Monitoring</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            National regulatory overview of student enrolment, APAAR deduplication, and intake compliance
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-700">Academic Year:</span>
          <span className="bg-slate-100 border border-slate-300 px-2.5 py-1 rounded font-bold text-[#0b2545]">
            2026–27
          </span>
          <a
            href="/api/reports/compliance.csv"
            className="flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-2.5 py-1 rounded"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export National Report</span>
          </a>
        </div>
      </div>

      {/* 6 Compact KPI Cards answering real regulatory governance questions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded shadow-2xs border-l-4 border-l-[#0b2545]">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('kpi_institutions')}</span>
            <Building2 className="w-4 h-4 text-[#0b2545]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {kpis.institutions_reporting.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Reporting institutions</div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded shadow-2xs border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('kpi_students')}</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {kpis.student_records.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Records ingested</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded shadow-2xs border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('kpi_verified')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 tracking-tight">
            {kpis.verified_records.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Verified &amp; compliant</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded shadow-2xs border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('kpi_review')}</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800 tracking-tight">
            {kpis.requiring_review}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Validation issues open</div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded shadow-2xs border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('kpi_intake_alerts')}</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-800 tracking-tight">
            {kpis.intake_alerts}
          </div>
          <div className="text-[11px] text-rose-700 mt-0.5">Capacity threshold alerts</div>
        </div>

        {/* KPI 6 */}
        <div className="bg-white border border-slate-200 p-3.5 rounded shadow-2xs border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('kpi_conflicts')}</span>
            <Copy className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900 tracking-tight">
            {kpis.cross_conflicts}
          </div>
          <div className="text-[11px] text-purple-700 mt-0.5">Cross-institution signals</div>
        </div>
      </div>

      {/* Enrolment Monitoring: Approved Intake vs Actual Enrolment */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-200 gap-2">
          <div>
            <h3 className="font-bold text-[#0b2545] text-sm">{t('title_enrolment_monitoring')}</h3>
            <p className="text-xs text-slate-500">Statutory comparison of AICTE sanctioned seats vs recorded student enrolment</p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>
            <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-slate-700">All States</span>
            <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-slate-700">Engineering &amp; Tech</span>
          </div>
        </div>

        <div className="py-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-700">National Sanctioned Seat Utilization (2026–27)</span>
            <span className="text-slate-900 font-mono">
              {total_actual_enrolment} Enrolled / {total_approved_intake} Sanctioned (
              {((total_actual_enrolment / total_approved_intake) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex">
            <div
              className="bg-[#134074] h-full"
              style={{ width: `${Math.min(100, (total_actual_enrolment / total_approved_intake) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>0 seats</span>
            <span>98.0% National Intake Compliance</span>
            <span>{total_approved_intake} Approved Ceiling</span>
          </div>
        </div>
      </div>

      {/* Institutions Requiring Attention Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#0b2545] text-sm">{t('title_institutions_attention')}</h3>
            <p className="text-xs text-slate-500">Institutions with open validation discrepancies, capacity warnings or conflict flags</p>
          </div>
          <button
            onClick={() => onNavigate('/institutions')}
            className="text-xs font-semibold text-blue-800 hover:underline flex items-center space-x-1"
          >
            <span>View All Institutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{t('col_institution')}</th>
                <th>{t('col_state')}</th>
                <th className="text-right">{t('col_programmes')}</th>
                <th className="text-right">{t('col_approved_intake')}</th>
                <th className="text-right">{t('col_actual_enrolment')}</th>
                <th className="text-center">Risk Score</th>
                <th className="text-center">{t('col_issues')}</th>
                <th>{t('col_status')}</th>
                <th className="text-center">{t('col_action')}</th>
              </tr>
            </thead>
            <tbody>
              {attention_institutions.map((inst: any) => (
                <tr key={inst.id}>
                  <td className="font-medium text-slate-900">
                    <div>{inst.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{inst.aicte_id}</div>
                  </td>
                  <td>{inst.state}</td>
                  <td className="text-right">{inst.programme_count}</td>
                  <td className="text-right font-mono">{inst.approved_intake}</td>
                  <td className="text-right font-mono font-bold text-slate-900">{inst.actual_enrolment}</td>
                  <td className="text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      inst.risk_score >= 60 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inst.risk_score} / 100
                    </span>
                  </td>
                  <td className="text-center font-bold text-amber-700">{inst.issues}</td>
                  <td>
                    <StatusBadge status={inst.status} size="sm" />
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => onNavigate(`/institutions/${inst.id}`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-800 font-semibold border border-slate-300 rounded text-xs"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Validation Activity */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#0b2545] text-sm">{t('title_recent_validation')}</h3>
            <p className="text-xs text-slate-500">Live regulatory audit trail of automated APAAR and intake pipeline checks</p>
          </div>
          <button
            onClick={() => onNavigate('/validation')}
            className="text-xs font-semibold text-blue-800 hover:underline flex items-center space-x-1"
          >
            <span>Open Validation Centre</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{t('col_timestamp')}</th>
                <th>{t('col_institution')}</th>
                <th>Submission Ref</th>
                <th>Regulatory Issue Finding</th>
                <th>{t('col_severity')}</th>
                <th>{t('col_status')}</th>
                <th className="text-center">{t('col_action')}</th>
              </tr>
            </thead>
            <tbody>
              {recent_validation_activity.map((act: any) => (
                <tr key={act.id}>
                  <td className="text-slate-500 text-xs whitespace-nowrap">{act.timestamp}</td>
                  <td className="font-semibold text-slate-800">{act.institution}</td>
                  <td className="font-mono text-xs text-slate-600">{act.submission}</td>
                  <td className="text-slate-700 text-xs max-w-md">{act.issue}</td>
                  <td>
                    <StatusBadge status={act.severity} size="sm" />
                  </td>
                  <td>
                    <StatusBadge status={act.status} size="sm" />
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => onNavigate('/validation')}
                      className="text-xs text-blue-700 font-semibold hover:underline"
                    >
                      Review
                    </button>
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
