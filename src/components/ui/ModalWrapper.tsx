import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    backdropClassName?: string;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
}

// Focusable elements selector
const FOCUSABLE_ELEMENTS = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
    isOpen,
    onClose,
    children,
    className = '',
    backdropClassName = '',
    closeOnBackdropClick = true,
    closeOnEscape = true,
    ariaLabel,
    ariaDescribedBy
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Get all focusable elements within the modal
    const getFocusableElements = useCallback((): HTMLElement[] => {
        if (!modalRef.current) return [];
        return Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS));
    }, []);

    // Focus trap - handle Tab key
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!isOpen || !modalRef.current) return;

        // Handle Escape key
        if (event.key === 'Escape' && closeOnEscape) {
            event.preventDefault();
            event.stopPropagation();
            onClose();
            return;
        }

        // Handle Tab key for focus trapping
        if (event.key === 'Tab') {
            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Shift + Tab
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            }
            // Tab
            else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }, [isOpen, closeOnEscape, onClose, getFocusableElements]);

    // Store last focused element and set focus to modal when opening
    useEffect(() => {
        if (isOpen) {
            // Store the currently focused element
            previousActiveElement.current = document.activeElement as HTMLElement;

            // Focus the first focusable element in the modal
            const focusableElements = getFocusableElements();
            if (focusableElements.length > 0) {
                // Small delay to ensure modal is rendered
                requestAnimationFrame(() => {
                    focusableElements[0].focus();
                });
            } else if (modalRef.current) {
                // If no focusable elements, focus the modal itself
                modalRef.current.focus();
            }

            // Add event listener for keyboard navigation
            document.addEventListener('keydown', handleKeyDown);

            // Prevent body scroll when modal is open
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = originalOverflow;
            };
        } else {
            // Restore focus to previously focused element when closing
            if (previousActiveElement.current && previousActiveElement.current.focus) {
                previousActiveElement.current.focus();
            }
        }
    }, [isOpen, handleKeyDown, getFocusableElements]);

    // Handle backdrop click
    const handleBackdropClick = useCallback((event: React.MouseEvent) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
            onClose();
        }
    }, [closeOnBackdropClick, onClose]);

    if (!isOpen) return null;

    const modalContent = (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in ${backdropClassName}`}
            onClick={handleBackdropClick}
            role="presentation"
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                tabIndex={-1}
                className={`relative outline-none ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

// Higher-order component for easy migration
export const withFocusTrap = <P extends object>(
    WrappedComponent: React.ComponentType<P & { isOpen: boolean; onClose: () => void }>
) => {
    return function WithFocusTrapComponent(props: P & { isOpen: boolean; onClose: () => void }) {
        const { isOpen, onClose, ...rest } = props;

        return (
            <ModalWrapper isOpen={isOpen} onClose={onClose}>
                <WrappedComponent {...(rest as P)} isOpen={isOpen} onClose={onClose} />
            </ModalWrapper>
        );
    };
};
