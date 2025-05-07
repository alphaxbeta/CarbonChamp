import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { User } from "@shared/schema";
import { useLocation } from "wouter";

interface BaseLayoutProps {
  children: React.ReactNode;
  user: User;
}

export default function BaseLayout({ children, user }: BaseLayoutProps) {
  const [location] = useLocation();
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide mobile nav when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowMobileNav(false);
      } else {
        setShowMobileNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Extract page title from current location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/challenges":
        return "Challenges";
      case "/community":
        return "Community";
      case "/profile":
        return "Profile";
      default:
        return "EcoTrack";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} title={getPageTitle()} />
      
      {/* Main content with proper padding for mobile nav */}
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Mobile navigation */}
      <MobileNavigation 
        user={user} 
        className={`transition-transform duration-300 ${showMobileNav ? 'translate-y-0' : 'translate-y-full'}`} 
      />
    </div>
  );
}
