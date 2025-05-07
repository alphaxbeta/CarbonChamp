import { useState } from "react";
import { User, CompleteOnboardingData } from "@shared/schema";
import TransportationStep from "./TransportationStep";
import HousingStep from "./HousingStep";
import DietStep from "./DietStep";
import LifestyleStep from "./LifestyleStep";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OnboardingFlowProps {
  user: User;
  onComplete: () => void;
}

type OnboardingStep = 'transportation' | 'housing' | 'diet' | 'lifestyle';

export default function OnboardingFlow({ user, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('transportation');
  const [onboardingData, setOnboardingData] = useState<Partial<CompleteOnboardingData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleNextStep = (stepData: Partial<CompleteOnboardingData>) => {
    // Update onboarding data with the current step's data
    const updatedData = { ...onboardingData, ...stepData };
    setOnboardingData(updatedData);
    
    // Move to next step
    switch (currentStep) {
      case 'transportation':
        saveStepData(stepData);
        setCurrentStep('housing');
        break;
      case 'housing':
        saveStepData(stepData);
        setCurrentStep('diet');
        break;
      case 'diet':
        saveStepData(stepData);
        setCurrentStep('lifestyle');
        break;
      case 'lifestyle':
        // This is the final step, complete onboarding
        completeOnboarding({ ...updatedData, ...stepData });
        break;
    }
  };
  
  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'housing':
        setCurrentStep('transportation');
        break;
      case 'diet':
        setCurrentStep('housing');
        break;
      case 'lifestyle':
        setCurrentStep('diet');
        break;
    }
  };
  
  const saveStepData = async (stepData: Partial<CompleteOnboardingData>) => {
    try {
      const endpoint = `/api/onboarding/${currentStep}`;
      await apiRequest("POST", endpoint, {
        userId: user.id,
        ...stepData
      });
    } catch (error) {
      console.error(`Error saving ${currentStep} data:`, error);
      toast({
        title: "Couldn't save progress",
        description: "There was an error saving your progress, but you can continue.",
        variant: "destructive"
      });
    }
  };
  
  const completeOnboarding = async (finalData: Partial<CompleteOnboardingData>) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/onboarding/complete", {
        userId: user.id,
        transportationMode: finalData.transportationMode,
        homeEnergyUsage: finalData.homeEnergyUsage,
        dietType: finalData.dietType,
        lifestyleHabits: finalData.lifestyleHabits || []
      });
      
      toast({
        title: "Onboarding Complete!",
        description: "Your carbon footprint has been calculated. Welcome to EcoTrack!",
        variant: "success"
      });
      
      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error Completing Setup",
        description: "There was an error completing your profile setup. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  const renderStepIndicator = () => {
    const steps = ['transportation', 'housing', 'diet', 'lifestyle'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="flex items-center mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              index <= currentIndex 
                ? "bg-primary-light text-white" 
                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
            }`}>
              {index + 1}
            </div>
            
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-12 mx-1 ${
                index < currentIndex 
                  ? "bg-primary-light" 
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-neutral-900/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full p-6 mx-auto">
        <h2 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white mb-4">
          Welcome to EcoTrack
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 mb-6">
          Let's calculate your carbon footprint to get started. This takes about 2 minutes.
        </p>
        
        {renderStepIndicator()}
        
        <div className="mb-6">
          {currentStep === 'transportation' && (
            <TransportationStep 
              onSubmit={handleNextStep}
              initialData={onboardingData}
            />
          )}
          
          {currentStep === 'housing' && (
            <HousingStep 
              onSubmit={handleNextStep}
              initialData={onboardingData}
            />
          )}
          
          {currentStep === 'diet' && (
            <DietStep 
              onSubmit={handleNextStep}
              initialData={onboardingData}
            />
          )}
          
          {currentStep === 'lifestyle' && (
            <LifestyleStep 
              onSubmit={handleNextStep}
              initialData={onboardingData}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
        
        <div className="flex justify-between mt-8">
          <button 
            className={`px-4 py-2 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              currentStep === 'transportation' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handlePreviousStep}
            disabled={currentStep === 'transportation' || isSubmitting}
          >
            Back
          </button>
          
          {/* Form submission is handled by the individual step components */}
        </div>
      </div>
    </div>
  );
}
