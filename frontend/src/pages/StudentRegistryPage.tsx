import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Filter, Download, ExternalLink, Users } from 'lucide-react';

interface StudentRegistryProps {
  onSelectStudent: (studentId: number) => void;
}

export const StudentRegistryPage: React.FC<StudentRegistryProps> = ({ onSelectStudent }) => {
  const { t } = useLanguage();
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    loadStudents();
  }, [page, category]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getStudents({
        search: search.trim() || undefined,
        category: category || undefined,
        page,
        limit
      });
      setStudents(res.students || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadStudents();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            AICTE Central Database
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">National Student Registry</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Centralized index of all enrolled students authenticated via APAAR identity with privacy-preserving masking
          </p>
        </div>

        <a
          href="/api/reports/enrolment.csv"
          className="flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Master CSV</span>
        </a>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3 text-xs">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name, APAAR ID, or Enrollment Number..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="flex items-center space-x-1 text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="p-2 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="">All Categories</option>
              <option value="General">General</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>

            <button
              type="submit"
              className="bg-[#0b2545] hover:bg-[#133863] text-white px-4 py-2 rounded font-semibold transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Registry Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <span>Showing <strong>{students.length}</strong> of <strong>{total}</strong> student records</span>
          <span className="text-[11px] text-slate-500 font-mono">Masking Standard: MoE APAAR-GIGW-04</span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Masked APAAR ID</th>
                <th>Student Full Name</th>
                <th>Institution</th>
                <th>Programme</th>
                <th>Admission No</th>
                <th>Category</th>
                <th>Seat Type</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    No student records matching your query.
                  </td>
                </tr>
              ) : (
                students.map((st: any) => (
                  <tr key={st.id}>
                    <td className="font-mono text-xs font-bold text-slate-800">
                      {st.apaar_id_masked}
                    </td>
                    <td className="font-bold text-slate-900">{st.full_name}</td>
                    <td>
                      <div className="text-slate-800">{st.institution_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{st.institution_aicte_id}</div>
                    </td>
                    <td className="text-xs text-slate-700">{st.programme_name}</td>
                    <td className="font-mono text-xs text-slate-600">{st.enrollment_no}</td>
                    <td className="text-xs">{st.category}</td>
                    <td className="text-xs">
                      {st.seat_type}
                      {st.is_supernumerary && (
                        <span className="ml-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-1 py-0.2 rounded">
                          SUPER
                        </span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={st.verification_status} size="sm" />
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => onSelectStudent(st.id)}
                        className="text-xs font-semibold text-blue-800 hover:underline inline-flex items-center space-x-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-700 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-slate-600">
            Page {page} of {Math.ceil(total / limit) || 1}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
            className="px-3 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
