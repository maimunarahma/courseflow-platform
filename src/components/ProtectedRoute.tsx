import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'student' | 'admin' | 'instructor';
  redirectTo?: string;
}

/**
 * ProtectedRoute - Flexible route protection component
 * 
 * @param requireAuth - If true, user must be logged in (default: true)
 * @param requireRole - If specified, user must have this role
 * @param redirectTo - Where to redirect if access denied (default: /login)
 * 
 * Usage:
 * <Route path="/admin" element={<ProtectedRoute requireRole="admin"><Admin /></ProtectedRoute>} />
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requireRole,
  redirectTo = '/login'
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  // Check role requirement
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requireRole="admin" redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
};

/**
 * StudentRoute - Shorthand for student-only routes
 */
export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requireRole="student" redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
};

/**
 * AuthRoute - Shorthand for routes that require any authenticated user
 */
export const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requireAuth={true} redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
};
