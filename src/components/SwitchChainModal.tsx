import { Button, Modal } from "antd";
import { useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { bscTestnet } from "wagmi/chains";

const SwitchChainModal = ({ open }: any) => {
  const { chain = { id: 0 } } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork }: any =
    useSwitchNetwork();
  const handleSwitchChain = () => {
    if (!switchNetwork) {
      console.log("can not sw network");
      return;
    }
    switchNetwork(bscTestnet.id);


  };
  return (
    <Modal title="Wrong network" open={open} footer={[]} closable={false}>
      {/* <button disabled={!switchNetwork || chain.id === bscTestnet.id} onClick={handleSwitchChain}>switch net work </button>  */}
      <button className="border-slate-400 border px-2 my-2"
        disabled={!switchNetwork || chain.id === bscTestnet.id}
        onClick={handleSwitchChain}
      >
        switch net work
      </button>
      <div className="text-red-600">{error && "Please switch chain"}</div>
    </Modal>
  );
};

export default SwitchChainModal;
