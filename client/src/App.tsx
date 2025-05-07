import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Challenges from "@/pages/challenges";
import Community from "@/pages/community";
import Profile from "@/pages/profile";
import { User } from "@shared/schema";
import OnboardingFlow from "@/components/Onboarding/OnboardingFlow";
import BaseLayout from "@/components/layouts/BaseLayout";

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [location] = useLocation();
  
  // Mock login function - in a real app this would use auth
  useEffect(() => {
    // Check if user is already in local storage
    const storedUser = localStorage.getItem("ecotrack-user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Create a demo user for testing
      const demoUser = {
        id: 1,
        username: "jordan",
        fullName: "Jordan Smith",
        password: "password123", // In a real app, don't store passwords like this
        location: "Denver, CO",
        avatarInitials: "JS",
        level: 3,
        points: 350
      };
      
      localStorage.setItem("ecotrack-user", JSON.stringify(demoUser));
      setUser(demoUser);
      setShowOnboarding(true);
    }
  }, []);
  
  // Function to complete onboarding
  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    
    // In a real app, update the user's onboarding status in the API
    // For now, just store it in localStorage
    localStorage.setItem("ecotrack-onboarding-complete", "true");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // If onboarding is needed and not on the 404 page
  if (showOnboarding && location !== "/not-found") {
    return <OnboardingFlow user={user} onComplete={handleCompleteOnboarding} />;
  }

  return (
    <BaseLayout user={user}>
      <Switch>
        <Route path="/" component={() => <Dashboard user={user} />} />
        <Route path="/challenges" component={() => <Challenges user={user} />} />
        <Route path="/community" component={() => <Community user={user} />} />
        <Route path="/profile" component={() => <Profile user={user} />} />
        <Route component={NotFound} />
      </Switch>
    </BaseLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
