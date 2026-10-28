import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle2, ExternalLink } from 'lucide-react';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  severity: string;
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNavigate: (route: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onNavigate
}) => {
  if (!isOpen) return null;

  const getIcon = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-slate-300 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0b2545] text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-sm">Regulatory Notices &amp; System Alerts</h2>
            <span className="bg-amber-500 text-slate-900 text-xs font-bold px-1.5 py-0.2 rounded-full">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-3">
          {notifications.length === 0 ? (
            <p className="text-slate-500 text-center py-6 text-sm">No new regulatory alerts.</p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded text-xs hover:bg-slate-100 transition"
              >
                <div className="flex items-start space-x-2.5">
                  {getIcon(item.severity)}
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-slate-800">{item.title}</span>
                      <span className="text-[10px] text-slate-500">{item.created_at}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{item.message}</p>
                    {item.link_url && (
                      <button
                        onClick={() => {
                          onNavigate(item.link_url!);
                          onClose();
                        }}
                        className="mt-2 inline-flex items-center space-x-1 text-blue-700 font-semibold hover:underline"
                      >
                        <span>View in Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
