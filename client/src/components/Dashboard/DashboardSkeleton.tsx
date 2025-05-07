import { Card, CardContent } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Hero Skeleton */}
      <Card className="rounded-2xl overflow-hidden shadow-md mb-8">
        <div className="h-40 bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
        <CardContent className="p-6">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 mb-4 animate-pulse"></div>
          <div className="flex space-x-3">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-28 animate-pulse"></div>
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-28 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Carbon Footprint Summary Skeleton */}
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse"></div>
                <div className="flex space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16 animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:space-x-8">
                <div className="flex-shrink-0 mb-6 md:mb-0">
                  <div className="w-36 h-36 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
                  <div className="text-center mt-2">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-32 mx-auto animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex-grow w-full h-64 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Challenges Skeleton */}
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-36 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Comparison Skeleton */}
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse"></div>
                <div className="flex space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16 animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {[1, 2, 3].map(i => (
                <div key={i} className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full w-full animate-pulse"></div>
                </div>
              ))}
              
              <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-6"></div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Weather Suggestions Skeleton */}
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse"></div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse mr-2"></div>
                <div>
                  <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-2">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                  <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Skeleton */}
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse mb-2"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-12 animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse"></div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 animate-pulse"></div>
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eco Tips Skeleton */}
          <Card className="bg-white dark:bg-neutral-900 rounded-xl shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-16 animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <div className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                <div className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
              </div>
              
              <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-6"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
