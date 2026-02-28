import { useNavigate } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
            <div className="relative bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-full w-32 h-32 flex items-center justify-center mx-auto border-2 border-destructive/20">
              <ShieldX className="h-16 w-16 text-destructive" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Access Denied
            </h1>
            
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground">
                You don't have permission to access this page
              </p>
              
              {user && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-sm">
                  <span className="text-muted-foreground">Logged in as:</span>
                  <span className="font-semibold text-foreground">{user.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {user.role}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This page requires specific permissions that your account doesn't have. 
              If you believe this is a mistake, please contact support.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>

            {user?.role === 'student' && (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="gradient-primary gap-2"
              >
                Go to Dashboard
              </Button>
            )}

            {user?.role === 'admin' && (
              <Button 
                onClick={() => navigate('/admin')}
                className="gradient-primary gap-2"
              >
                Go to Admin
              </Button>
            )}
          </div>

          {/* Help text */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Need access? Contact your administrator or{' '}
              <button 
                onClick={() => logout()}
                className="text-primary hover:underline font-medium"
              >
                switch account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
