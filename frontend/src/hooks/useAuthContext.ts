import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.types';
import type { AuthContextType } from '../contexts/AuthContext.types';

/**
 * Hook that lets any component access the auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
