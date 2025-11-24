export enum ViewState {
  HOME = 'HOME',
  DESTINATION_DETAIL = 'DESTINATION_DETAIL',
  TRIP_PLANNER = 'TRIP_PLANNER',
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            content: string;
        }[]
    }
  };
}

export interface TravelGuideData {
  locationName: string;
  content: string; // Markdown formatted text
  groundingChunks: GroundingChunk[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Destination {
  id: string;
  name: string;
  tagline?: string;
  imageUrl?: string;
}

export interface DivisionCategory {
  name: string;
  places: string[];
}

export interface TypeCategory {
  name: string;
  icon: string;
  places: string[];
}

export interface TravelPreferences {
  budget: string;
  mood: string;
  duration: string;
  activities: string;
}