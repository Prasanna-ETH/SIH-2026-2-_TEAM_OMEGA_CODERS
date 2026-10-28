import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import {
  ArrowLeft,
  ShieldCheck,
  User,
  GraduationCap,
  Calendar,
  Clock,
  History,
  Eye,
  EyeOff
} from 'lucide-react';

interface StudentDetailPageProps {
  studentId: number;
  onBack: () => void;
}

export const StudentDetailPage: React.FC<StudentDetailPageProps> = ({ studentId, onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFullApaar, setShowFullApaar] = useState(false);

  useEffect(() => {
    loadStudent();
  }, [studentId]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getStudentDetail(studentId);
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
        <p>Loading Official Student Academic Dossier...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-red-600 text-sm">
        Student record not found.
      </div>
    );
  }

  const { identity, academic, admission_category, validation_history, audit_history } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Header */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 border border-slate-300"
            title="Back to Registry"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student Record Dossier
            </div>
            <h2 className="text-xl font-bold text-[#0b2545] tracking-tight flex items-center gap-2">
              <span>{identity.student_name}</span>
              <StatusBadge status={identity.verification_status} size="sm" />
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">System Identifier</span>
          <span className="font-mono text-xs font-bold text-slate-800">STD-REC-{identity.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Identity & Admission Category */}
        <div className="space-y-6 md:col-span-1">
          {/* Section: Identity */}
          <div className="bg-white border border-slate-200 rounded shadow-2xs p-4 space-y-3">
            <h3 className="font-bold text-[#0b2545] text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-blue-700" />
              <span>National Academic Identity</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block">Candidate Full Name:</span>
                <span className="font-bold text-slate-900 text-sm">{identity.student_name}</span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">APAAR ID:</span>
                  <button
                    onClick={() => setShowFullApaar(!showFullApaar)}
                    className="text-[11px] text-blue-700 hover:underline flex items-center space-x-1"
                  >
                    {showFullApaar ? (
                      <>
                        <EyeOff className="w-3 h-3" /> <span>Mask</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> <span>Show Full</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono font-bold text-slate-900 bg-slate-50 p-1.5 rounded border border-slate-200 mt-0.5">
                  {showFullApaar ? identity.apaar_id : identity.apaar_id_masked}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 block">Date of Birth:</span>
                  <span className="font-semibold text-slate-800">{identity.dob}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Gender:</span>
                  <span className="font-semibold text-slate-800">{identity.gender}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Admission Category */}
          <div className="bg-white border border-slate-200 rounded shadow-2xs p-4 space-y-3">
            <h3 className="font-bold text-[#0b2545] text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
              Admission Category &amp; Quota
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Social Category:</span>
                <span className="font-semibold text-slate-800">{admission_category.category}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Seat Type:</span>
                <span className="font-semibold text-slate-800">{admission_category.seat_type}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Supernumerary Status:</span>
                <span className="font-semibold text-slate-800">
                  {admission_category.is_supernumerary ? (
                    <span className="text-blue-700 font-bold">YES ({admission_category.supernumerary_type})</span>
                  ) : (
                    'NO'
                  )}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">NRI / OCI Status:</span>
                <span className="font-semibold text-slate-800">
                  {admission_category.nri_status ? 'NRI' : admission_category.oci_status ? 'OCI' : 'Indian National'}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Enrolment Status:</span>
                <span className="font-bold text-emerald-700">{admission_category.student_status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Academic, Timeline, and Audit Trail */}
        <div className="space-y-6 md:col-span-2">
          {/* Section: Academic Info */}
          <div className="bg-white border border-slate-200 rounded shadow-2xs p-4 space-y-3">
            <h3 className="font-bold text-[#0b2545] text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Academic Enrolment Particulars</span>
            </h3>

            {academic ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Enrolled Institution:</span>
                  <span className="font-bold text-slate-900">{academic.institution_name}</span>
                  <span className="text-[11px] font-mono text-slate-500 block">{academic.institution_aicte_id}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Programme of Study:</span>
                  <span className="font-bold text-slate-900">{academic.programme_name}</span>
                  <span className="text-[11px] text-slate-500 block">{academic.degree_level}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Institutional Enrollment No:</span>
                  <span className="font-mono font-bold text-slate-800">{academic.enrollment_no}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Academic Session / Year:</span>
                  <span className="font-semibold text-slate-800">{academic.academic_year} • {academic.admission_session}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Admission Date:</span>
                  <span className="font-semibold text-slate-800">{academic.admission_date}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Statutory Compliance Status:</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded inline-block">
                    AICTE Intake Sanction Cleared
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs">No active institutional enrolment record linked.</p>
            )}
          </div>

          {/* Section: Validation History Timeline */}
          <div className="bg-white border border-slate-200 rounded shadow-2xs p-4 space-y-3">
            <h3 className="font-bold text-[#0b2545] text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Validation Lifecycle Timeline</span>
            </h3>

            <div className="space-y-3 pl-2 text-xs">
              {validation_history.map((vh: any, idx: number) => (
                <div key={idx} className="relative pl-6 border-l-2 border-emerald-400 pb-2">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-600"></div>
                  <div className="text-[11px] font-mono text-slate-500">{vh.timestamp}</div>
                  <div className="font-medium text-slate-800">{vh.event}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Audit Trail Table */}
          <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-1.5">
              <History className="w-4 h-4 text-purple-700" />
              <h3 className="font-bold text-[#0b2545] text-xs uppercase tracking-wider">
                Regulatory Modification Audit History
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {audit_history.map((log: any, i: number) => (
                    <tr key={i}>
                      <td className="text-xs text-slate-500 font-mono whitespace-nowrap">{log.timestamp}</td>
                      <td className="font-mono text-xs font-bold text-slate-800">{log.user}</td>
                      <td>
                        <span className="text-[10px] bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                          {log.role}
                        </span>
                      </td>
                      <td className="font-semibold text-slate-900">{log.action}</td>
                      <td className="text-xs text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
