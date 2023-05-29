import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, WALLET_ADAPTER_TYPE, WALLET_ADAPTERS } from '@web3auth/base';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { BsGithub, BsTwitter } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';
import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter';
import { useConnect, useAccount } from 'wagmi';

import iconMetamask from '../assets/images/icon-metamask.png';
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
  border: solid 1px #3d366d;
  background-image: linear-gradient(166deg, #3e3869 9%, #241938 97%);
  font-family: 'PTRootUIWebRegular', sans-serif;
  color: #fff;
  text-align: center;
  user-select: none;
`;

const WrapperTitle = styled.h1`
  color: #cab3f5;
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
  background-color: rgba(71, 64, 120, 0.4);
  margin-bottom: 13px;
`;

const LoadingBar = styled.div`
  height: 6px;
  border-radius: 3px;
  width: 214px;
  background: #734fb3;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  text-decoration: underline;
`;

const WrapperTextClickable = styled(WrapperText)`
  cursor: pointer;
  color: #fbae49;

  &:hover {
    opacity: 0.7;
  }
`;

const SwitchWrapper = styled.div`
  padding: 2px;
  border-radius: 8px;
  background: #241938;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const SwitchOption = styled.div<{ isActive?: boolean }>`
  font-size: 14px;
  width: 50%;
  text-align: center;
  min-height: 28px;
  line-height: 28px;
  cursor: pointer;
  color: #9466e6;

  ${({ isActive }) =>
    isActive &&
    `
    color: #fff;
    font-weight: bold;
    border-radius: 8px;
    box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(to bottom, #3d265c, #222130);
    border-image-slice: 1;
    background-image: linear-gradient(to bottom, #734fb3, #422d66), linear-gradient(to bottom, #3d265c, #222130);
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
  width: ${({ half }) => (half ? 'calc(50% - 7px)' : '100%')};
`;

const SignInOptionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  img {
    height: 24px;
  }
`;

const SignInOption = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'PTRootUIWebMedium', sans-serif;
  color: #fff;
  font-size: 16px;
  padding: 28px 34px;
  border-radius: 24px;
  border: solid 1.5px #49437d;
  background-color: rgba(71, 64, 120, 0.4);
  margin-bottom: 14px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const EmailInput = styled.input`
  margin-bottom: 30px;
  padding: 16px 13px;
  border-radius: 12px;
  border: solid 1.5px #49437d;
  font-family: 'PTRootUIWebMedium', sans-serif;
  font-size: 16px;
  color: #fff;
  background-color: #241938;
  width: calc(100% - 34px);

  &::placeholder {
    color: #8a5fd7;
  }

  &:focus {
    outline: #fff solid 1px;
  }
`;

const EmailSubmitButton = styled.button`
  cursor: pointer;
  margin-bottom: 14px;
  padding: 17px;
  border-radius: 16px;
  box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
  border: none;
  background-image: linear-gradient(to bottom, #fdb754, #f18214);
  font-family: 'PTRootUIWebRegular', sans-serif;
  text-align: center;
  color: #fff;
  font-size: 20px;
  width: 100%;
  &:disabled {
    opacity: 0.2;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const web3AuthClientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID as string;

type LOGIN_PROVIDER_TYPE =
  | 'google'
  | 'facebook'
  | 'apple'
  | 'discord'
  | 'twitch'
  | 'github'
  | 'twitter'
  | 'email_passwordless';

interface SignInProps {
  onWeb3ProviderSet: (web3Provider: any) => void;
  onWeb3AuthInstanceSet: (instance: Web3AuthNoModal) => void;
}

const iconById: Record<string, JSX.Element> = {
  metaMask: <img src={iconMetamask} alt="metamask" />,
  walletConnect: <img src={iconWalletConnect} alt="walletconnect" />,
  coinbaseWallet: <img src={iconCoinbase} alt="coinbase" />,
};

const SignIn = ({ onWeb3ProviderSet, onWeb3AuthInstanceSet }: SignInProps) => {
  const [showSocialLogins, setShowSocialLogins] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [web3Auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEmailLogin, setShowEmailLogin] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const initWeb3AuthCore = async () => {
      if (!!localStorage.getItem('Web3Auth-cachedAdapter')) setIsSigningIn(true);

      const web3AuthInstance = new Web3AuthNoModal({
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
        },
      });

      web3AuthInstance.configureAdapter(openLoginAdapter);

      const torusWalletAdapter = new TorusWalletAdapter({ clientId: web3AuthClientId });
      web3AuthInstance.configureAdapter(torusWalletAdapter);

      web3AuthInstance.on(ADAPTER_EVENTS.CONNECTED, () => {
        if (!web3AuthInstance?.provider) return;
        onWeb3ProviderSet(web3AuthInstance.provider);
        setIsSigningIn(false);
      });

      web3AuthInstance.on(ADAPTER_EVENTS.ERRORED, () => {
        setIsSigningIn(false);
      });

      await web3AuthInstance.init();
      setIsSigningIn(false);

      setWeb3Auth(web3AuthInstance);

      if (onWeb3AuthInstanceSet) onWeb3AuthInstanceSet(web3AuthInstance);
    };

    initWeb3AuthCore();
    /* eslint-disable-next-line */
  }, []);

  const { connector, isConnected } = useAccount();

  useEffect(() => {
    const update = async () => {
      if (!connector?.ready || !isConnected) return;
      const wagmiWeb3Provider = await connector.getProvider();
      onWeb3ProviderSet(wagmiWeb3Provider);
    }
    update();
  }, [
    connector,
    isConnected,
    onWeb3ProviderSet,
  ]);

  const { connect, connectors } = useConnect();

  const loginWithAdapter = useCallback(
    async (adapter: WALLET_ADAPTER_TYPE, loginProvider?: LOGIN_PROVIDER_TYPE, login_hint?: string) => {
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
        setErrorMessage(`Failed to login! Reason: ${e instanceof Error && e?.message ? e.message : 'unknown'}.`);
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
    async (loginProvider: LOGIN_PROVIDER_TYPE, login_hint?: string) =>
      loginWithAdapter(WALLET_ADAPTERS.OPENLOGIN, loginProvider, login_hint),
    [loginWithAdapter]
  );

  useEffect(() => {
    setErrorMessage(null);
  }, [showSocialLogins, showMoreOptions]);

  const visibleSignInOptions = useMemo(() => {
    const signInOptions = {
      social: [
        { title: 'Google', icon: <img src={iconGoogle} alt="google" />, onClick: () => loginWithOpenLogin('google') },
        { title: 'Apple', icon: <img src={iconApple} alt="apple" />, onClick: () => loginWithOpenLogin('apple') },
        {
          title: 'Facebook',
          icon: <img src={iconFacebook} alt="facebook" />,
          onClick: () => loginWithOpenLogin('facebook'),
        },
        {
          title: 'Discord',
          icon: <img src={iconDiscord} alt="discord" />,
          onClick: () => loginWithOpenLogin('discord'),
        },
        {
          title: 'Twitter',
          icon: <BsTwitter size={24} color="#00ACEE" />,
          onClick: () => loginWithOpenLogin('twitter'),
        },
        { title: 'Email', icon: <AiOutlineMail size={24} color="#fff" />, onClick: () => setShowEmailLogin(true) },
        { title: 'GitHub', icon: <BsGithub size={24} color="#000" />, onClick: () => loginWithOpenLogin('github') },
        { title: 'Twitch', icon: <img src={iconTwitch} alt="twitch" />, onClick: () => loginWithOpenLogin('twitch') },
      ],
      web3: [
        ...connectors.map((connector) => ({
          title: connector.name,
          icon: iconById[connector.id],
          onClick: () => connect({ connector }),
        })),
      ],
    };

    const selectedSignInOptions = showSocialLogins ? signInOptions.social : signInOptions.web3;
    if (showMoreOptions) return selectedSignInOptions;

    const visibleNumber = showSocialLogins ? 6 : 3;

    return selectedSignInOptions.slice(0, visibleNumber);
  }, [showSocialLogins, showMoreOptions, loginWithOpenLogin, connectors, connect]);

  if (isSigningIn) {
    return (
      <Wrapper>
        <WrapperTitle>Signing in</WrapperTitle>
        <LoadingBarWrapper>
          <LoadingBar />
        </LoadingBarWrapper>
        <WrapperText textAlign="left">⏱ This may take a minute or so please don’t close this window.</WrapperText>
      </Wrapper>
    );
  }

  if (!web3Auth) {
    return (
      <Wrapper>
        <WrapperTitle>Loading</WrapperTitle>
        <LoadingBarWrapper>
          <LoadingBar />
        </LoadingBarWrapper>
      </Wrapper>
    );
  }

  if (showEmailLogin) {
    return (
      <Wrapper>
        <WrapperTitle>Sign in with Email</WrapperTitle>
        <EmailInput placeholder="Enter you email" onChange={(e) => setEmail(e?.target?.value ?? '')} />
        {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <EmailSubmitButton
          onClick={() => loginWithOpenLogin('email_passwordless', email ?? undefined)}
          disabled={!email}
        >
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
    );
  }

  return (
    <Wrapper>
      <WrapperTitle>Sign in</WrapperTitle>
      <>
        <SwitchWrapper>
          <SwitchOption isActive={showSocialLogins} onClick={() => setShowSocialLogins(true)}>
            Social
          </SwitchOption>
          <SwitchOption isActive={!showSocialLogins} onClick={() => setShowSocialLogins(false)}>
            Web3
          </SwitchOption>
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
  );
};

export default SignIn;
