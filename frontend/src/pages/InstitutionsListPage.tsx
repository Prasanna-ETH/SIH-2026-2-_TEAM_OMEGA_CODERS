import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import { Building2, Search, Filter, ExternalLink } from 'lucide-react';

interface InstitutionsListProps {
  onSelectInstitution: (id: number) => void;
}

export const InstitutionsListPage: React.FC<InstitutionsListProps> = ({ onSelectInstitution }) => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadInstitutions();
  }, [stateFilter]);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getInstitutions(stateFilter || undefined);
      setInstitutions(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = institutions.filter((inst) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.aicte_id.toLowerCase().includes(q) ||
      inst.state.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            AICTE Approved Higher Education Network
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">
            Institutions Directory &amp; Risk Register
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            National roster of technical universities, deemed colleges, and polytechnics reporting student data
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Institution Name, AICTE ID, or State..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>State:</span>
          </div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded bg-white text-slate-700"
          >
            <option value="">All States</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Delhi">Delhi</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Telangana">Telangana</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table text-xs">
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>AICTE ID</th>
                <th>State &amp; District</th>
                <th>Institution Type</th>
                <th className="text-center">Programmes</th>
                <th className="text-center">Open Issues</th>
                <th className="text-center">Risk Score</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    Loading institutions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    No institutions matching query.
                  </td>
                </tr>
              ) : (
                filtered.map((inst: any) => (
                  <tr key={inst.id}>
                    <td className="font-bold text-slate-900">{inst.name}</td>
                    <td className="font-mono text-slate-600 font-semibold">{inst.aicte_id}</td>
                    <td>{inst.district}, {inst.state}</td>
                    <td className="text-slate-600">{inst.institution_type}</td>
                    <td className="text-center font-bold text-slate-800">{inst.programmes_count}</td>
                    <td className="text-center">
                      <span className={`font-bold ${inst.open_issues > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                        {inst.open_issues}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-mono ${
                        inst.risk_score >= 60 ? 'bg-red-100 text-red-800' : inst.risk_score >= 30 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {inst.risk_score} / 100
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={inst.approval_status} size="sm" />
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => onSelectInstitution(inst.id)}
                        className="text-xs font-semibold text-blue-800 hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Profile &amp; Audit</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
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
