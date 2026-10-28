import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Download,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';

interface StudentUploadProps {
  onNavigate: (route: string) => void;
}

export const StudentUploadPage: React.FC<StudentUploadProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [programmeId, setProgrammeId] = useState<number>(1);
  const [batchName, setBatchName] = useState('Batch 2026 Regular Autumn');
  const [sessionName, setSessionName] = useState('Central Quota Counselling 2026');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'ERROR' | 'WARNING' | 'VALID'>('ALL');
  const [commitSuccess, setCommitSuccess] = useState(false);

  const instId = user?.institution_id || 1;

  // Handle Download CSV Template
  const handleDownloadTemplate = () => {
    const headers = [
      'apaar_id', 'full_name', 'dob', 'gender', 'programme', 'admission_year',
      'academic_year', 'category', 'seat_type', 'is_supernumerary', 'supernumerary_type',
      'nri_status', 'oci_status', 'foreign_national', 'institution_id', 'enrollment_no',
      'admission_date', 'student_status'
    ];
    const sampleRow = [
      '883491031001', 'Adarsh Gupta', '2005-08-14', 'Male', 'B.Tech Computer Science and Engineering', '2026',
      '2026-27', 'General', 'Regular', 'false', '', 'false', 'false', 'false', 'AICTE/DEMO/10021',
      'AICTE/ABC/2026/CSE/101', '2026-07-20', 'Active'
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sampleRow.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'AICTE_APAAR_Student_Data_Template_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pre-load Demo 127 Batch File for quick demonstration
  const handlePreloadDemoBatch = async () => {
    try {
      setIsProcessing(true);
      setErrorMsg('');
      const response = await fetch('/sample_upload_data/sample_student_batch_127.csv');
      const blob = await response.blob();
      const file = new File([blob], 'abc_tech_cse_batch_127.csv', { type: 'text/csv' });
      setSelectedFile(file);
      setStep(2);
    } catch (err: any) {
      setErrorMsg('Could not load sample CSV file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Run Pre-validation Engine
  const handleRunPrevalidation = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a CSV or Excel student data file.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg('');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('institution_id', instId.toString());
      formData.append('programme_id', programmeId.toString());
      formData.append('academic_year', academicYear);

      const res = await apiClient.prevalidateUpload(formData);
      setValidationResult(res);
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || 'Validation failed. Check file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Commit valid records to database
  const handleCommitUpload = async () => {
    if (!validationResult) return;
    try {
      setIsProcessing(true);
      setErrorMsg('');
      const payload = {
        institution_id: instId,
        programme_id: programmeId,
        academic_year: academicYear,
        file_name: validationResult.file_name || selectedFile?.name || 'batch_upload.csv',
        items: validationResult.items,
        submitted_by: user?.username || 'INST_10021'
      };

      await apiClient.commitUpload(payload);
      setCommitSuccess(true);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to commit submission.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter items in review table
  const filteredItems = validationResult?.items?.filter((item: any) => {
    if (filterTab === 'ALL') return true;
    return item.status === filterTab;
  }) || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Student Registry → Ingestion &amp; Regulatory Checks
          </div>
          <h2 className="text-xl font-bold text-[#0b2545] tracking-tight">Upload Student Data</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Structured submission, format verification, duplicate screening, and intake compliance validation
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{t('btn_download_template')}</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <div className="grid grid-cols-4 gap-2 text-xs">
          {/* Step 1 */}
          <div className={`p-2.5 rounded border flex items-center space-x-2.5 ${
            step === 1 ? 'border-[#0b2545] bg-blue-50/50 font-bold text-[#0b2545]' : step > 1 ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step > 1 ? 'bg-emerald-600 text-white' : step === 1 ? 'bg-[#0b2545] text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {step > 1 ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span>{t('upload_step1')}</span>
          </div>

          {/* Step 2 */}
          <div className={`p-2.5 rounded border flex items-center space-x-2.5 ${
            step === 2 ? 'border-[#0b2545] bg-blue-50/50 font-bold text-[#0b2545]' : step > 2 ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step > 2 ? 'bg-emerald-600 text-white' : step === 2 ? 'bg-[#0b2545] text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {step > 2 ? <Check className="w-3 h-3" /> : '2'}
            </span>
            <span>{t('upload_step2')}</span>
          </div>

          {/* Step 3 */}
          <div className={`p-2.5 rounded border flex items-center space-x-2.5 ${
            step === 3 ? 'border-[#0b2545] bg-blue-50/50 font-bold text-[#0b2545]' : step > 3 ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step > 3 ? 'bg-emerald-600 text-white' : step === 3 ? 'bg-[#0b2545] text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {step > 3 ? <Check className="w-3 h-3" /> : '3'}
            </span>
            <span>{t('upload_step3')}</span>
          </div>

          {/* Step 4 */}
          <div className={`p-2.5 rounded border flex items-center space-x-2.5 ${
            step === 4 ? 'border-emerald-400 bg-emerald-50 font-bold text-emerald-800' : 'border-slate-200 text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              4
            </span>
            <span>{t('upload_step4')}</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded text-xs flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Select Programme */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-[#0b2545] text-sm border-b border-slate-200 pb-2">
            Step 1 — Programme &amp; Cohort Selection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="2026-27">2026–27 (Current Active Admissions)</option>
                <option value="2025-26">2025–26 (Previous Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Approved Programme <span className="text-red-500">*</span>
              </label>
              <select
                value={programmeId}
                onChange={(e) => setProgrammeId(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value={1}>B.Tech Computer Science and Engineering (Approved Intake: 120)</option>
                <option value={2}>B.Tech Information Technology (Approved Intake: 60)</option>
                <option value={3}>Master of Business Administration (MBA) (Approved Intake: 60)</option>
                <option value={4}>Master of Computer Applications (MCA) (Approved Intake: 60)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Admission Batch Identifier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                placeholder="e.g. Batch 2026 Regular Autumn"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Admission Session / Quota Round <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                placeholder="e.g. Central Quota Counselling 2026"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="flex items-center space-x-1.5 bg-[#0b2545] hover:bg-[#133863] text-white px-5 py-2 rounded text-xs font-semibold shadow transition"
            >
              <span>Continue to File Upload</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Upload File */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded p-6 shadow-2xs space-y-5">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h3 className="font-bold text-[#0b2545] text-sm">
              Step 2 — Upload Student Data File
            </h3>
            <span className="text-xs text-slate-500">Supported formats: CSV, TSV (UTF-8)</span>
          </div>

          {/* Quick Preload Demo Helper Banner */}
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div>
              <div className="font-bold text-[#0b2545] flex items-center space-x-1">
                <Info className="w-4 h-4 text-blue-600" />
                <span>SIH Demo Story Fast-Track Dataset:</span>
              </div>
              <p className="text-slate-600 mt-0.5">
                Load official synthetic batch of <strong>127 student records</strong> containing valid admissions, duplicate candidates, and capacity edge cases.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePreloadDemoBatch}
              disabled={isProcessing}
              className="bg-[#0b2545] hover:bg-[#133863] text-white font-semibold px-3 py-1.5 rounded whitespace-nowrap shadow-2xs transition"
            >
              Pre-load 127 Student Demo File
            </button>
          </div>

          {/* Professional Government Drag & Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-800">
              {selectedFile ? selectedFile.name : 'Select or drop student CSV file here'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              File must adhere to AICTE APAAR data specification standards
            </p>
            <div className="mt-4">
              <label className="inline-block bg-white hover:bg-slate-50 text-slate-800 font-semibold px-4 py-2 border border-slate-300 rounded text-xs cursor-pointer shadow-2xs">
                <span>Browse Local Files</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {selectedFile && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{selectedFile.name}</span>
                <span className="text-slate-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <span className="text-emerald-700 font-bold">Ready for pre-validation</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleRunPrevalidation}
              disabled={!selectedFile || isProcessing}
              className="flex items-center space-x-1.5 bg-[#0b2545] hover:bg-[#133863] text-white px-5 py-2 rounded text-xs font-semibold shadow transition disabled:opacity-50"
            >
              {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{t('btn_prevalidate')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Pre-validation Results Review */}
      {step === 3 && validationResult && (
        <div className="space-y-5">
          {/* Summary Box matching SIH prompt requirement */}
          <div className="bg-white border border-slate-200 rounded p-5 shadow-2xs">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-[#0b2545] text-base">
                  Pre-validation Engine Summary: {validationResult.total_records} Records Received
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Automated checks completed: APAAR format, duplicate detection, age range, intake limits, supernumerary caps.
                </p>
              </div>
              <span className="font-mono text-xs bg-slate-100 border border-slate-300 px-2.5 py-1 rounded font-bold text-slate-800">
                {validationResult.file_name}
              </span>
            </div>

            {/* Counts breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                <div className="text-2xl font-bold text-emerald-800 font-mono">
                  {validationResult.valid_count}
                </div>
                <div className="text-xs font-semibold text-emerald-700">Valid Records</div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <div className="text-2xl font-bold text-amber-800 font-mono">
                  {validationResult.warning_count}
                </div>
                <div className="text-xs font-semibold text-amber-700">Warnings / Anomalies</div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded">
                <div className="text-2xl font-bold text-rose-800 font-mono">
                  {validationResult.error_count}
                </div>
                <div className="text-xs font-semibold text-rose-700">Errors (Rejected)</div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                <div className="text-2xl font-bold text-purple-900 font-mono">
                  {validationResult.duplicate_signals}
                </div>
                <div className="text-xs font-semibold text-purple-700">Duplicate / Review Signals</div>
              </div>
            </div>
          </div>

          {/* Detailed Item Review Table */}
          <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-xs font-bold text-slate-800">
                Review Records by Classification:
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setFilterTab('ALL')}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    filterTab === 'ALL' ? 'bg-[#0b2545] text-white' : 'bg-white border border-slate-300 text-slate-700'
                  }`}
                >
                  All ({validationResult.total_records})
                </button>
                <button
                  onClick={() => setFilterTab('ERROR')}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    filterTab === 'ERROR' ? 'bg-rose-700 text-white' : 'bg-white border border-rose-300 text-rose-700'
                  }`}
                >
                  Errors ({validationResult.error_count})
                </button>
                <button
                  onClick={() => setFilterTab('WARNING')}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    filterTab === 'WARNING' ? 'bg-amber-600 text-white' : 'bg-white border border-amber-300 text-amber-800'
                  }`}
                >
                  Warnings ({validationResult.warning_count})
                </button>
                <button
                  onClick={() => setFilterTab('VALID')}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    filterTab === 'VALID' ? 'bg-emerald-700 text-white' : 'bg-white border border-emerald-300 text-emerald-800'
                  }`}
                >
                  Valid ({validationResult.valid_count})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Candidate Name</th>
                    <th>APAAR ID</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Category</th>
                    <th>Seat Type</th>
                    <th>Status</th>
                    <th>Validation Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((row: any) => (
                    <tr key={row.index} className={row.status === 'ERROR' ? 'bg-red-50/40' : row.status === 'WARNING' ? 'bg-amber-50/40' : ''}>
                      <td className="font-mono text-xs text-slate-500">{row.index}</td>
                      <td className="font-bold text-slate-900">{row.full_name}</td>
                      <td className="font-mono text-xs text-slate-800">
                        {row.apaar_id || <span className="text-rose-600 font-bold">[MISSING]</span>}
                      </td>
                      <td className="text-xs text-slate-600">{row.dob}</td>
                      <td className="text-xs text-slate-600">{row.gender}</td>
                      <td className="text-xs text-slate-600">{row.category}</td>
                      <td className="text-xs text-slate-600">{row.seat_type}</td>
                      <td>
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                      <td className="text-xs text-slate-700 max-w-sm">
                        {row.issues && row.issues.length > 0 ? (
                          <ul className="list-disc list-inside space-y-0.5">
                            {row.issues.map((iss: any, i: number) => (
                              <li key={i} className={iss.severity === 'ERROR' ? 'text-rose-700 font-semibold' : 'text-amber-800'}>
                                {iss.message}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-emerald-700 font-medium">All validation checks passed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Upload Different File</span>
              </button>

              <button
                onClick={handleCommitUpload}
                disabled={isProcessing}
                className="flex items-center space-x-1.5 bg-[#0b2545] hover:bg-[#133863] text-white px-5 py-2.5 rounded text-xs font-bold shadow transition"
              >
                {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{t('btn_commit')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Commit Success */}
      {step === 4 && commitSuccess && (
        <div className="bg-white border border-slate-200 rounded p-8 shadow-2xs text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Batch Submission Ingested Successfully
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            The student batch has been committed to the central AICTE registry. Valid records are now active, and validation warnings/errors have been forwarded to the <strong>Validation Centre</strong> and <strong>Duplicate Detection Engine</strong> for regulatory investigation.
          </p>

          <div className="pt-4 flex justify-center space-x-3 text-xs">
            <button
              onClick={() => onNavigate('/validation')}
              className="bg-[#0b2545] hover:bg-[#133863] text-white font-semibold px-4 py-2 rounded shadow transition"
            >
              Open Validation Centre
            </button>

            <button
              onClick={() => onNavigate('/institution/dashboard')}
              className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded transition"
            >
              Return to Institution Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
