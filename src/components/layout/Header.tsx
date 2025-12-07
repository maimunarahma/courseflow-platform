import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated,  logout } = useAuth();
  console.log(user )
  fetch(`${import.meta.env.VITE_SERVER_URL}/debug/cookies`, { credentials: 'include' })
  .then(r => {
    r.json();
    console.log(r.json())
    
  })
  
  .catch(console.error);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline-block">CourseMaster</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Courses
          </Link>
          <Link to="/courses?category=Web Development" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Web Dev
          </Link>
          <Link to="/courses?category=Data Science" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Data Science
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center max-w-sm flex-1 mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-10 bg-secondary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="gradient-primary text-primary-foreground">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={ '/dashboard'} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="gradient-primary hover:opacity-90 transition-opacity">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-fade-in">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <nav className="flex flex-col gap-2">
            <Link
              to="/courses"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Courses
            </Link>
            <Link
              to="/courses?category=Web Development"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Web Development
            </Link>
            <Link
              to="/courses?category=Data Science"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Data Science
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors sm:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
