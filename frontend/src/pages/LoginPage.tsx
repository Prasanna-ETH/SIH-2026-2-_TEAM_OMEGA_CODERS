import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Building2, Lock, User, RefreshCw, KeyRound, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, switchRole } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'aicte' | 'institution'>('aicte');
  const [userId, setUserId] = useState('AICTE_ADMIN');
  const [instId, setInstId] = useState('AICTE/DEMO/10021');
  const [password, setPassword] = useState('••••••••••••');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7K9P2');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
  };

  const handleTabChange = (tab: 'aicte' | 'institution') => {
    setActiveTab(tab);
    setErrorMsg('');
    if (tab === 'aicte') {
      setUserId('AICTE_ADMIN');
    } else {
      setUserId('INST_10021');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // In prototype, allow quick demo login
    try {
      if (activeTab === 'aicte') {
        await login('AICTE_ADMIN');
      } else {
        await login('INST_10021');
      }
      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white border border-slate-300 rounded-lg shadow-md w-full max-w-md overflow-hidden">
        {/* Card Header */}
        <div className="bg-[#0b2545] text-white p-5 text-center border-b-2 border-amber-500">
          <div className="inline-flex p-2 rounded-full bg-slate-900 border border-amber-400/60 mb-2">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">APAAR Student Data &amp; Verification System</h2>
          <p className="text-xs text-slate-300 mt-1">
            Secure regulatory gateway for authorized institutions &amp; AICTE officials
          </p>
        </div>

        {/* Login Type Tabs */}
        <div className="grid grid-cols-2 text-xs font-semibold border-b border-slate-300 bg-slate-50">
          <button
            type="button"
            onClick={() => handleTabChange('aicte')}
            className={`py-3 flex items-center justify-center space-x-2 border-b-2 transition ${
              activeTab === 'aicte'
                ? 'border-[#0b2545] bg-white text-[#0b2545]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AICTE Official</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('institution')}
            className={`py-3 flex items-center justify-center space-x-2 border-b-2 transition ${
              activeTab === 'institution'
                ? 'border-[#0b2545] bg-white text-[#0b2545]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Institution Portal</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'institution' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                AICTE Institution ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={instId}
                  onChange={(e) => setInstId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none font-mono"
                  placeholder="e.g. AICTE/DEMO/10021"
                  required
                />
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Authorized User ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none font-mono uppercase"
                placeholder={activeTab === 'aicte' ? 'AICTE_ADMIN' : 'INST_10021'}
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Captcha Box */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Security Captcha <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="bg-slate-200 border border-slate-400 px-4 py-1.5 rounded font-mono font-bold tracking-widest text-slate-800 text-sm select-none">
                {captchaCode}
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-100"
                title="Refresh Captcha"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter characters"
                className="flex-1 px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none uppercase font-mono"
              />
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              For demo, captcha validation is automatic.
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
              <span className="text-slate-600">Remember session</span>
            </label>
            <a href="#forgot" className="text-blue-700 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0b2545] hover:bg-[#133863] text-white font-bold py-2.5 px-4 rounded shadow transition text-xs tracking-wide"
          >
            {t('btn_login')}
          </button>
        </form>

        {/* Prototype Demo Accounts Helper */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-600">
          <div className="font-semibold text-slate-800 mb-1.5 flex items-center space-x-1">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Prototype Evaluation Demo Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => {
                setActiveTab('aicte');
                setUserId('AICTE_ADMIN');
                switchRole('AICTE_ADMIN');
                onLoginSuccess();
              }}
              className="p-1.5 bg-white border border-slate-300 rounded hover:border-blue-500 text-left transition"
            >
              <div className="font-bold text-slate-800">AICTE Official</div>
              <div className="font-mono text-slate-500">AICTE_ADMIN</div>
            </button>

            <button
              onClick={() => {
                setActiveTab('institution');
                setUserId('INST_10021');
                setInstId('AICTE/DEMO/10021');
                switchRole('INSTITUTION');
                onLoginSuccess();
              }}
              className="p-1.5 bg-white border border-slate-300 rounded hover:border-blue-500 text-left transition"
            >
              <div className="font-bold text-slate-800">ABC Institute</div>
              <div className="font-mono text-slate-500">INST_10021</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
