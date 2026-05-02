import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

type LoaderVariant =
  | "card"
  | "page"
  | "list"
  | "inline";

interface AppLoaderProps {
  variant?: LoaderVariant;
  lines?: number;
  className?: string;
}

export default function AppLoader({
  variant = "card",
  lines = 3,
  className,
}: AppLoaderProps) {
  // ---------------- CARD ----------------
  if (variant === "card") {
    return (
      <div
        className={cn(
          "bg-card text-card-foreground rounded-2xl shadow-elevated overflow-hidden border border-border/50",
          className
        )}
      >
        <div className="relative h-48 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
               style={{ 
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 2s infinite'
               }} 
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse" />
            <div className="h-6 w-3/4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" 
                 style={{ animationDelay: '0.1s' }} 
            />
          </div>

          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse" 
                 style={{ animationDelay: '0.2s' }} 
            />
            <div className="h-6 w-16 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse" 
                 style={{ animationDelay: '0.3s' }} 
            />
          </div>

          <div className="space-y-2.5">
            <div className="h-3.5 w-full bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse" 
                 style={{ animationDelay: '0.4s' }} 
            />
            <div className="h-3.5 w-5/6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse" 
                 style={{ animationDelay: '0.5s' }} 
            />
          </div>

          <div className="pt-2">
            <div className="h-11 w-full bg-gradient-to-r from-muted via-muted/50 to-muted rounded-xl animate-pulse" 
                 style={{ animationDelay: '0.6s' }} 
            />
          </div>
        </div>
      </div>
    );
  }

  // ---------------- LIST ----------------
  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-xl border border-border/50 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  // ---------------- INLINE ----------------
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "h-4 w-24 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse",
          className
        )}
      />
    );
  }

  // ---------------- PAGE ----------------
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 w-full max-w-md px-4">
        {/* Animated Logo/Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative h-16 w-16 gradient-primary rounded-2xl flex items-center justify-center animate-bounce">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Animated Text */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-8 w-48 mx-auto bg-gradient-to-r from-muted via-primary/10 to-muted rounded-xl animate-pulse" 
                 style={{ animationDelay: '0.1s' }}
            />
            <div className="h-4 w-64 mx-auto bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse" 
                 style={{ animationDelay: '0.2s' }}
            />
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 h-full gradient-primary rounded-full"
            style={{
              animation: 'progress 1.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Loading amazing content...
        </p>
      </div>

      <style>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
