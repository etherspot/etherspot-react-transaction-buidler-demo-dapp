import React, {
  useMemo,
  useState,
} from 'react';
import { Etherspot, TRANSACTION_BLOCK_TYPE } from '@etherspot/react-transaction-buidler';
import styled, { createGlobalStyle } from 'styled-components';
import Web3 from 'web3';
import { Web3AuthCore } from '@web3auth/core';

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
  font-family: "Arial", sans;
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

  const themeOverride = useMemo(() => {
    if (!useDashboardTheme) return undefined;
    return {
        color: {
          background: {
            main: '#221f33',
            topMenu: '#443d66',
            topMenuButton: '#ff884d',
            card: '#2b2640',
            button: '#ff884d',
            closeButton: '#ff884d',
            selectInputToggleButton: '#ff884d',
            selectInput: '#443d66',
            selectInputExpanded: '#1a1726',
            selectInputImagePlaceholder: '#443d66',
            textInput: '#1a1726',
            switchInput: '#1a1726',
            switchInputActiveTab: '#443d66',
            switchInputInactiveTab: 'transparent',
            pill: '#2b2640',
            checkboxInputInactive: '#665c99',
            dropdownHoverColor: "#443d66",
            selectInputExpandedHover: "#443d66",
          },
          text: {
            selectInput: '#ffeee6',
            selectInputOption: '#ffeee6',
            selectInputOptionSecondary: '#ffeee6',
            searchInput: '#998ae6',
            searchInputSecondary: '#998ae6',
            outerLabel: '#998ae6',
            innerLabel: '#998ae6',
            topMenu: '#998ae6',
            main: '#ffeee6',
            topBar: '#998ae6',
            buttonSecondary: '#998ae6',
            card: '#ffeee6',
            cardTitle: '#ffeee6',
            button: '#fff',
            errorMessage: '#ff4d6a',
            textInput: '#ffeee6',
            textInputSecondary: '#ffeee6',
            switchInputActiveTab: '#ffeee6',
            switchInputInactiveTab: '#bbb8cc',
            selectInputImagePlaceholder: '#ffeee6',
            cardDisabled: '#605e5e',
            pill: '#bbb8cc',
            pillValue: '#ffeee6',
          }
        }
      }
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
              setConnectedProvider(web3.currentProvider)
            }}
            onWeb3AuthInstanceSet={setWeb3AuthInstance}
          />
        )}
        {connectedProvider && (
          <div>
            <ToggleThemeButton onClick={() => setUseDashboardTheme(!useDashboardTheme)}>Toggle theme</ToggleThemeButton>
            <Etherspot
              defaultTransactionBlocks={[{ type: TRANSACTION_BLOCK_TYPE.ASSET_BRIDGE }]}
              provider={connectedProvider}
              chainId={chainId}
              themeOverride={themeOverride}
              onLogout={async () => {
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
    </>
  );
}

export default App;
