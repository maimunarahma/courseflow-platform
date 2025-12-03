import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Loader2, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast is imported here

export default function Register() {

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast(); // Use the local toast hook for UI feedback
  
  // Initialize form state including the required confirmPassword and role
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Necessary for AuthContext's register validation
    role: "student" // Default role
  });

  const handleChange = (e) => {
    // This function correctly updates the form state based on input ID
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!agreedToTerms) {
      setIsLoading(false);
      toast({
        title: "Agreement Required",
        description: "You must agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if passwords match locally for a better user experience
    if (form.password !== form.confirmPassword) {
      setIsLoading(false);
      toast({
        title: "Password Mismatch",
        description: "Password and Confirm Password must match.",
        variant: "destructive",
      });
      return;
    }

    try {
     // The form object now contains all fields required by AuthContext's register function
     await register(form);
     // AuthContext's register handles success toast and user state update
     navigate('/dashboard');
    } catch (error) {
      // The AuthContext's register already handles error logging/toasting, 
      // but we need to ensure isLoading is set back to false here.
      console.error("Registration failed in component:", error);
    } finally {
      // Ensure loading state is reset regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(172_66%_50%/0.1),transparent_50%)]" />
      
      <Card className="w-full max-w-md relative z-10 shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mx-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">CourseMaster</span>
          </Link>
          <div>
            <CardTitle className="font-display text-2xl">Create an account</CardTitle>
            <CardDescription>Start your learning journey today</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={form.name} // Use form state
                  onChange={handleChange} // Use common handleChange
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  value={form.email} // Use form state
                  onChange={handleChange} // Use common handleChange
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={form.password} // Use form state
                  onChange={handleChange} // Use common handleChange
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* **NEW: Confirm Password Input (Required by AuthContext)** */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <CheckCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={form.confirmPassword} // Use form state
                  onChange={handleChange} // Use common handleChange
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <Button type="submit" className="w-full gradient-primary" disabled={isLoading || !agreedToTerms}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}