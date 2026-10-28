import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import {
  BarChart3,
  Filter,
  Download,
  AlertOctagon,
  CheckCircle2,
  X,
  Building2,
  PieChart
} from 'lucide-react';

export const IntakeCompliancePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Filters
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    loadCompliance();
  }, [selectedState, selectedStatus]);

  const loadCompliance = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getIntakeCompliance({
        academic_year: '2026-27',
        state: selectedState || undefined,
        status: selectedStatus || undefined
      });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            AICTE Statutory Oversight
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">
            Approved Intake &amp; Capacity Compliance
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time programme-level surveillance comparing sanctioned intake limits with enrolled student cohorts
          </p>
        </div>

        <a
          href="/api/reports/compliance.csv"
          className="flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Compliance CSV</span>
        </a>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-600 font-semibold">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filters:</span>
        </div>

        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-2 border border-slate-300 rounded bg-white text-slate-700"
          >
            <option value="">All States</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Delhi">Delhi</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-slate-300 rounded bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Compliant">Compliant</option>
            <option value="Review Required">Review Required</option>
          </select>
        </div>

        {data && (
          <div className="ml-auto flex items-center space-x-3 text-xs">
            <span className="text-slate-600">
              Total Programmes: <strong>{data.total_programmes_monitored}</strong>
            </span>
            <span className="text-emerald-700 font-semibold">
              Compliant: <strong>{data.compliant_count}</strong>
            </span>
            <span className="text-rose-700 font-semibold">
              Alerts: <strong>{data.review_required_count}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Compliance Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>State</th>
                <th>Programme Name</th>
                <th className="text-right">Approved Intake</th>
                <th className="text-right">Regular Enrolled</th>
                <th className="text-right">Supernumerary</th>
                <th className="text-right">Variance</th>
                <th>Compliance Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    Loading compliance matrix...
                  </td>
                </tr>
              ) : !data || data.records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    No programme records matching filters.
                  </td>
                </tr>
              ) : (
                data.records.map((row: any) => (
                  <tr
                    key={row.programme_id}
                    className={row.status === 'Review Required' ? 'bg-amber-50/50' : ''}
                  >
                    <td>
                      <div className="font-bold text-slate-900">{row.institution_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{row.aicte_id}</div>
                    </td>
                    <td className="text-xs">{row.state}</td>
                    <td className="font-medium text-slate-900 text-xs">{row.programme_name}</td>
                    <td className="text-right font-mono font-bold text-slate-800">{row.approved_intake}</td>
                    <td className="text-right font-mono text-slate-900 font-semibold">{row.regular_enrolment}</td>
                    <td className="text-right font-mono text-blue-700">
                      {row.supernumerary} <span className="text-[10px] text-slate-400">/ {row.supernumerary_cap}</span>
                    </td>
                    <td className={`text-right font-mono font-bold ${
                      row.variance > 0 ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {row.variance_str}
                    </td>
                    <td>
                      <StatusBadge status={row.status} size="sm" />
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => setSelectedRecord(row)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-blue-800"
                      >
                        Capacity Audit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capacity Analysis Modal matching Section 17 */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg border border-slate-300 overflow-hidden">
            <div className="bg-[#0b2545] text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-semibold text-sm">
                Capacity Analysis: {selectedRecord.programme_name}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="font-bold text-slate-900 text-sm">{selectedRecord.institution_name}</div>
                <div className="text-slate-500 font-mono mt-0.5">{selectedRecord.aicte_id} • {selectedRecord.state}</div>
                <div className="text-slate-700 mt-1">Programme: <strong>{selectedRecord.programme_name}</strong></div>
              </div>

              {/* Exact Breakdown Table required by Section 17 */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-100 p-2 font-bold text-slate-800 text-xs border-b border-slate-300">
                  Seat Allocation &amp; Admission Breakdown:
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-medium text-slate-600">AICTE Approved Intake:</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">{selectedRecord.approved_intake}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-medium text-slate-600">Regular Admissions Enrolled:</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">{selectedRecord.regular_enrolment}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-medium text-slate-600">Supernumerary Admissions (TFWS/PMSSS):</td>
                      <td className="p-2 text-right font-mono font-bold text-blue-700">{selectedRecord.supernumerary}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2 text-slate-800">Total Enrolment Reported:</td>
                      <td className="p-2 text-right font-mono text-slate-900">{selectedRecord.total_enrolment}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rule-based Assessment Banner required by Section 17 */}
              <div className={`p-3.5 rounded border text-xs leading-relaxed ${
                selectedRecord.variance > 0
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="font-bold flex items-center space-x-1.5 mb-1">
                  {selectedRecord.variance > 0 ? (
                    <AlertOctagon className="w-4 h-4 text-rose-700" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  )}
                  <span>Rule-Based Regulatory Assessment:</span>
                </div>
                <p>{selectedRecord.assessment}</p>
              </div>

              <div className="text-[11px] text-slate-500 italic">
                Note: Under AICTE Approval Process Handbook (APH), supernumerary seats up to sanctioned percentage do not count toward regular approved capacity.
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-1.5 bg-[#0b2545] text-white rounded font-semibold"
                >
                  Close Audit View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
