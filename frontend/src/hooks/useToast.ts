import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import type { ToastContextValue } from '../contexts/ToastContext';

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
