import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VerificationResultData {
  reference_no: string;
  apaar_id_masked: string;
  student_name: string;
  institution_name: string;
  programme_name: string;
  admission_year: string;
  status: string;
  requester_org: string;
  verification_purpose: string;
  verification_date: string;
  result_summary: string;
  security_stamp: string;
}

interface VerificationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: VerificationResultData | null;
}

export const VerificationCertificateModal: React.FC<VerificationCertificateModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl border border-slate-300 overflow-hidden my-8">
        {/* Action Header */}
        <div className="bg-[#0b2545] text-white px-5 py-3 flex justify-between items-center print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Official Academic Verification Certificate</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded text-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div id="printable-certificate" className="p-8 bg-white border-8 border-double border-slate-300 m-2 font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
            <div className="text-xs font-bold text-slate-700 tracking-wider uppercase">
              Government of India • Ministry of Education
            </div>
            <h1 className="text-xl font-bold text-[#0b2545] mt-1">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
            </h1>
            <div className="text-xs text-slate-600 font-medium">
              National Academic Depository &amp; APAAR Student Data Regulatory Gateway
            </div>
            <div className="mt-2 inline-block bg-slate-100 text-slate-800 border border-slate-400 px-3 py-0.5 rounded text-xs font-semibold">
              OFFICIAL STUDENT ACADEMIC IDENTITY VERIFICATION RECORD
            </div>
          </div>

          {/* Reference Meta Box */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-300 p-3 rounded text-xs mb-6">
            <div>
              <span className="text-slate-500 block">Verification Reference ID:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{data.reference_no}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Date of Verification:</span>
              <span className="font-semibold text-slate-800">{data.verification_date}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Authorized Requester:</span>
              <span className="font-semibold text-slate-800">{data.requester_org}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Verification Purpose:</span>
              <span className="font-semibold text-slate-800">{data.verification_purpose}</span>
            </div>
          </div>

          {/* Verified Candidate Record */}
          <div className="space-y-4 mb-6 text-xs">
            <div className="border border-emerald-300 bg-emerald-50/50 p-4 rounded flex items-center justify-between">
              <div>
                <div className="text-slate-500">Candidate Academic Name:</div>
                <div className="text-base font-bold text-slate-900">{data.student_name}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-500">Masked APAAR ID:</div>
                <div className="font-mono text-sm font-bold text-slate-900">{data.apaar_id_masked}</div>
              </div>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 p-2 font-semibold text-slate-700 w-1/3">Approved Institution:</td>
                  <td className="p-2 font-bold text-slate-900">{data.institution_name}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 p-2 font-semibold text-slate-700">Programme of Study:</td>
                  <td className="p-2 text-slate-800">{data.programme_name}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 p-2 font-semibold text-slate-700">Admission Year:</td>
                  <td className="p-2 text-slate-800">{data.admission_year}</td>
                </tr>
                <tr>
                  <td className="bg-slate-100 p-2 font-semibold text-slate-700">Central Verification Status:</td>
                  <td className="p-2">
                    <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{data.status}</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Regulatory Summary Statement */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs text-slate-700 leading-relaxed mb-6">
            <strong>Regulatory Audit Finding:</strong> {data.result_summary} This verification confirms that the student is validly enrolled in an AICTE-approved programme within the sanctioned intake capacity for the respective academic cohort.
          </div>

          {/* Security Hash & Signature Footer */}
          <div className="border-t border-slate-300 pt-4 flex justify-between items-end text-[10px] text-slate-600">
            {/* Mock QR Placeholder */}
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 border-2 border-slate-400 bg-slate-100 flex items-center justify-center font-mono text-[9px] text-slate-500 text-center p-1">
                QR CODE VERIFIED
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Digital Verification Stamp</span>
                <span className="font-mono text-slate-500">{data.security_stamp}</span>
                <span className="block text-slate-400">Consent recorded under IT Act &amp; DPDP Norms</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-800">Controller of Examinations &amp; Governance</div>
              <div className="text-slate-500">All India Council for Technical Education, New Delhi</div>
            </div>
          </div>

          {/* Official Prototype Watermark Bar */}
          <div className="mt-6 pt-2 border-t border-dashed border-slate-300 text-center text-[10px] text-amber-900 font-semibold">
            PROTOTYPE / DEMONSTRATION DOCUMENT — SMART INDIA HACKATHON (SIH26263). NOT VALID FOR FORMAL LEGAL SUBMISSION.
          </div>
        </div>

        {/* Modal Bottom Close Button */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-right print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
