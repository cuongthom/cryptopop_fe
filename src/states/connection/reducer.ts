import {createSlice} from "@reduxjs/toolkit";
import {ethers} from "ethers";


export type ConnectionStateType = {
  idPops: string | undefined,
  provider: ethers.providers.Web3Provider | null,
  web3Instance: any | null
}
const initialState: ConnectionStateType = {
  idPops: '',
  web3Instance: null,
  provider: null,
}


const connectionSlice = createSlice({
  initialState,
  name: "connection",
  reducers: {
    setProvider: (state, action) => {
      state.provider = action.payload
    },
    setWeb3Instance: (state, action) => {
      state.web3Instance = action.payload
    },
    clearConnection: (state, action) => {
      return initialState
    },
    setPrice: (state, action) => {
      state.idPops = action.payload
    }
  }
})

const {actions, reducer} = connectionSlice;
export const { clearConnection, setProvider, setWeb3Instance,setPrice} = actions
export default reducer;