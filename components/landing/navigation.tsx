"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { site } from "@/lib/site";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth";
import { AuthApiError } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Analytics", href: "#analytics" },
  { name: "Security", href: "#security" },
  { name: "Developers", href: "#developers" },
  { name: "Pricing", href: "#pricing" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  const handleSignIn = () => {
    window.location.href = site.auth.signIn;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
      });
      window.location.href = "/";
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          <a href="#" className="flex items-center gap-2 group">
            <span
              className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}
            >
              {site.name}
            </span>
          </a>

          <DesktopNav
            isScrolled={isScrolled}
            isAuthenticated={isAuthenticated}
            user={user}
            loading={loading}
            onSignIn={handleSignIn}
            onLogout={handleLogout}
          />

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms",
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div
            className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            {loading ? (
              <div className="flex-1 text-center text-foreground/50">
                Loading...
              </div>
            ) : isAuthenticated ? (
              <>
                <Button
                  className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <a href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name || user?.email || "Profile"}
                  </a>
                </Button>
                <Button
                  className="flex-1 bg-black text-white rounded-full h-14 text-base"
                  onClick={async () => {
                    await handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                className="flex-1 bg-black text-white rounded-full h-14 text-base"
                asChild
              >
                <a
                  href={site.auth.signIn}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function DesktopNav({
  isScrolled,
  isAuthenticated,
  user,
  loading,
  onSignIn,
  onLogout,
}: {
  isScrolled: boolean;
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  onSignIn: () => void;
  onLogout: () => Promise<void>;
}) {
  return (
    <>
      <div className="hidden md:flex items-center gap-12">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-4">
        {loading ? (
          <div className="text-sm text-foreground/50">Loading...</div>
        ) : isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-5 h-10 text-sm"}`}
              asChild
            >
              <a href="/profile">
                <User className="h-4 w-4 mr-2" />
                {user?.name || user?.email || "Profile"}
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-5 h-10 text-sm"}`}
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={`rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-5 h-10 text-sm"}`}
            asChild
          >
            <a href={site.auth.signIn}>Sign in</a>
          </Button>
        )}
      </div>
    </>
  );
}
