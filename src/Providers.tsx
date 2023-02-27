import React from 'react';
import { configureChains, createClient, mainnet, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_ID ?? '' }), publicProvider()],
);

const client = createClient({
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
        version: '1',
        qrcode: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const Providers = ({ children }: { children: React.ReactNode}) => (
  <WagmiConfig client={client}>
    {children}
  </WagmiConfig>
);

export default Providers;
