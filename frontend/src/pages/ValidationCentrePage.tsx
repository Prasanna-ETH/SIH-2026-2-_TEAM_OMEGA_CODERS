import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  FileCheck
} from 'lucide-react';

export const ValidationCentrePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [issues, setIssues] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({ total: 0, errors: 0, warnings: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ERROR' | 'WARNING' | 'RESOLVED'>('ALL');

  // Resolution modal state
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'RESOLVE' | 'REQUEST_CORRECTION' | 'DISMISS'>('RESOLVE');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updatedApaar, setUpdatedApaar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  useEffect(() => {
    loadIssues();
  }, [activeTab]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const severityParam = activeTab === 'ERROR' ? 'ERROR' : activeTab === 'WARNING' ? 'WARNING' : undefined;
      const statusParam = activeTab === 'RESOLVED' ? 'RESOLVED' : undefined;

      const res = await apiClient.getValidationIssues(severityParam, statusParam);
      setIssues(res.issues || []);
      setCounts(res.counts || { total: 0, errors: 0, warnings: 0, resolved: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResolveModal = (issue: any, defaultAction: 'RESOLVE' | 'REQUEST_CORRECTION' = 'RESOLVE') => {
    setSelectedIssue(issue);
    setResolutionAction(defaultAction);
    setResolutionNotes('');
    setUpdatedApaar(issue.apaar !== 'Not Provided' ? issue.apaar : '');
    setActionSuccessMsg('');
  };

  const handleSubmitResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    try {
      setIsSubmitting(true);
      await apiClient.resolveValidationIssue(selectedIssue.id, {
        action: resolutionAction,
        resolution_notes: resolutionNotes || 'Administrative clearance provided following institutional verification.',
        updated_apaar_id: updatedApaar.trim() || undefined
      });

      setActionSuccessMsg(`Issue #${selectedIssue.id} updated successfully.`);
      setTimeout(() => {
        setSelectedIssue(null);
        loadIssues();
      }, 800);
    } catch (err: any) {
      alert(err.message || 'Failed to update issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            AICTE Regulatory Surveillance
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">Validation Centre</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Central repository of automated data discrepancies, APAAR inconsistencies, and compliance anomalies requiring administrative action
          </p>
        </div>

        <button
          onClick={loadIssues}
          className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded p-1 shadow-2xs flex items-center space-x-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold transition ${
            activeTab === 'ALL'
              ? 'bg-[#0b2545] text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>All Discrepancies</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'ALL' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-700'
          }`}>
            {counts.total}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ERROR')}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold transition ${
            activeTab === 'ERROR'
              ? 'bg-rose-700 text-white'
              : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          <span>Errors</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'ERROR' ? 'bg-white text-rose-800 font-bold' : 'bg-rose-100 text-rose-800'
          }`}>
            {counts.errors}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('WARNING')}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold transition ${
            activeTab === 'WARNING'
              ? 'bg-amber-600 text-white'
              : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <span>Warnings &amp; Alerts</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'WARNING' ? 'bg-white text-amber-900 font-bold' : 'bg-amber-100 text-amber-900'
          }`}>
            {counts.warnings}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('RESOLVED')}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold transition ${
            activeTab === 'RESOLVED'
              ? 'bg-emerald-700 text-white'
              : 'text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <span>Resolved &amp; Cleared</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'RESOLVED' ? 'bg-white text-emerald-900 font-bold' : 'bg-emerald-100 text-emerald-900'
          }`}>
            {counts.resolved}
          </span>
        </button>
      </div>

      {/* Validation Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Candidate / Row</th>
                <th>APAAR ID</th>
                <th>Institution</th>
                <th>Discrepancy / Rule Violation</th>
                <th>Severity</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                    Loading validation queue...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                    No open validation issues found in this category.
                  </td>
                </tr>
              ) : (
                issues.map((iss: any) => (
                  <tr key={iss.id}>
                    <td className="font-bold text-slate-900">
                      <div>{iss.student}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ISSUE-REF-{iss.id}</div>
                    </td>
                    <td className="font-mono text-xs text-slate-800">{iss.apaar}</td>
                    <td className="text-xs text-slate-700">{iss.institution}</td>
                    <td className="text-xs text-slate-800 max-w-sm">
                      <div className="font-medium">{iss.issue}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Rule: {iss.rule_code}</div>
                    </td>
                    <td>
                      <StatusBadge status={iss.severity} size="sm" />
                    </td>
                    <td>
                      <StatusBadge status={iss.status} size="sm" />
                    </td>
                    <td className="text-center">
                      {iss.status === 'RESOLVED' ? (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared</span>
                        </span>
                      ) : (
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleOpenResolveModal(iss, 'RESOLVE')}
                            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-[#0b2545]"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleOpenResolveModal(iss, 'REQUEST_CORRECTION')}
                            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-amber-700"
                          >
                            Inquire
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Resolution Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg border border-slate-300 overflow-hidden">
            <div className="bg-[#0b2545] text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-semibold text-sm">
                Resolve Regulatory Discrepancy #{selectedIssue.id}
              </h3>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResolution} className="p-5 space-y-4 text-xs">
              {actionSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-slate-500">Student: <strong>{selectedIssue.student}</strong></div>
                <div className="text-slate-500 mt-0.5">Institution: <strong>{selectedIssue.institution}</strong></div>
                <div className="text-slate-800 font-semibold mt-1.5 p-2 bg-white rounded border border-slate-200">
                  {selectedIssue.issue}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Resolution Action <span className="text-red-500">*</span>
                </label>
                <select
                  value={resolutionAction}
                  onChange={(e: any) => setResolutionAction(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="RESOLVE">Mark Resolved &amp; Update Record</option>
                  <option value="REQUEST_CORRECTION">Issue Notice / Request Institutional Correction</option>
                  <option value="DISMISS">Dismiss Discrepancy (Statutory Exception)</option>
                </select>
              </div>

              {resolutionAction === 'RESOLVE' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Corrected 12-Digit APAAR ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={updatedApaar}
                    onChange={(e) => setUpdatedApaar(e.target.value)}
                    placeholder="Enter valid 12-digit numeric APAAR"
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                    maxLength={12}
                  />
                  <span className="text-[10px] text-slate-500">
                    If format error was due to typographical mistake, enter corrected national identifier.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Regulatory Resolution Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record administrative justification or verification confirmation..."
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-[#0b2545] hover:bg-[#133863] text-white rounded font-bold transition flex items-center space-x-1"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Resolution</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
