import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink, ShieldCheck, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#081726] text-slate-300 text-xs mt-12 border-t-2 border-slate-700">
      {/* Top Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-800">
        {/* Column 1: Institutional Authority */}
        <div>
          <div className="flex items-center space-x-2 text-white font-bold text-sm mb-3">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>AICTE — ASDVS Platform</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            All India Council for Technical Education (AICTE) statutory student data repository, intake compliance monitoring, and automated APAAR identity verification gateway.
          </p>
          <div className="mt-4 text-slate-400 space-y-1">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>apaar-compliance@aicte-india.gov.in</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+91-11-2958-1000 / 1021</span>
            </div>
          </div>
        </div>

        {/* Column 2: National Academic Infrastructure Links */}
        <div>
          <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            {language === 'hi' ? 'महत्वपूर्ण राष्ट्रीय लिंक' : 'National Digital Infrastructure'}
          </h3>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a
                href="https://www.aicte-india.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>AICTE Official Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://www.education.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>Ministry of Education (MoE)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://apaar.education.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>APAAR Portal (One Nation One Student ID)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://www.abc.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>Academic Bank of Credits (ABC)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://www.digilocker.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>DigiLocker / National Academic Depository</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Institutional Regulatory Compliance */}
        <div>
          <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            {language === 'hi' ? 'नियामक अनुपालन एवं सहायता' : 'Regulatory & Support'}
          </h3>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a href="#help" className="hover:text-amber-400">
                Institutional Approval Process Handbook (APH)
              </a>
            </li>
            <li>
              <a href="#help" className="hover:text-amber-400">
                APAAR Data Ingestion &amp; Formatting Guidelines
              </a>
            </li>
            <li>
              <a href="#help" className="hover:text-amber-400">
                Supernumerary (TFWS/PMSSS) Quota Regulations
              </a>
            </li>
            <li>
              <a href="#help" className="hover:text-amber-400">
                Cross-Institution Migration Clearance Protocol
              </a>
            </li>
            <li>
              <a href="#help" className="hover:text-amber-400">
                Third-Party Verification Consent Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & Accessibility */}
        <div>
          <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            {language === 'hi' ? 'कानूनी एवं सुरक्षा' : 'Security & Policy'}
          </h3>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#terms" className="hover:text-amber-400">Terms of Use &amp; Regulatory Jurisdiction</a></li>
            <li><a href="#privacy" className="hover:text-amber-400">Data Privacy &amp; Masking Standard</a></li>
            <li><a href="#security" className="hover:text-amber-400">Information Security Architecture</a></li>
            <li><a href="#accessibility" className="hover:text-amber-400">Accessibility Statement (GIGW)</a></li>
            <li><a href="#audit" className="hover:text-amber-400">Audit &amp; Compliance Logs</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Disclaimer Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-slate-400">
        <div>
          <span>© 2026 All India Council for Technical Education. All Rights Reserved.</span>
        </div>
        <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-amber-300 font-semibold text-center">
          Prototype / Demonstration Environment for Smart India Hackathon (SIH26263)
        </div>
        <div>
          <span>Build: v1.0.4-sih-eval | Last Updated: Oct 2026</span>
        </div>
      </div>
    </footer>
  );
};
