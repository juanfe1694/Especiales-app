export type LocationProps = { 
    latitude: number;
    longitude: number; 
}

export type Address = {
  latitude: number;
  longitude: number;
  description: string; 
}

export type RouteProps = {
  origin: Address;
  destination: Address;
  departureTime: Date;
}