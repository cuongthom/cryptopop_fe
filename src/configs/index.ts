import { WagmiConfig, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { bscTestnet } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";


export const { chains, provider, webSocketProvider } = configureChains(
    [bscTestnet],
    [
        publicProvider(),
        jsonRpcProvider({
            rpc: (chain) => ({
                http: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
            }),
        }),
    ]
);

export const wagmiClient = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
    connectors: [new MetaMaskConnector({ chains })],
});
