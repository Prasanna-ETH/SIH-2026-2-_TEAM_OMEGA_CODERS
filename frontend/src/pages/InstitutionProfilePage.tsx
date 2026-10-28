import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import {
  Building2,
  ArrowLeft,
  Calendar,
  FileSpreadsheet,
  AlertTriangle,
  ShieldCheck,
  Mail,
  MapPin
} from 'lucide-react';

interface InstitutionProfileProps {
  institutionId: number;
  onBack: () => void;
}

export const InstitutionProfilePage: React.FC<InstitutionProfileProps> = ({ institutionId, onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [institutionId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getInstitutionProfile(institutionId);
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
        <p>Loading Institution Regulatory Dossier...</p>
      </div>
    );
  }

  if (!data) return null;

  const { basic_info, programmes, submissions } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-5 border border-slate-200 rounded shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start space-x-3.5">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 border border-slate-300 mt-1"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              AICTE Institution Regulatory Profile
            </div>
            <h2 className="text-2xl font-bold text-[#0b2545] tracking-tight">{basic_info.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600 font-medium">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold text-slate-800">
                {basic_info.aicte_id}
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{basic_info.district}, {basic_info.state}</span>
              </span>
              <span>•</span>
              <span>{basic_info.institution_type}</span>
              <span>•</span>
              <StatusBadge status={basic_info.approval_status} size="sm" />
            </div>
          </div>
        </div>

        {/* Risk Score Pill */}
        <div className="bg-slate-50 border border-slate-300 p-3 rounded text-right">
          <span className="text-[11px] font-semibold text-slate-500 block">Regulatory Risk Score</span>
          <div className="text-xl font-bold font-mono text-slate-900">
            {basic_info.risk_score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate max-w-xs">
            {basic_info.risk_signals}
          </span>
        </div>
      </div>

      {/* Approved Programmes Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-[#0b2545] text-sm">Sanctioned Programmes &amp; Enrolment Matrix</h3>
          <p className="text-xs text-slate-500">Official AICTE approved capacity vs actual reported enrolments</p>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Programme</th>
                <th>Degree Level</th>
                <th className="text-right">Approved Intake</th>
                <th className="text-right">Current Enrolment</th>
                <th className="text-right">Supernumerary Admitted</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((p: any) => (
                <tr key={p.id}>
                  <td className="font-bold text-slate-900">{p.programme_name}</td>
                  <td>{p.degree_level}</td>
                  <td className="text-right font-mono font-bold text-slate-700">{p.approved_intake}</td>
                  <td className="text-right font-mono font-bold text-slate-900">{p.current_enrolment}</td>
                  <td className="text-right font-mono text-blue-700">
                    {p.supernumerary} <span className="text-[10px] text-slate-400">/ {p.supernumerary_cap}</span>
                  </td>
                  <td>
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission History Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-[#0b2545] text-sm">Batch Submissions History</h3>
          <p className="text-xs text-slate-500">Chronological submissions of APAAR-based student records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Date</th>
                <th>Academic Year</th>
                <th>Batch Name</th>
                <th className="text-right">Total Records</th>
                <th className="text-right">Valid</th>
                <th className="text-right">Warnings</th>
                <th className="text-right">Errors</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500 text-xs">
                    No submissions logged.
                  </td>
                </tr>
              ) : (
                submissions.map((s: any) => (
                  <tr key={s.id}>
                    <td className="font-mono text-slate-600">{s.date}</td>
                    <td>{s.academic_year}</td>
                    <td className="font-bold text-slate-900">{s.batch_name}</td>
                    <td className="text-right font-mono font-bold">{s.total_records}</td>
                    <td className="text-right font-mono text-emerald-800 font-semibold">{s.valid}</td>
                    <td className="text-right font-mono text-amber-800 font-semibold">{s.warnings}</td>
                    <td className="text-right font-mono text-rose-800 font-semibold">{s.errors}</td>
                    <td>
                      <StatusBadge status={s.status} size="sm" />
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
