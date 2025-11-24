import { Copy, Download, Settings as SettingsIcon, Upload, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onExportToday: () => void;
}

export const SettingsModal = ({ isOpen, onClose, onImport, onExport, onExportToday }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-xl max-w-sm w-full border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <SettingsIcon className="text-slate-500" /> Ayarlar
          </h3>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">Verileri Yedekle</h4>
            <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mb-3">Tüm ilerlemeni bir JSON dosyası olarak indir.</p>
            <button
              onClick={onExport}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Download size={16} /> Yedeği İndir
            </button>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">Markdown Export</h4>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mb-3">Bugün tamamlananları Obsidian/Notion için kopyala.</p>
            <button
              onClick={onExportToday}
              className="w-full py-2 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Copy size={16} /> Panoya Kopyala
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Yedeği Yükle</h4>
            <p className="text-xs text-slate-500 mb-3">Daha önce indirdiğin yedeği geri yükle.</p>
            <label className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
              <Upload size={16} />
              Dosya Seç
              <input type="file" accept=".json" onChange={onImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
