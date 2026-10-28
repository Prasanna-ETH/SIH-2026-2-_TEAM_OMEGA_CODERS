import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Building2,
  Upload,
  Users,
  AlertTriangle,
  Download,
  CheckCircle2,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

interface InstitutionDashboardProps {
  onNavigate: (route: string) => void;
}

export const InstitutionDashboardPage: React.FC<InstitutionDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const instId = user?.institution_id || 1;

  useEffect(() => {
    loadInstitutionData();
  }, [instId]);

  const loadInstitutionData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getInstitutionSummary(instId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load institution summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-600 text-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b2545] mb-2"></div>
        <p>Loading Institution Academic Compliance Profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded text-sm">
          {error || 'Unable to retrieve institution records.'}
        </div>
      </div>
    );
  }

  const { institution, academic_year, programmes, totals, recent_submissions } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Institution Identity Banner */}
      <div className="bg-white p-5 border border-slate-200 rounded shadow-2xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-[#0b2545] text-amber-400 rounded-md">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Institution Student Data Management
              </div>
              <h2 className="text-2xl font-bold text-[#0b2545] tracking-tight">{institution.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600 font-medium">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold text-slate-800">
                  {institution.aicte_id}
                </span>
                <span>•</span>
                <span>{institution.district}, {institution.state}</span>
                <span>•</span>
                <span className="text-slate-500">{institution.institution_type}</span>
                <span>•</span>
                <StatusBadge status={institution.approval_status} size="sm" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigate('/institution/upload')}
              className="flex items-center justify-center space-x-1.5 bg-[#0b2545] hover:bg-[#133863] text-white px-4 py-2 rounded text-xs font-semibold shadow transition"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Upload Student Batch</span>
            </button>

            <a
              href="/api/reports/enrolment.csv"
              className="flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded text-xs font-semibold transition"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download Roster</span>
            </a>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Sanctioned Intake (All Programmes)</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totals.approved}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Approved capacity for {academic_year}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Enrolled &amp; Validated Regular</div>
          <div className="text-2xl font-bold text-emerald-800 font-mono">{totals.actual}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            {totals.remaining} seats remaining available
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Supernumerary Admissions (TFWS/PMSSS)</div>
          <div className="text-2xl font-bold text-blue-800 font-mono">{totals.supernumerary}</div>
          <div className="text-[11px] text-blue-700 mt-0.5">Statutory quota admissions</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Regulatory Risk Assessment</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {institution.risk_score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate" title={institution.risk_signals}>
            {institution.risk_signals || 'Compliant standing'}
          </div>
        </div>
      </div>

      {/* Programme Summary Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-bold text-[#0b2545] text-sm">Approved Programmes &amp; Enrolment Quota Summary</h3>
            <p className="text-xs text-slate-500">Live monitoring of actual admitted students against approved capacity caps</p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-white border border-slate-300 px-2.5 py-1 rounded">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-800">Academic Cohort: {academic_year}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Programme</th>
                <th>Level</th>
                <th className="text-right">Approved Intake</th>
                <th className="text-right">Actual Enrolment</th>
                <th className="text-right">Supernumerary</th>
                <th className="text-right">Remaining Seats</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((p: any) => (
                <tr key={p.id}>
                  <td className="font-bold text-slate-900">{p.programme_name}</td>
                  <td className="text-xs text-slate-600">{p.degree_level}</td>
                  <td className="text-right font-mono text-slate-700">{p.approved_intake}</td>
                  <td className="text-right font-mono font-bold text-slate-900">{p.actual_enrolment}</td>
                  <td className="text-right font-mono text-blue-700">
                    {p.supernumerary} <span className="text-[10px] text-slate-400">/ {p.supernumerary_cap} max</span>
                  </td>
                  <td className="text-right font-mono font-semibold text-emerald-700">{p.remaining}</td>
                  <td>
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => onNavigate('/institution/upload')}
                      className="text-xs text-blue-700 font-semibold hover:underline"
                    >
                      Add Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Submissions History Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#0b2545] text-sm">Batch Submission History</h3>
            <p className="text-xs text-slate-500">Historical records of student files submitted, validated, and processed</p>
          </div>
          <button
            onClick={() => onNavigate('/institution/upload')}
            className="text-xs font-semibold text-blue-800 hover:underline flex items-center space-x-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New File</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Submission Date</th>
                <th>Batch Name</th>
                <th>File Name</th>
                <th className="text-right">Total Records</th>
                <th className="text-right">Valid</th>
                <th className="text-right">Warnings</th>
                <th className="text-right">Errors</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent_submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500 text-xs">
                    No batch submissions recorded yet for this session.
                  </td>
                </tr>
              ) : (
                recent_submissions.map((sub: any) => (
                  <tr key={sub.id}>
                    <td className="text-xs text-slate-600 font-mono">{sub.date}</td>
                    <td className="font-semibold text-slate-800">{sub.batch_name}</td>
                    <td className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{sub.file_name}</span>
                    </td>
                    <td className="text-right font-mono font-bold text-slate-900">{sub.total_records}</td>
                    <td className="text-right font-mono text-emerald-700 font-semibold">{sub.valid_count}</td>
                    <td className="text-right font-mono text-amber-700 font-semibold">{sub.warning_count}</td>
                    <td className="text-right font-mono text-rose-700 font-semibold">{sub.error_count}</td>
                    <td>
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
