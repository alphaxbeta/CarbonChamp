import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  backgroundColor?: string;
  progressColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 150,
  strokeWidth = 8,
  className,
  backgroundColor = "hsl(var(--muted))",
  progressColor = "hsl(var(--primary))",
  children
}: ProgressRingProps) {
  // Calculate radius accounting for stroke width
  const radius = (size - strokeWidth) / 2;
  // Calculate circumference
  const circumference = 2 * Math.PI * radius;
  // Calculate stroke-dashoffset
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        <circle
          className="progress-ring__circle"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring__circle"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
