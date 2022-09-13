import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Etherspot, TRANSACTION_BLOCK_TYPE } from '@etherspot/react-transaction-buidler';
import { ethers } from 'ethers';
import Onboard from 'bnc-onboard';
import styled from 'styled-components';

const wallets = [
  { walletName: "metamask", preferred: true },
  {
    walletName: "walletConnect",
    preferred: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
    }
  },
];

const chainId = 1;

const WalletService = () => Onboard({
  walletSelect: { wallets },
  networkId: chainId,
});

const Paragraph = styled.p`
  font-size: 14px;
  margin-bottom: 40px;
  font-family: "Arial", sans;
`;

const ConnectWalletButton = styled.span`
  padding: 10px;
  border: 1px solid #000;
  text-transform: uppercase;
  font-size: 12px;
  margin-right: 20px;
  font-family: "Arial", sans;
  cursor: pointer;

  &:hover {
    opacity: 0.4;
  }
`;
const ToggleThemeButton = styled.span`
  padding: 10px;
  display: inline-block;
  border: 1px solid #000;
  text-transform: uppercase;
  font-size: 12px;
  margin-right: 20px;
  font-family: "Arial", sans;
  cursor: pointer;
  margin-bottom: 15px;

  &:hover {
    opacity: 0.4;
  }
`;

const App = () => {
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [useDashboardTheme, setUseDashboardTheme] = useState(false);

  const walletService = useMemo(() => WalletService(), []);

  const connectWithExternal = useCallback(async () => {
    await walletService.walletSelect().catch(() => null);
    await walletService.walletCheck().catch(() => null);
    setConnectedProvider(walletService.getState().wallet.provider);
  }, [walletService]);

  const connectWithKeyBased = useCallback(() => {
    const wallet = ethers.Wallet.createRandom();
    // @ts-ignore
    setConnectedProvider(wallet);
  }, []);

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
            main: '#998ae6',
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
      {!connectedProvider && (
        <>
          <Paragraph>Connect part showcases how any dapp maintained web3 connector can interact with Etherspot transaction builder component directly</Paragraph>
          <ConnectWalletButton onClick={connectWithExternal}>Connect with external wallet</ConnectWalletButton>
          <ConnectWalletButton onClick={connectWithKeyBased}>Connect with random Key Based</ConnectWalletButton>
        </>
      )}
      {connectedProvider && (
        <div>
          <ToggleThemeButton onClick={() => setUseDashboardTheme(!useDashboardTheme)}>Toggle theme</ToggleThemeButton>
          <Etherspot
            defaultTransactionBlocks={[{ type: TRANSACTION_BLOCK_TYPE.SEND_ASSET }]}
            provider={connectedProvider}
            chainId={chainId}
            themeOverride={themeOverride}
          />
        </div>
      )}
    </>
  );
}

export default App;
