import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LIFESTYLE_OPTIONS } from "@/lib/constants";
import { CompleteOnboardingData, lifestyleSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

interface LifestyleStepProps {
  onSubmit: (data: Partial<CompleteOnboardingData>) => void;
  initialData: Partial<CompleteOnboardingData>;
  isSubmitting: boolean;
}

type FormData = z.infer<typeof lifestyleSchema>;

export default function LifestyleStep({ onSubmit, initialData, isSubmitting }: LifestyleStepProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(lifestyleSchema),
    defaultValues: {
      lifestyleHabits: initialData.lifestyleHabits || []
    }
  });
  
  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <h3 className="text-lg font-semibold mb-3 dark:text-white">Lifestyle Habits</h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4">Select the eco-friendly habits you regularly practice:</p>
      
      <div className="space-y-3">
        <Controller
          name="lifestyleHabits"
          control={control}
          render={({ field }) => (
            <>
              {LIFESTYLE_OPTIONS.map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...field.value, option.value]
                        : field.value.filter(value => value !== option.value);
                      field.onChange(updatedValue);
                    }}
                    className="h-4 w-4 text-primary-light focus:ring-primary-light"
                  />
                  <span className="ml-3 dark:text-neutral-300">{option.label}</span>
                </label>
              ))}
            </>
          )}
        />
      </div>
      
      {errors.lifestyleHabits && (
        <p className="mt-2 text-sm text-red-500">Please select at least one habit</p>
      )}
      
      <div className="mt-6 flex justify-end">
        <Button 
          type="submit"
          className="px-6 py-2 bg-primary font-medium text-white rounded-lg hover:bg-primary-dark transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">
                <i className="ri-loader-2-line"></i>
              </span>
              Processing...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </div>
    </form>
  );
}
