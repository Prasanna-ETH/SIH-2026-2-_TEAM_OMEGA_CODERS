import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { History, Filter, Download, ShieldCheck, Search } from 'lucide-react';

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  useEffect(() => {
    loadAuditLogs();
  }, [page, roleFilter]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getAuditLogs({
        role: roleFilter || undefined,
        user_id: searchUser.trim() || undefined,
        page,
        limit
      });
      setLogs(res.logs || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadAuditLogs();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Statutory Accountability &amp; Security Logs
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">
            Immutable Regulatory Audit Trail
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Cryptographically timestamped chronological log of all data submissions, manual corrections, investigations, and verification inquiries
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Tamper-Resistant Regulatory Log</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 text-xs">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Filter by Authorized User ID (e.g. AICTE_ADMIN or INST_10021)..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-1 text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Role:</span>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="p-2 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="">All Roles</option>
              <option value="AICTE_ADMIN">AICTE Official</option>
              <option value="INSTITUTION">Institution Official</option>
              <option value="VERIFIER">Third-Party Verifier</option>
            </select>

            <button
              type="submit"
              className="bg-[#0b2545] hover:bg-[#133863] text-white px-4 py-2 rounded font-semibold transition"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <span>Showing <strong>{logs.length}</strong> of <strong>{total}</strong> immutable audit entries</span>
          <span className="font-mono text-[11px] text-slate-500">Log Policy: CERT-In Compliance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Target Entity</th>
                <th>Prior State</th>
                <th>New State</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id}>
                    <td className="font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="font-mono font-bold text-slate-900">{log.user}</td>
                    <td>
                      <span className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                        {log.role}
                      </span>
                    </td>
                    <td className="font-bold text-slate-800">{log.action}</td>
                    <td className="font-mono text-slate-700">{log.entity}</td>
                    <td className="text-slate-500 max-w-xs truncate" title={log.previous_value}>
                      {log.previous_value}
                    </td>
                    <td className="text-slate-900 font-medium max-w-xs truncate" title={log.new_value}>
                      {log.new_value}
                    </td>
                    <td className="font-mono text-slate-400 text-[11px]">{log.ip_address}</td>
                    <td>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {log.status}
                      </span>
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
