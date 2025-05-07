import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface WelcomeHeroProps {
  user: User;
}

export default function WelcomeHero({ user }: WelcomeHeroProps) {
  // Fetch carbon footprint data for comparison
  const { data: carbonFootprints } = useQuery({
    queryKey: [`/api/user/${user.id}/carbon-footprint`],
    enabled: !!user.id
  });

  // Calculate improvement percentage
  const improvementPercentage = carbonFootprints && carbonFootprints.length > 1
    ? Math.round(
        ((carbonFootprints[0].totalEmissions - carbonFootprints[carbonFootprints.length - 1].totalEmissions) 
          / carbonFootprints[0].totalEmissions) * 100
      )
    : null;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="rounded-2xl overflow-hidden shadow-md mb-8">
      {/* Hero image: mountainside forest with sustainable energy */}
      <div 
        className="h-40 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=80')" 
        }}
      />
      <CardContent className="p-6">
        <h2 className="text-xl font-bold font-heading text-neutral-800 dark:text-neutral-100 mb-2">
          {getGreeting()}, {user.fullName?.split(' ')[0] || user.username}!
        </h2>
        
        {improvementPercentage ? (
          <p className="text-neutral-600 dark:text-neutral-300">
            Your carbon footprint this week is{' '}
            <span className="text-primary font-semibold">
              {improvementPercentage}% lower
            </span>{' '}
            than last week. Keep it up!
          </p>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-300">
            Start tracking your activities to see how your carbon footprint changes over time.
          </p>
        )}
        
        <div className="mt-4 inline-flex flex-wrap gap-3">
          <Button className="bg-primary hover:bg-primary-dark text-white text-sm flex items-center" size="sm">
            <i className="ri-quiz-line mr-1"></i> Take Today's Quiz
          </Button>
          <Button variant="outline" size="sm" className="text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 text-sm flex items-center">
            <i className="ri-search-line mr-1"></i> Explore Tips
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
