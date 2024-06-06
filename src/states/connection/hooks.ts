import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {clearConnection, setProvider, setWeb3Instance, setPrice} from "./reducer";
import {AppState} from "../index";
import {ethers} from "ethers";

export const useConnection = () => {
  const connection = useSelector((state: AppState) => state.connection)
  const dispatch = useDispatch()


  const onSetProvider = useCallback((provider: ethers.providers.Web3Provider) => {
    dispatch(setProvider(provider))
  }, [dispatch])

  const onSetWeb3Instance = useCallback((instance: any) => {
    dispatch(setWeb3Instance(instance))
  }, [dispatch])


  const onClearConnection = useCallback(() => {
    dispatch(clearConnection(undefined))
  }, [dispatch])
  
  const onSetPrice = useCallback((price : any) => {
    dispatch(setPrice(price))
  }, [dispatch])



  return {
    connection,
    onSetPrice,
    onClearConnection,
    onSetProvider,
    onSetWeb3Instance
  }
}