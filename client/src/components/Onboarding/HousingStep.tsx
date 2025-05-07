import { Button } from "@/components/ui/button";
import { HOUSING_OPTIONS } from "@/lib/constants";
import { CompleteOnboardingData, housingSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface HousingStepProps {
  onSubmit: (data: Partial<CompleteOnboardingData>) => void;
  initialData: Partial<CompleteOnboardingData>;
}

type FormData = z.infer<typeof housingSchema>;

export default function HousingStep({ onSubmit, initialData }: HousingStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(housingSchema),
    defaultValues: {
      homeEnergyUsage: initialData.homeEnergyUsage
    }
  });
  
  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <h3 className="text-lg font-semibold mb-3 dark:text-white">Home Energy</h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4">How would you describe your home energy usage?</p>
      
      <div className="space-y-3">
        {HOUSING_OPTIONS.map((option) => (
          <label 
            key={option.value}
            className="flex items-center p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <input 
              type="radio" 
              value={option.value}
              className="h-4 w-4 text-primary-light focus:ring-primary-light"
              {...register("homeEnergyUsage")}
            />
            <span className="ml-3 dark:text-neutral-300">{option.label}</span>
          </label>
        ))}
      </div>
      
      {errors.homeEnergyUsage && (
        <p className="mt-2 text-sm text-red-500">Please select your home energy usage</p>
      )}
      
      <div className="mt-6 flex justify-end">
        <Button 
          type="submit"
          className="px-6 py-2 bg-primary font-medium text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Next
        </Button>
      </div>
    </form>
  );
}
