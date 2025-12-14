import { LectureNote } from '@/types';

// Track active blob URLs for cleanup
const activeBlobUrls = new Set<string>();

// Cleanup function for all active blobs (can be called on page unload)
const cleanupAllBlobs = () => {
    activeBlobUrls.forEach(url => {
        try {
            URL.revokeObjectURL(url);
        } catch (e) {
            // Ignore errors during cleanup
        }
    });
    activeBlobUrls.clear();
};

// Register cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanupAllBlobs);
}

// Base64'ten Blob URL oluştur ve yeni sekmede aç
export const openPDFInNewTab = (lectureNote: LectureNote): void => {
    try {
        const byteCharacters = atob(lectureNote.fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        // Track this blob URL for cleanup
        activeBlobUrls.add(blobUrl);

        // Attempt to open in new tab
        const newWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');

        // Handle popup blocker scenarios
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // Popup was blocked - show user-friendly message and fallback
            const userConfirmed = window.confirm(
                'Pop-up penceresi engellenmiş görünüyor. PDF\'i indirmek ister misiniz?'
            );

            if (userConfirmed) {
                // Fallback to download
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${lectureNote.name}.pdf`;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            // Clean up blob URL after short delay for download
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
                activeBlobUrls.delete(blobUrl);
            }, 10000); // 10 seconds for download
        } else {
            // Successfully opened - clean up blob URL after 3 minutes (safe margin for tab to load)
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
                activeBlobUrls.delete(blobUrl);
            }, 180000); // 3 minutes = 180000ms
        }
    } catch (error) {
        console.error('PDF açma hatası:', error);
        const event = new CustomEvent('toast', {
            detail: { message: 'PDF açılırken bir hata oluştu', type: 'error' }
        });
        window.dispatchEvent(event);
    }
};

// PDF indirme fonksiyonu
export const downloadPDF = (lectureNote: LectureNote): void => {
    try {
        const byteCharacters = atob(lectureNote.fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${lectureNote.name}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up immediately after download starts
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 1000);
    } catch (error) {
        console.error('PDF indirme hatası:', error);
        const event = new CustomEvent('toast', {
            detail: { message: 'PDF indirilirken bir hata oluştu', type: 'error' }
        });
        window.dispatchEvent(event);
    }
};
