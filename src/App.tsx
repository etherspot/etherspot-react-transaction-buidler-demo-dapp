import React, { useMemo, useState } from 'react';
import { Etherspot } from '@etherspot/react-transaction-buidler';
import styled, { createGlobalStyle } from 'styled-components';
import Web3 from 'web3';
import { Web3AuthCore } from '@web3auth/core';
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import SignIn from './components/SignIn';

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_ID ?? '' }), publicProvider()]
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
        qrcode: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const chainId = 1;

const GlobalStyle = createGlobalStyle`
  body {
    background: #191726;
  }

  * {
    margin: 0;
    padding: 0;
  }
`;

const Wrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`;

const ToggleThemeButton = styled.span`
  padding: 10px;
  display: inline-block;
  border: 1px solid #fff;
  text-transform: uppercase;
  font-size: 12px;
  margin-right: 20px;
  font-family: 'Arial', sans;
  cursor: pointer;
  margin-bottom: 15px;
  color: #fff;

  &:hover {
    opacity: 0.4;
  }
`;

const App = () => {
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [useDashboardTheme, setUseDashboardTheme] = useState(false);
  const [web3AuthInstance, setWeb3AuthInstance] = useState<Web3AuthCore | null>(null);
  const [wagmiLogout, setWagmiLogout] = useState<Function | null>(null);

  const themeOverride = useMemo(() => {
    if (!useDashboardTheme) return undefined;
    return {
      color: {
        background: {
          main: 'linear-gradient(to right, #f43b40, #f8793f)',
          card: '#fff7f2',
          topMenu: '#fff',
          topMenuButton: '#fff',
          selectInput: '#fff',
          selectInputExpanded: '#fff',
          selectInputScrollbar: '#ff7733',
          selectInputScrollbarHover: 'rgba(255, 119, 51, 0.8)',
          selectInputScrollbarActive: 'rgba(255, 119, 51, 0.5)',
          selectInputImagePlaceholder: '#ffe6d9',
          selectInputToggleButton: '#0a1427',
          textInput: '#ffe6d9',
          switchInput: '#ffd2bb',
          switchInputActiveTab: '#fff',
          switchInputInactiveTab: 'transparent',
          button: '#fff',
          closeButton: '#0a1427',
          pill: '#fff7f2',
          roundedImageFallback: '#ffe6d9',
          listItemQuickButtonSecondary: '#443d66',
          listItemQuickButtonPrimary: '#ff884d',
          statusIconSuccess: '#1ba23d',
          statusIconPending: '#ff6b35',
          statusIconFailed: '#ff0000',
          checkboxInputActive: '#ff884d',
          checkboxInputInactive: '#7f7a99',
          dropdownHoverColor: '#F8EFEA',
          selectInputExpandedHover: '#F8EFEA',
          toDropdownColor: '#F8EFEA',
          secondary: '#9889e4',
          selectInputRadioOn: '#ff7733',
          selectInputRadioOff: '#F8EFEA',
          walletButton: 'linear-gradient(to bottom, #fd9250, #ff5548)',
          walletChainDropdown: '#fff',
          walletChainButtonActive: '#ffeee6',
        },
        text: {
          main: '#fff',
          topBar: '#fff',
          topMenu: '#191726',
          cardTitle: '#191726',
          card: '#000',
          cardDisabled: '#ddd',
          innerLabel: '#6e6b6a',
          outerLabel: '#6e6b6a',
          selectInput: '#000',
          selectInputOption: '#191726',
          selectInputOptionSecondary: '#191726',
          selectInputImagePlaceholder: '#6e6b6a',
          textInput: '#000',
          textInputSecondary: '#6e6b6a',
          switchInputActiveTab: '#191726',
          switchInputInactiveTab: '#6e6b6a',
          button: '#191726',
          buttonSecondary: '#ffeee6',
          errorMessage: '#ff0000',
          searchInput: '#ff7733',
          searchInputSecondary: '#ff7733',
          pill: '#6e6b6a',
          pillValue: '#191726',
          roundedImageFallback: '#6e6b6a',
          listItemQuickButtonSecondary: '#fff',
          listItemQuickButtonPrimary: '#fff',
          transactionStatusLink: '#ff7733',
          pasteIcon: '#ff884d',
          walletDropdownIcon: '#221f33',
        },
      },
    };
  }, [useDashboardTheme]);
  return (
    <WagmiConfig client={client}>
      <GlobalStyle />
      <Wrapper>
        {!connectedProvider && (
          <SignIn
            onWeb3ProviderSet={async (web3Provider, isWagmi) => {
              if (!web3Provider) {
                setConnectedProvider(null);
                return;
              }

              const web3 = new Web3(web3Provider as any);
              // @ts-ignore
              setConnectedProvider(isWagmi ? web3.currentProvider.provider : web3.currentProvider);
            }}
            onWeb3AuthInstanceSet={setWeb3AuthInstance}
            setWagmiLogout={setWagmiLogout}
          />
        )}
        {connectedProvider && (
          <div>
            <ToggleThemeButton onClick={() => setUseDashboardTheme(!useDashboardTheme)}>Toggle theme</ToggleThemeButton>
            <Etherspot
              provider={connectedProvider}
              chainId={chainId}
              themeOverride={themeOverride}
              onLogout={async () => {
                if (wagmiLogout) wagmiLogout();
                if (!web3AuthInstance) return;

                try {
                  await web3AuthInstance.logout({ cleanup: true });
                  web3AuthInstance.clearCache();
                } catch (e) {
                  //
                }

                setConnectedProvider(null);
              }}
              showMenuLogout
            />
          </div>
        )}
      </Wrapper>
    </WagmiConfig>
  );
};

export default App;
