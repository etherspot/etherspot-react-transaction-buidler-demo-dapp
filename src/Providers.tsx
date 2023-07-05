import { configureChains, createConfig, mainnet, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import type { ReactNode } from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_ID ?? '' }), publicProvider()]
);

console.log("shsgshshhs", process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID)

const client = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Etherspot Buidler',
      },
    }),
    new WalletConnectConnector({
      options: {
        projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ?? '',
        showQrModal: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const Providers = ({ children }: { children: ReactNode }) => (
  <WagmiConfig config={client}>{children}</WagmiConfig>
);

export default Providers;
