import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key to close modals (if needed)
      if (event.key === 'Escape') {
        // You can add modal closing logic here if needed
        // For now, we'll just prevent default behavior
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
} 