import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Copy,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Send,
  HelpCircle,
  X,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

export const DuplicateDetectionPage: React.FC = () => {
  const { t } = useLanguage();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  // Action state
  const [actionType, setActionType] = useState<string>('REQUEST_CLARIFICATION');
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getDuplicateCases();
      setCases(res.cases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionModal = (c: any, defaultAct: string = 'REQUEST_CLARIFICATION') => {
    setSelectedCase(c);
    setActionType(defaultAct);
    setActionNotes('');
    setActionSuccess('');
  };

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    try {
      setIsSubmitting(true);
      await apiClient.actionDuplicateCase(selectedCase.id, {
        action: actionType,
        notes: actionNotes || 'Action processed under AICTE Higher Education Cross-Enrolment Standard Procedure.'
      });

      setActionSuccess(`Case #${selectedCase.id} successfully updated.`);
      setTimeout(() => {
        setSelectedCase(null);
        loadCases();
      }, 800);
    } catch (err: any) {
      alert(err.message || 'Action failed');
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
            AICTE National Integrity Gateway
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">
            Cross-Institution Enrolment Detection
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Surveillance of identical APAAR identities concurrently active across multiple AICTE-approved institutions
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-600">Active Conflicts:</span>
          <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
            {cases.filter((c) => c.status === 'OPEN').length} Pending Review
          </span>
        </div>
      </div>

      {/* Regulatory Philosophy Notice Box */}
      <div className="bg-amber-50 border border-amber-300 p-4 rounded text-xs text-amber-900 leading-relaxed flex items-start space-x-3">
        <HelpCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Human-Review Regulatory Protocol:</strong> The ASDVS platform does not automatically declare fraud upon detecting overlapping enrolments. Students may be engaged in lawful university transfers, dual degree pilot programmes, or inter-state seat relinquishments. Authorized officers must review institutional documentation prior to cancellation.
        </div>
      </div>

      {/* Conflicting Cases Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 text-center text-slate-500 text-xs">
            Loading cross-institution conflict cases...
          </div>
        ) : cases.length === 0 ? (
          <div className="bg-white p-8 text-center text-slate-500 text-xs">
            No concurrent enrolment conflicts recorded.
          </div>
        ) : (
          cases.map((item: any) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden"
            >
              {/* Conflict Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="p-1.5 bg-rose-100 text-rose-700 rounded">
                    <Copy className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {item.student_name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      APAAR ID: <strong>{item.apaar_id_masked}</strong> • Academic Cohort: {item.academic_year}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <StatusBadge status={item.status} />
                  <span className="text-[11px] text-slate-400 font-mono">CASE-REF-{item.id}</span>
                </div>
              </div>

              {/* Institutions Comparison Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institution 1 */}
                <div className="border border-slate-200 rounded p-3.5 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-blue-900 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-700" />
                      <span>Registration Record A</span>
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      ACTIVE
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-900">{item.primary_institution.name}</div>
                    <div className="text-slate-600 mt-0.5">{item.primary_institution.programme}</div>
                    <div className="font-mono text-slate-500 text-[11px] mt-1">
                      Enrollment No: {item.primary_institution.enrolment_no}
                    </div>
                  </div>
                </div>

                {/* Institution 2 */}
                <div className="border border-slate-200 rounded p-3.5 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-purple-900 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-purple-700" />
                      <span>Registration Record B (Conflicting)</span>
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      ACTIVE
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-900">{item.secondary_institution.name}</div>
                    <div className="text-slate-600 mt-0.5">{item.secondary_institution.programme}</div>
                    <div className="font-mono text-slate-500 text-[11px] mt-1">
                      Enrollment No: {item.secondary_institution.enrolment_no}
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Flagged Diagnostic Section */}
              <div className="px-4 pb-3">
                <div className="bg-slate-100/70 p-3 rounded text-xs">
                  <span className="font-bold text-slate-800 block mb-1.5">
                    Why was this case flagged by Central Governance?
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-600">
                    {item.flag_reasons.map((reason: string, rIdx: number) => (
                      <li key={rIdx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>

                  {item.resolution_notes && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-slate-700">
                      <strong>Audit Resolution Note:</strong> {item.resolution_notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  Detected on: {item.created_at}
                </span>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => handleOpenActionModal(item, 'REQUEST_CLARIFICATION')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded font-semibold text-slate-700 shadow-2xs"
                  >
                    Request Institution Clarification
                  </button>

                  <button
                    onClick={() => handleOpenActionModal(item, 'MARK_VALID_TRANSFER')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow-2xs"
                  >
                    Mark as Valid Transfer
                  </button>

                  <button
                    onClick={() => handleOpenActionModal(item, 'RESOLVE')}
                    className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#133863] text-white rounded font-bold shadow-2xs"
                  >
                    Administrative Resolution
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Human Review Action Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg border border-slate-300 overflow-hidden">
            <div className="bg-[#0b2545] text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-semibold text-sm">
                Cross-Institution Review: Case #{selectedCase.id}
              </h3>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAction} className="p-5 space-y-4 text-xs">
              {actionSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="font-bold text-slate-800">{selectedCase.student_name}</div>
                <div className="text-slate-500 font-mono text-[11px]">{selectedCase.apaar_id_masked}</div>
                <div className="text-slate-600 mt-1">
                  Conflicting Institutions: {selectedCase.primary_institution.name} &amp; {selectedCase.secondary_institution.name}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Regulatory Action Decision <span className="text-red-500">*</span>
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="REQUEST_CLARIFICATION">Issue Clarification Notice to Institutions</option>
                  <option value="MARK_VALID_TRANSFER">Authorize &amp; Mark as Valid Migration / Transfer</option>
                  <option value="RESOLVE">Cancel Duplicate Secondary Enrolment</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Regulatory Audit Findings &amp; Rationale <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="State the regulatory basis, migration certificate reference, or institutional response..."
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
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
                  <span>Save Decision</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
