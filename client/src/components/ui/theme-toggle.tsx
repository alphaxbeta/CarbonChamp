import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme toggle only shows after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" className="w-8 h-8" disabled />;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-8 h-8"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <i className="ri-moon-line text-lg"></i>
      ) : (
        <i className="ri-sun-line text-lg"></i>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
