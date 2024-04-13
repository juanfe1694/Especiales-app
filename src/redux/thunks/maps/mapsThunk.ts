
  import { Dispatch } from "redux";
  import axios from "axios";
  import { decode, encode } from "base-64";
import { RouteProps } from "../../../interfaces/locations/locationInterfaces";

  if (!global.btoa) {
    global.btoa = encode;
  }
  
  if (!global.atob) {
    global.atob = decode;
  }

  const url = process.env.EXPO_PUBLIC_ROUTES_URL;

  const apiKey = process.env.EXPO_PUBLIC_LOCATIONS_API_KEY;
  
  /* check if the user is registered */
  export const getRouteThunk = ({ origin, destination, departureTime }: RouteProps) => 
      async (dispatch: Dispatch) => {

    const headers = {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
    }
  
      try {
        let  {data}  = await axios.post( `${url}`, 
        { 
            "origin":{
                "location":{
                  "latLng":{
                    "latitude": origin.latitude,
                    "longitude": origin.longitude
                  }
                }
              },
              "destination":{
                "location":{
                  "latLng":{
                    "latitude": destination.latitude,
                    "longitude": destination.longitude
                  }
                }
              },
              "travelMode": "DRIVE",
              "routingPreference": "TRAFFIC_AWARE",
              "departureTime": "2023-10-15T15:01:23.045123456Z",
              "computeAlternativeRoutes": false,
              "routeModifiers": {
                "avoidTolls": false,
                "avoidHighways": false,
                "avoidFerries": false
              },
              "languageCode": "en-US",
              "units": "IMPERIAL"
        }, 
        { headers } 
        );
        return data;
      } catch (err: any) {
        throw err;
      }
    };