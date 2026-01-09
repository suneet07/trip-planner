
export interface Transportation {
  type: 'Uber' | 'Ola' | 'Both' | 'Taxi';
  estimatedCost: string; // e.g., "₹250 - ₹350"
  duration: string; // e.g., "15 mins"
  note?: string;
}

export interface Attraction {
  name: string;
  description: string;
  location: string;
  estimatedCost: string;
  timeSlot: string; // e.g., "09:00 AM - 11:30 AM"
  sourceUrl?: string;
  transportFromPrevious?: Transportation;
  // Added coordinates for map integration
  coordinates?: { lat: number; lng: number };
}

export interface DayItinerary {
  day: number;
  theme: string;
  activities: Attraction[];
}

export interface Accommodation {
  name: string;
  type: string;
  priceRange: string;
  description: string;
  link?: string;
  // Added coordinates for map integration
  coordinates?: { lat: number; lng: number };
}

export interface FoodSuggestion {
  name: string;
  cuisine: string;
  specialty: string;
  description: string;
  link?: string;
}

export interface BudgetBreakdown {
  category: string;
  estimatedCost: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TravelPlan {
  destination: string;
  duration: number;
  overview: string;
  itinerary: DayItinerary[];
  accommodations: Accommodation[];
  foodSuggestions: FoodSuggestion[];
  budgetBreakdown: BudgetBreakdown[];
  totalEstimatedBudget: number;
  currency: string;
  sources: GroundingSource[];
}

export interface TripFormData {
  destination: string;
  duration: number;
  travelers: number;
  budget: number;
  currency: string;
  interests: string[];
  includeHotelCharges: boolean;
  mustVisitPlaces?: string;
}
