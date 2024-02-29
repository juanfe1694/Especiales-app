
import { Dispatch } from "redux";
import axios from "../../../../axiosConfig";

  /* Update the device token */
  export const updateTokenThunk = (numeroDocumento: string, token: string) => async (dispatch: Dispatch) => {
      try {
        let  {data}  = await axios.put( `/editar_usuario`, 
        { numeroDocumento, token }, 
        { } 
        );
      } catch (err: any) {
        throw err;
      }
    };
  
  