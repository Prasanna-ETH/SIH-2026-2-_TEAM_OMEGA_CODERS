import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { VerificationCertificateModal } from '../components/VerificationCertificateModal';
import { StatusBadge } from '../components/StatusBadge';
import {
  CheckCircle2,
  Search,
  ShieldCheck,
  Printer,
  History,
  Building2,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const VerificationPortalPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('883491021001');
  const [requesterOrg, setRequesterOrg] = useState('Tata Consultancy Services Ltd (BGV Cell)');
  const [purpose, setPurpose] = useState('Pre-Employment Background Verification');
  const [consentRecorded, setConsentRecorded] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await apiClient.getVerificationHistory();
      setHistory(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      setResult(null);

      const res = await apiClient.verifyStudent({
        identifier: identifier.trim(),
        requester_org: requesterOrg,
        verification_purpose: purpose,
        consent_recorded: consentRecorded
      });

      setResult(res);
      loadHistory();
    } catch (err: any) {
      setErrorMsg(err.message || 'No matching academic verification record located.');
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
            Authorized Third-Party &amp; Employer Gateway
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">
            Student Academic Identity Verification
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Privacy-preserving statutory verification of student academic credentials via 12-digit APAAR or official AICTE verification references
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>DPDP &amp; IT Act Consent Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Form (Left 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-[#0b2545] text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
            Initiate Verification Request
          </h3>

          <form onSubmit={handleVerify} className="space-y-3.5 text-xs">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Student APAAR ID or Verification Reference <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 883491021001 or AICTE-VER-2026-000184"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  required
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Demo IDs: 883491021001 (Valid)</span>
                <span>883491021234 (Conflict)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Authorized Requester Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={requesterOrg}
                onChange={(e) => setRequesterOrg(e.target.value)}
                placeholder="e.g. Tata Consultancy Services Ltd (BGV Cell)"
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Verification Purpose <span className="text-red-500">*</span>
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-700"
              >
                <option value="Pre-Employment Background Verification">Employment Verification (Campus / Lateral)</option>
                <option value="Higher Education Admissions Clearance">Higher Education Admissions Clearance</option>
                <option value="Visa & Embassy Academic Authentication">Visa &amp; Consular Verification</option>
                <option value="Statutory Regulatory Audit">Statutory Regulatory Audit</option>
              </select>
            </div>

            <div className="pt-1">
              <label className="flex items-start space-x-2 cursor-pointer bg-slate-50 p-2.5 rounded border border-slate-200">
                <input
                  type="checkbox"
                  checked={consentRecorded}
                  onChange={(e) => setConsentRecorded(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-700"
                  required
                />
                <span className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>Authorised Consent Recorded:</strong> I certify that candidate consent has been documented under DPDP Act norms for statutory educational verification.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0b2545] hover:bg-[#133863] text-white font-bold py-2.5 px-4 rounded shadow transition text-xs flex items-center justify-center space-x-1.5"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Verify Academic Identity</span>
            </button>
          </form>
        </div>

        {/* Verification Result Display (Right 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="bg-white border-2 border-slate-300 rounded shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Central Verification Outcome
                  </span>
                  <h3 className="text-lg font-bold text-[#0b2545] flex items-center gap-2 mt-0.5">
                    <span>Student Academic Identity: {result.status}</span>
                    <StatusBadge status={result.status} size="sm" />
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Reference No</span>
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {result.reference_no}
                  </span>
                </div>
              </div>

              {/* Minimal Privacy-Preserving Academic Details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Candidate Academic Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{result.student_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Masked APAAR ID:</span>
                  <span className="font-mono font-bold text-slate-800">{result.apaar_id_masked}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">AICTE Approved Institution:</span>
                  <span className="font-bold text-slate-800">{result.institution_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Programme of Study:</span>
                  <span className="font-semibold text-slate-800">{result.programme_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Admission Cohort:</span>
                  <span className="font-semibold text-slate-800">{result.admission_year}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Verification Timestamp:</span>
                  <span className="font-mono text-slate-600 text-[11px]">{result.verification_date}</span>
                </div>
              </div>

              {/* Regulatory Audit Summary Statement */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded leading-relaxed">
                <strong>Statutory Finding:</strong> {result.result_summary}
              </div>

              {/* Action: Open Printable Certificate Modal */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded text-xs shadow transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print Verification Certificate</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded p-8 text-center text-xs text-slate-500 shadow-2xs">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No active verification query loaded.</p>
              <p className="mt-1">
                Enter an APAAR ID or reference number on the left to verify academic credentials against central AICTE approved intake registries.
              </p>
            </div>
          )}

          {/* Past Inquiries History */}
          <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <History className="w-4 h-4 text-slate-600" />
              <span>Recent Verification Queries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="gov-table text-xs">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Candidate</th>
                    <th>Requester Org</th>
                    <th>Programme</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h: any) => (
                    <tr key={h.id}>
                      <td className="font-mono text-[11px] text-blue-800 font-semibold">{h.reference_no}</td>
                      <td className="font-bold text-slate-900">{h.student_name}</td>
                      <td className="text-slate-600">{h.requester_org}</td>
                      <td className="text-slate-600">{h.programme_name}</td>
                      <td>
                        <StatusBadge status={h.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate Modal */}
      <VerificationCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={result}
      />
    </div>
  );
};
