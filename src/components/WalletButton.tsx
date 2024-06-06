import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
} from "wagmi";

import { Link } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { Dropdown, MenuProps, Modal, Space } from "antd";
import { AddressMini } from "../utils";
import { AiOutlineTwitter } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import appRoutes from "../routes";
import routes from "../routes";
import { useState } from "react";
import "./waletButton.css"

const WalletButton = () => {
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { connector: activeConnector, isConnected, address } = useAccount();
  const [openModal, setOpenModal] = useState(false)
  const { data:BNBPrice } = useBalance({
    address: address,
    // token: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  })
  const { data: WBNBPrice } = useBalance({
    address: address,
    token: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const items: MenuProps["items"] = [
    {
      label: <Link to={appRoutes.myNfts.path}>My Nfts</Link>,
      key: "0",
    },
    {
      label: <Link to={appRoutes.myShop.path}>My Shop</Link>,
      key: "1"
    },
    {
      // @ts-ignore
      label: <a onClick={disconnect}>Log Out</a>,
      key: "2",
    },
  ];
  const showModalUser = () => {
    setOpenModal(true);
  };

  const handleOk = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <>
      <header className="bg-black">
        <div className="row mx-20 flex justify-between">
          <div className="col flex py-2">
            <div className="flex pt-1.5 pr-6">
              <Link to={routes.home.path}>
                <img
                  className="w-54 h-9"
                  src="/image/Monnrfys.png"
                  alt="ETH"
                />
              </Link>
            </div>
            <div className="flex px-4 pt-0.5">
              <Link
                to={routes.allPops.path}
                className="px-2 py-2 text-lg text-white"
              >
                All Pops
              </Link>
              <Link to={routes.buyBox.path} className="px-8 py-2 text-lg text-white">
                BuyBox
              </Link>
              <Link to={routes.attributes.path} className="pr-8 py-2 text-lg text-white">
                Attributes
              </Link>
              <Link to={routes.faq.path} className="px-2 py-2 text-lg text-white">
                FAQ
              </Link>
            </div>
          </div>
          <div className="py-2 flex ">
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {isConnected ? (
                  <p onClick={showModalUser} className="text-white text-xl">
                    {AddressMini(address || "")}
                  </p>
                ) : (
                  <h2 className="text-white text-lg">Allow Wallet Access</h2>
                )}
              </button>
            ))}
            <div className="py-3 px-8">
              <AiOutlineTwitter className="text-white text-2xl" />
            </div>
            {
              isConnected ? <Dropdown className="h-full" menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <button className="text-white text-xl w-full py-2">
                      <BsPersonCircle className="text-3xl " />
                    </button>
                  </Space>
                </a>
              </Dropdown> : ""
            }
          </div>
        </div>
        <Modal title="User" open={openModal} onCancel={handleCancel} >
          <hr className="py-2" />
          <div>
            <h2 className="text-lg text-gray-400">Wallet Address </h2>
            <p className="font-medium text-lg">{address}</p>
          </div>
          <div className="py-2">
            <h2 className="text-lg text-gray-400">balance </h2>
            <div className="flex">
              <p className="font-medium text-lg">{BNBPrice?.formatted}</p>
              <p className="px-2 font-medium text-lg">BNB</p>
            </div>
            <div className="flex ">
              <p className="font-medium text-lg">{WBNBPrice?.formatted}</p>
              <p className="px-2 font-medium text-lg">WBNB</p>
            </div>
          </div>
        </Modal>
      </header>
    </>
  );
};

export default WalletButton;
