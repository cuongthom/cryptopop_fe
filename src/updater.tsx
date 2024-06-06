//an HOC for checking chain,..
import { bscTestnet } from "wagmi/chains";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { useEffect, useState } from "react";
import SwitchChainModal from "./components/SwitchChainModal";

function updater (WrappedComponent: any) {
  return function (props: any) {
    //get current connected chain
    const { chain } = useNetwork();
    const [isOpenWrongChainModal, setIsOpenWrongChainModal] = useState(false);
    const {
      error: errorSwitchChain,
      isLoading: isLoadingSwitchChain,
      pendingChainId,
      switchNetwork,
    } = useSwitchNetwork();
    useEffect(() => {
      if (!chain) return;
      if (chain.id !== bscTestnet.id) {
        //open switch network modal
        setIsOpenWrongChainModal(true);
      } else {
        setIsOpenWrongChainModal(false);
      }
    }, [chain]);
    return (
      <>
        <WrappedComponent {...props} />
        <SwitchChainModal open={isOpenWrongChainModal} />
      </>
    );
  };
}
export default updater;
