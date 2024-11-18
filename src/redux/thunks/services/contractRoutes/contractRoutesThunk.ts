import axios from "../../../../../axiosConfig";
import { setIsLoading, setServiceLocations } from "../../../slices/services/companyServicesSlice";
import { Dispatch } from "redux";

export const gcontractRoutesThunk = (contractId: number) => async () => {
      let { data }  = await axios.get( `/consultar_ruta?contractId=${contractId}` );
      return data;
  };

  export const getServiceLocationsThunk = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setIsLoading(true));
        let { data }  = await axios.get( `/consultar_ubicaciones` );
        dispatch(setServiceLocations(data.data));
        return data;
    } catch (error) {
       console.log(error); 
    } finally {
        dispatch(setIsLoading(false));
    }
};