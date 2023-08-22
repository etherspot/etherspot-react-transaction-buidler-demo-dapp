import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  gnosis,
  mainnet,
  polygon,
  arbitrum,
  bsc,
  optimism,
  avalanche,
  celo,
  okc,
  moonbeam,
  fantom,
  aurora
} from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import type { ReactNode } from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, gnosis, mainnet, arbitrum, bsc, optimism, avalanche, celo, okc, moonbeam, fantom, aurora],
  [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_ID ?? '' }), publicProvider()]
);

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
      chains,
      options: {
        isNewChainsStale: false,
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
