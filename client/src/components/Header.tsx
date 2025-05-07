import { Link } from "wouter";
import { User } from "@shared/schema";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  user: User;
  title: string;
}

export default function Header({ user, title }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-neutral-900 shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="ri-leaf-line text-white text-xl"></i>
                </div>
                <h1 className="ml-2 text-xl font-bold text-neutral-800 dark:text-neutral-100 font-heading">EcoTrack</h1>
              </a>
            </Link>
          </div>
          
          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <a className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </a>
            </Link>
            <Link href="/challenges">
              <a className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Challenges
              </a>
            </Link>
            <Link href="/community">
              <a className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Community
              </a>
            </Link>
            <Link href="/profile">
              <a className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </a>
            </Link>
          </div>
          
          {/* User profile and actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            <button className="p-1 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 focus:outline-none">
              <i className="ri-notification-3-line text-xl"></i>
            </button>
            
            <Link href="/profile">
              <a className="relative flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-light text-white flex items-center justify-center">
                  <span className="text-sm font-medium">{user.avatarInitials}</span>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
