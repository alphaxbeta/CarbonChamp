// Carbon footprint per type
export const CARBON_FOOTPRINT = {
  TRANSPORT: {
    CAR: 12.0,
    CARPOOL: 6.0,
    PUBLIC: 4.0,
    BIKE: 0.5,
    MIXED: 5.0
  },
  HOME: {
    LOW: 5.0,
    MEDIUM: 8.0,
    HIGH: 12.0,
    VERY_HIGH: 18.0
  },
  DIET: {
    VEGAN: 3.0,
    VEGETARIAN: 4.0,
    PESCATARIAN: 5.0,
    LOW_MEAT: 7.0,
    REGULAR: 10.0
  }
};

// Challenge categories
export const CHALLENGE_CATEGORIES = {
  TRANSPORT: "transport",
  FOOD: "food",
  HOME: "home",
  WASTE: "waste",
  WATER: "water"
};

// Transportation options for onboarding
export const TRANSPORTATION_OPTIONS = [
  { value: "car", label: "Car (alone)" },
  { value: "carpool", label: "Carpool" },
  { value: "public", label: "Public Transportation" },
  { value: "bike", label: "Bicycle/Walking" },
  { value: "mixed", label: "Mix of methods" }
];

// Housing energy usage options for onboarding
export const HOUSING_OPTIONS = [
  { value: "low", label: "Low (eco-friendly home, renewable energy)" },
  { value: "medium", label: "Medium (some energy-saving practices)" },
  { value: "high", label: "High (regular household consumption)" },
  { value: "very_high", label: "Very High (large home, high energy use)" }
];

// Diet options for onboarding
export const DIET_OPTIONS = [
  { value: "vegan", label: "Vegan (plant-based only)" },
  { value: "vegetarian", label: "Vegetarian (no meat)" },
  { value: "pescatarian", label: "Pescatarian (fish, but no other meat)" },
  { value: "low_meat", label: "Low meat consumption (mostly plant-based)" },
  { value: "regular", label: "Regular (balanced diet with meat)" }
];

// Lifestyle options for onboarding
export const LIFESTYLE_OPTIONS = [
  { value: "recycle", label: "Regular recycling" },
  { value: "compost", label: "Composting" },
  { value: "reusable", label: "Using reusable bags/bottles" },
  { value: "local", label: "Shopping locally" },
  { value: "secondhand", label: "Buying secondhand" },
  { value: "energy_efficient", label: "Using energy-efficient appliances" },
  { value: "water_conscious", label: "Water conservation practices" },
  { value: "zero_waste", label: "Reducing household waste" }
];

// Weather condition based suggestions
export const WEATHER_SUGGESTIONS = {
  // Temperature-based suggestions (in Fahrenheit)
  TEMPERATURE: {
    COLD: [
      { 
        icon: "ri-home-heart-line", 
        text: "It's cold! Use a programmable thermostat to optimize heating.", 
        color: "primary"
      },
      { 
        icon: "ri-door-lock-line", 
        text: "Check for drafts around doors and windows to save heating energy.", 
        color: "secondary"
      }
    ],
    MILD: [
      { 
        icon: "ri-bike-line", 
        text: "Perfect biking weather! Leave your car at home today.", 
        color: "primary",
        actionText: "View Route"
      },
      { 
        icon: "ri-walk-line", 
        text: "Great weather for walking instead of driving short distances.", 
        color: "secondary"
      }
    ],
    WARM: [
      { 
        icon: "ri-windy-line", 
        text: "Open windows instead of using A/C - save energy!", 
        color: "secondary"
      },
      { 
        icon: "ri-sun-foggy-line", 
        text: "Draw curtains to block direct sunlight and keep your home cooler.", 
        color: "primary"
      }
    ],
    HOT: [
      { 
        icon: "ri-water-flash-line", 
        text: "It's hot! Water your plants in the early morning to reduce evaporation.", 
        color: "primary"
      },
      { 
        icon: "ri-temp-cold-line", 
        text: "Set your A/C a few degrees higher to reduce energy usage.", 
        color: "secondary"
      }
    ]
  },
  // Weather condition based suggestions
  CONDITION: {
    CLEAR: [
      { 
        icon: "ri-sun-line", 
        text: "Great day to dry clothes outside instead of using the dryer.", 
        color: "accent"
      },
      { 
        icon: "ri-plant-line", 
        text: "Perfect day for outdoor activities with zero carbon footprint!", 
        color: "primary"
      }
    ],
    CLOUDS: [
      { 
        icon: "ri-cloud-line", 
        text: "Still a good day to avoid unnecessary driving. Walk if possible!", 
        color: "secondary"
      }
    ],
    RAIN: [
      { 
        icon: "ri-water-flash-line", 
        text: "Remember to collect rainwater for your plants!", 
        color: "secondary"
      },
      { 
        icon: "ri-car-washing-line", 
        text: "Skip the car wash today - let nature do it for free!", 
        color: "primary"
      }
    ],
    SNOW: [
      { 
        icon: "ri-home-smile-line", 
        text: "Check your home insulation to keep heat in and save energy.", 
        color: "secondary"
      }
    ],
    THUNDERSTORM: [
      { 
        icon: "ri-plug-line", 
        text: "Unplug sensitive electronics during the storm to prevent damage.", 
        color: "accent"
      }
    ],
    FOG: [
      { 
        icon: "ri-car-line", 
        text: "Drive less in foggy conditions - consider working from home if possible.", 
        color: "primary"
      }
    ]
  }
};

// Eco tips categorized by type
export const ECO_TIPS = {
  HOME: [
    {
      icon: "ri-lightbulb-line",
      tip: "Unplug electronics when not in use - they still consume power in standby mode!"
    },
    {
      icon: "ri-lightbulb-line",
      tip: "Washing clothes in cold water saves energy and is gentler on fabrics."
    },
    {
      icon: "ri-home-line",
      tip: "Lower your thermostat by just 1°C can reduce your heating bill by up to 10%."
    },
    {
      icon: "ri-water-flash-line",
      tip: "Fix leaky faucets - a dripping tap can waste more than 3,000 gallons a year."
    }
  ],
  TRANSPORT: [
    {
      icon: "ri-car-line",
      tip: "Properly inflated tires can improve your gas mileage by up to 3%."
    },
    {
      icon: "ri-car-line",
      tip: "Remove excess weight from your car - every 100lbs reduces MPG by about 1%."
    },
    {
      icon: "ri-roadster-line",
      tip: "Plan multiple errands in one trip to save fuel and reduce emissions."
    },
    {
      icon: "ri-bike-line",
      tip: "For trips less than 2 miles, biking is often faster than driving when you factor in parking time."
    }
  ],
  FOOD: [
    {
      icon: "ri-restaurant-line",
      tip: "Eating locally grown food reduces transportation emissions."
    },
    {
      icon: "ri-shopping-basket-line",
      tip: "Plan meals to reduce food waste - the average family throws away 25% of food purchased."
    },
    {
      icon: "ri-refrigerator-line",
      tip: "Keep your refrigerator at 38-40°F and your freezer at 0-5°F for optimal efficiency."
    },
    {
      icon: "ri-plant-line",
      tip: "Try having one meatless day per week to significantly reduce your carbon footprint."
    }
  ],
  WASTE: [
    {
      icon: "ri-recycle-line",
      tip: "Aluminium cans can be recycled indefinitely without any loss of quality."
    },
    {
      icon: "ri-recycle-line",
      tip: "Reuse glass jars for food storage instead of buying plastic containers."
    },
    {
      icon: "ri-plant-line",
      tip: "Start composting kitchen scraps to reduce landfill waste and create rich soil for plants."
    },
    {
      icon: "ri-file-paper-line",
      tip: "Go paperless with bills and statements to save trees and reduce waste."
    }
  ]
};
