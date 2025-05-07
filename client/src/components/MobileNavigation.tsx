import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { User } from "@shared/schema";

interface MobileNavigationProps {
  user: User;
  className?: string;
}

export default function MobileNavigation({ user, className }: MobileNavigationProps) {
  const [location] = useLocation();

  return (
    <div className={cn("md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-40", className)}>
      <div className="grid grid-cols-5 h-16">
        <Link href="/">
          <a className={cn(
            "flex flex-col items-center justify-center",
            location === "/" ? "text-primary" : "text-neutral-500 dark:text-neutral-400"
          )}>
            <i className="ri-home-line text-xl"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/challenges">
          <a className={cn(
            "flex flex-col items-center justify-center",
            location === "/challenges" ? "text-primary" : "text-neutral-500 dark:text-neutral-400"
          )}>
            <i className="ri-flag-line text-xl"></i>
            <span className="text-xs mt-1">Challenges</span>
          </a>
        </Link>
        
        <button className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center -mt-5">
            <i className="ri-add-line text-xl"></i>
          </div>
        </button>
        
        <Link href="/community">
          <a className={cn(
            "flex flex-col items-center justify-center",
            location === "/community" ? "text-primary" : "text-neutral-500 dark:text-neutral-400"
          )}>
            <i className="ri-team-line text-xl"></i>
            <span className="text-xs mt-1">Community</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={cn(
            "flex flex-col items-center justify-center",
            location === "/profile" ? "text-primary" : "text-neutral-500 dark:text-neutral-400"
          )}>
            <i className="ri-user-line text-xl"></i>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
