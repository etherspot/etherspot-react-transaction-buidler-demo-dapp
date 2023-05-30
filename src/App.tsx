import React, { useMemo, useState } from 'react';
import { Etherspot } from '@etherspot/react-transaction-buidler';
import styled, { createGlobalStyle } from 'styled-components';
import Web3 from 'web3';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { useAccount, useDisconnect } from 'wagmi';

import SignIn from './components/SignIn';

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
  const [web3AuthInstance, setWeb3AuthInstance] = useState<Web3AuthNoModal | null>(null);
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { connector, isConnected } = useAccount();

  const themeOverride = useMemo(() => {
    if (!useDashboardTheme) return undefined;
    return {
      color: {
        background: {
          main: 'linear-gradient(to right, #f43b40, #f8793f)',
          card: '#fff7f2',
          tokenBalanceContainer: '#21002e',
          horizontalLine: 'linear-gradient(90deg, #23a9c9, #cd34a2)',
          topMenu: '#fff',
          topMenuWallet: 'rgba(255, 247, 242, 0.24)',
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
          deployButton: '#ff884d',
          blockParagraphBorder: 'linear-gradient(#346ecd, #cd34a2)',
          settingMenuMain: 'linear-gradient(rgb(253, 146, 80), rgb(255, 85, 72))',
          settingsModalBorder: '#d9d9d940',
          settingsModal: '#fff',
          settingsIcon: '#fd9250',
          loadingAnimationBackground: '#FCEADF',
          loadingAnimationForeground: '#FBF7F5',
        },
        text: {
          main: '#fff',
          topBar: '#fff',
          topMenu: '#191726',
          topMenuWallet: '#fff',
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
          settingsModalSubHeader: '#6e6b6a',
          settingsMenuItem: '#191726',
          settingsMenuItemHover: '#ee6723',
        },
      },
    };
  }, [useDashboardTheme]);
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        {!connectedProvider && (
          <SignIn
            onWeb3ProviderSet={async (web3Provider) => {
              if (!web3Provider) {
                setConnectedProvider(null);
                return;
              }

              const web3 = new Web3(web3Provider as any);

              // @ts-ignore
              setConnectedProvider(web3.currentProvider);
            }}
            onWeb3AuthInstanceSet={setWeb3AuthInstance}
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
                try {
                  if (isConnected) wagmiDisconnect();
                  if (connector) await connector.disconnect();
                } catch (e) {
                  //
                }

                try {
                  if (web3AuthInstance) {
                    await web3AuthInstance.logout({ cleanup: true });
                    web3AuthInstance.clearCache();
                  }
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
    </>
  );
};

export default App;
