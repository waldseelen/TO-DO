import { AlertCircle } from 'lucide-react';

import { ModalWrapper } from './ModalWrapper';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: Props) => {
    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            ariaLabel={title}
            ariaDescribedBy="modal-description"
        >
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-xl max-w-sm w-full border border-slate-100 dark:border-slate-700 mx-4">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
                    <p id="modal-description" className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};
