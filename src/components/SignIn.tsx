import styled from 'styled-components';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTER_TYPE,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { Web3AuthCore } from '@web3auth/core';
import { NetworkSwitch } from '@web3auth/ui';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { BsGithub, BsTwitter } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter';
import { WalletConnectV1Adapter } from '@web3auth/wallet-connect-v1-adapter';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { CoinbaseAdapter } from '@web3auth/coinbase-adapter';

import iconMetamask from '../assets/images/icon-metamask.png';
import iconTorus from '../assets/images/icon-torus.png';
import iconWalletConnect from '../assets/images/icon-walletconnect.png';
import iconGoogle from '../assets/images/icon-google.png';
import iconApple from '../assets/images/icon-apple.png';
import iconFacebook from '../assets/images/icon-facebook.png';
import iconDiscord from '../assets/images/icon-discord.png';
import iconTwitch from '../assets/images/icon-twitch.png';
import iconCoinbase from '../assets/images/icon-coinbase.png';

const Wrapper = styled.div`
  width: 374px;
  max-width: 100%;
  padding: 14px 20px 26px;
  border-radius: 24px;
  border: solid 1px #f53f40;
  background-image: linear-gradient(166deg, #ff8932 9%, #f44c3c 97%);
  font-family: "PTRootUIWebRegular", sans-serif;
  color: #fff;
  text-align: center;
	user-select: none;
`;

const WrapperTitle = styled.h1`
  color: #ffeee6;
  font-size: 20px;
  margin-bottom: 30px;
`;

const WrapperText = styled.p<{ textAlign?: string }>`
  font-size: 14px;
  text-align: ${({ textAlign }) => textAlign ?? 'center'};
`;

const LoadingBarWrapper = styled.div`
  height: 6px;
  padding: 2px 118px 2px 2px;
  border-radius: 5px;
  background-color: #ea3b1a;
  margin-bottom: 13px;
`;

const LoadingBar = styled.div`
  height: 6px;
  border-radius: 3px;
  border-radius: 3px;
  width: 214px;
  background:
    linear-gradient(267deg, rgba(255, 190, 0, 0.92) 107%, rgba(255, 94, 13, 0.5) 0%),
    linear-gradient(to bottom, #ffbfab, #f43f40);
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  text-decoration: underline;
`;

const WrapperTextClickable = styled(WrapperText)`
  cursor: pointer;
  
  &:hover {
    opacity: 0.7;
  }
`;


const SwitchWrapper = styled.div`
  padding: 2px;
  border-radius: 8px;
  background: #fb9267;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const SwitchOption = styled.div<{ isActive?: boolean }>`
  font-size: 14px;
  color: #fff;
  width: 50%;
  text-align: center;
  min-height: 28px;
  line-height: 28px;
  cursor: pointer;

  ${({ isActive }) => isActive && `
    font-weight: bold;
    border-radius: 8px;
    box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
    border: solid 1px #f43f40;
    background: linear-gradient(to bottom, #f76b3f, #f43f40);
  `}
`;

const SignInOptionsWrapper = styled.div`
  margin-bottom: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SignInOptionWrapper = styled.div<{ half?: boolean }>`
  width: ${({ half }) => half ? 'calc(50% - 7px)' : '100%'};
`;

const SignInOptionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  img { height: 24px; }
`;

const SignInOption = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "PTRootUIWebMedium", sans-serif;
  color: #fff;
  font-size: 16px;
  padding: 28px 34px;
  border-radius: 24px;
  border: solid 1.5px #ff966b;
  background-color: rgba(255, 255, 255, 0.25);
  margin-bottom: 14px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

const EmailInput = styled.input`
  margin-bottom: 14px;
  padding: 13px;
  border-radius: 12px;
  border: solid 1.5px #ffa682;
  margin-bottom: 14px;
  font-family: "PTRootUIWebMedium", sans-serif;
  font-size: 16px;
  color: #fff;
  background: transparent;
  width: calc(100% - 34px);

  &::placeholder {
    color: #ffac82;
  }

  &:focus {
    outline: #fff solid 1px;
  }
`;

const EmailSubmitButton = styled.div`
  cursor: pointer;
  margin-bottom: 14px;
  padding: 17px;
  border-radius: 16px;
  box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
  border: solid 1px #f43f40;
  background-image: linear-gradient(to bottom, #fffbf5, rgba(255, 205, 197, 0.5));
  font-family: "PTRootUIWebRegular", sans-serif;
  text-align: center;
  color: #ff4900;
  font-size: 16px;

  &:hover {
    opacity: 0.7;
  }
`;


const web3AuthClientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID as string;

type LOGIN_PROVIDER_TYPE = 'google' | 'facebook' | 'apple' | 'discord' | 'twitch' | 'github' | 'twitter' | 'email_passwordless'

interface SignInProps {
  onWeb3ProviderSet: (web3Provider: any) => void;
  onWeb3AuthInstanceSet: (instance: Web3AuthCore) => void;
}

const SignIn = ({ onWeb3ProviderSet, onWeb3AuthInstanceSet }: SignInProps) => {
  const [showSocialLogins, setShowSocialLogins] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [web3Auth, setWeb3Auth] = useState<Web3AuthCore | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEmailLogin, setShowEmailLogin] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const initWeb3AuthCore = async () => {
      if (!!localStorage.getItem('Web3Auth-cachedAdapter')) setIsSigningIn(true);

      const web3AuthInstance = new Web3AuthCore({
        clientId: web3AuthClientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: process.env.REACT_APP_CHAIN_ID_HEX,
          rpcTarget: `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
        },
        storageKey: 'local',
      });

      const openLoginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: 'mainnet',
          clientId: web3AuthClientId,
        },
        loginSettings: {
          mfaLevel: 'none',
        }
      });

      web3AuthInstance.configureAdapter(openLoginAdapter);

      const metamaskAdapter = new MetamaskAdapter({ clientId: web3AuthClientId });
      web3AuthInstance.configureAdapter(metamaskAdapter);

      const torusWalletAdapter = new TorusWalletAdapter({ clientId: web3AuthClientId });
      web3AuthInstance.configureAdapter(torusWalletAdapter);

      const networkUi = new NetworkSwitch()
      const walletConnectV1Adapter = new WalletConnectV1Adapter({
        adapterSettings: {
          bridge: 'https://bridge.walletconnect.org',
          qrcodeModal: QRCodeModal,
          networkSwitchModal: networkUi
        },
        clientId: web3AuthClientId
      })
      web3AuthInstance.configureAdapter(walletConnectV1Adapter);

      const coinbaseAdapter = new CoinbaseAdapter({ clientId: web3AuthClientId });
      web3AuthInstance.configureAdapter(coinbaseAdapter);

      web3AuthInstance.on(ADAPTER_EVENTS.CONNECTED, () => {
        if (!web3AuthInstance?.provider) return;
        onWeb3ProviderSet(web3AuthInstance.provider);
        setIsSigningIn(false);
      });

      web3AuthInstance.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        onWeb3ProviderSet(null);
        setIsSigningIn(false);
      });

      web3AuthInstance.on(ADAPTER_EVENTS.ERRORED, () => {
        setIsSigningIn(false);
      });

      await web3AuthInstance.init();
      setIsSigningIn(false);

      setWeb3Auth(web3AuthInstance);

      if (onWeb3AuthInstanceSet) onWeb3AuthInstanceSet(web3AuthInstance);
    }

    initWeb3AuthCore();
    /* eslint-disable-next-line */
  }, []);

  const loginWithAdapter = useCallback(async (
    adapter: WALLET_ADAPTER_TYPE,
    loginProvider?: LOGIN_PROVIDER_TYPE,
    login_hint?: string,
  ) => {
    setErrorMessage(null);
    setIsSigningIn(true);

    if (!web3Auth) {
      setIsSigningIn(false);
      return;
    }

    let web3authProvider;
    try {
      web3authProvider = await web3Auth.connectTo(adapter, { loginProvider, login_hint });
    } catch (e) {
      setErrorMessage(`Failed to login! Reason: ${e instanceof Error && e?.message ? e.message :  'unknown'}.`);
      setIsSigningIn(false);
      return;
    }

    if (!web3authProvider) {
      setErrorMessage('Failed to get connected provider!');
      setIsSigningIn(false);
      return;
    }

    onWeb3ProviderSet(web3authProvider);
    setEmail('');
    setShowEmailLogin(false);
    setIsSigningIn(false);
  }, [web3Auth, onWeb3ProviderSet]);

  const loginWithOpenLogin = useCallback(
    async (
      loginProvider: LOGIN_PROVIDER_TYPE,
      login_hint?: string,
    ) => loginWithAdapter(WALLET_ADAPTERS.OPENLOGIN, loginProvider, login_hint),
    [loginWithAdapter],
  );

  useEffect(() => { setErrorMessage(null); }, [showSocialLogins, showMoreOptions]);

  const visibleSignInOptions = useMemo(() => {
    const signInOptions = {
      social: [
        { title: 'Google', icon: <img src={iconGoogle} alt="google" />, onClick: () => loginWithOpenLogin('google') },
        { title: 'Apple', icon: <img src={iconApple} alt="apple" />, onClick: () => loginWithOpenLogin('apple') },
        { title: 'Facebook', icon: <img src={iconFacebook} alt="facebook" />, onClick: () => loginWithOpenLogin('facebook') },
        { title: 'Discord', icon: <img src={iconDiscord} alt="discord" />, onClick: () => loginWithOpenLogin('discord') },
        { title: 'Twitter', icon: <BsTwitter size={24} color="#00ACEE" />, onClick: () => loginWithOpenLogin('twitter') },
        { title: 'Email', icon: <AiOutlineMail size={24} color="#fff" />, onClick: () => setShowEmailLogin(true) },
        { title: 'GitHub', icon: <BsGithub size={24} color="#000" />, onClick: () => loginWithOpenLogin('github') },
        { title: 'Twitch', icon: <img src={iconTwitch} alt="twitch" />, onClick: () => loginWithOpenLogin('twitch') },
      ],
      web3: [
        { title: 'MetaMask', icon: <img src={iconMetamask} alt="metamask" />, onClick: () => loginWithAdapter(WALLET_ADAPTERS.METAMASK) },
        { title: 'WalletConnect', icon: <img src={iconWalletConnect} alt="walletconnect" />, onClick: () => loginWithAdapter(WALLET_ADAPTERS.WALLET_CONNECT_V1) },
        { title: 'Torus EVM', icon: <img src={iconTorus} alt="torus" />, onClick: () => loginWithAdapter(WALLET_ADAPTERS.TORUS_EVM) },
        { title: 'Coinbase', icon: <img src={iconCoinbase} alt="coinbase" />, onClick: () => loginWithAdapter(WALLET_ADAPTERS.COINBASE) },
      ]
    };

    const selectedSignInOptions = showSocialLogins ? signInOptions.social : signInOptions.web3;
    if (showMoreOptions) return selectedSignInOptions;

    const visibleNumber = showSocialLogins ? 6 : 3;

    return selectedSignInOptions.slice(0, visibleNumber);
  }, [showSocialLogins, showMoreOptions, loginWithAdapter, loginWithOpenLogin]);

  if (isSigningIn) {
    return (
      <Wrapper>
        <WrapperTitle>Signing in</WrapperTitle>
        <LoadingBarWrapper>
          <LoadingBar />
        </LoadingBarWrapper>
        <WrapperText textAlign="left">
          ⏱ This may take a minute or so please don’t close this window.
        </WrapperText>
      </Wrapper>
    )
  }

  if (!web3Auth) {
    return (
      <Wrapper>
        <WrapperTitle>Loading</WrapperTitle>
        <LoadingBarWrapper>
          <LoadingBar />
        </LoadingBarWrapper>
      </Wrapper>
    )
  }

  if (showEmailLogin) {
    return (
      <Wrapper>
        <WrapperTitle>Sign in with Email</WrapperTitle>
        <EmailInput
          placeholder="Enter you email"
          onChange={(e) => setEmail(e?.target?.value ?? '')}
        />
        {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <EmailSubmitButton onClick={() => loginWithOpenLogin('email_passwordless', email ?? undefined)}>
          Sign in
        </EmailSubmitButton>
        <WrapperTextClickable
          onClick={() => {
            setShowEmailLogin(false);
            setEmail('');
            setErrorMessage(null);
          }}
        >
          Go back
        </WrapperTextClickable>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <WrapperTitle>Sign in</WrapperTitle>
      <>
        <SwitchWrapper>
          <SwitchOption isActive={showSocialLogins} onClick={() => setShowSocialLogins(true)}>Social</SwitchOption>
          <SwitchOption isActive={!showSocialLogins} onClick={() => setShowSocialLogins(false)}>Web3</SwitchOption>
        </SwitchWrapper>
        <SignInOptionsWrapper>
          {visibleSignInOptions.map((signInOption) => (
            <SignInOptionWrapper
              key={signInOption.title}
              onClick={isSigningIn ? undefined : signInOption.onClick}
              half={showSocialLogins}
            >
              <SignInOption disabled={isSigningIn}>
                <SignInOptionIcon>{signInOption.icon}</SignInOptionIcon>
                <span>{signInOption.title}</span>
              </SignInOption>
            </SignInOptionWrapper>
          ))}
        </SignInOptionsWrapper>
        {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <WrapperTextClickable onClick={() => setShowMoreOptions(!showMoreOptions)}>
          Show {showMoreOptions ? 'less' : 'more'} options
        </WrapperTextClickable>
      </>
    </Wrapper>
  )
}

export default SignIn;
