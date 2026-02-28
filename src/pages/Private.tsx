import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrivateProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin' | 'instructor';
  redirectTo?: string;
}

const Private: React.FC<PrivateProps> = ({ 
  children, 
  requiredRole = 'admin',
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-destructive/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required role: <span className="font-semibold text-foreground">{requiredRole}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Your role: <span className="font-semibold text-foreground">{user.role}</span>
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
            >
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="gradient-primary"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has correct role
  return <>{children}</>;
};

export default Private;
