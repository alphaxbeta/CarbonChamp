import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TRANSPORTATION_OPTIONS } from "@/lib/constants";
import { CompleteOnboardingData, transportationSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TransportationStepProps {
  onSubmit: (data: Partial<CompleteOnboardingData>) => void;
  initialData: Partial<CompleteOnboardingData>;
}

type FormData = z.infer<typeof transportationSchema>;

export default function TransportationStep({ onSubmit, initialData }: TransportationStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(transportationSchema),
    defaultValues: {
      transportationMode: initialData.transportationMode
    }
  });
  
  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <h3 className="text-lg font-semibold mb-3 dark:text-white">Transportation</h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4">How do you typically commute daily?</p>
      
      <div className="space-y-3">
        {TRANSPORTATION_OPTIONS.map((option) => (
          <label 
            key={option.value}
            className="flex items-center p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <input 
              type="radio" 
              value={option.value}
              className="h-4 w-4 text-primary-light focus:ring-primary-light"
              {...register("transportationMode")}
            />
            <span className="ml-3 dark:text-neutral-300">{option.label}</span>
          </label>
        ))}
      </div>
      
      {errors.transportationMode && (
        <p className="mt-2 text-sm text-red-500">Please select your transportation method</p>
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
