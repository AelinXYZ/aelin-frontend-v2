import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API, Wallet } from "bnc-onboard/dist/src/interfaces";
import Onboard from "bnc-onboard";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Subscriptions } from "bnc-onboard/dist/src/interfaces";

import isServer from "@/utils/isServer";
import { ChainId, chains, getNetworkConfig } from "@/constants/chains";
import { $enum } from "ts-enum-util";

const STORAGE_CONNECTED_WALLET = "onboard_selectedWallet";
// give onboard a window to update its internal state after certain actions
const ONBOARD_STATE_DELAY = 100;

export enum WalletType {
  MetaMask = "metamask",
  WalletConnect = "walletConnect",
}

// Instantiate WalletConnect
let onboard: API | null = null;
function initOnboard(appChainId: ChainId, subscriptions: Subscriptions) {
  if (isServer()) {
    return;
  }

  if (onboard !== null) {
    return;
  }

  window.onboard = Onboard({
    networkId: appChainId,
    networkName: getNetworkConfig(appChainId).name,
    hideBranding: true,
    darkMode: true,
    walletSelect: {
      wallets: [
        {
          walletName: WalletType.MetaMask,
          preferred: true,
        },
        {
          walletName: WalletType.WalletConnect,
          preferred: true,
          rpc: Object.values(chains).reduce(
            (rpc, val) => ({
              ...rpc,
              [val.chainId]: val.rpcUrl,
            }),
            {}
          ),
        },
      ],
    },
    subscriptions: subscriptions,
    walletCheck: [
      { checkName: "derivationPath" },
      { checkName: "accounts" },
      { checkName: "connect" },
    ],
  });

  onboard = window.onboard;
}

export type Web3Context = {
  isAppConnected: boolean;
  isWalletConnected: boolean;
  isWalletNetworkSupported: boolean;
  appChainId: ChainId;
  wallet: Wallet | null;
  walletChainId: number | null;
  address: string | null;
  readOnlyAppProvider: JsonRpcProvider;
  web3Provider: Web3Provider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  pushNetwork: () => Promise<void>;
  setAppChainId: Dispatch<SetStateAction<ChainId>>;
};

const Web3ContextConnection = createContext<Web3Context | undefined>(undefined);

type Props = {
  fallback?: ReactElement;
  children: ReactNode;
};

const INITAL_APP_CHAIN_ID = ChainId.Mainnet;

export default function Web3ConnectionProvider({
  children,
  fallback = <div>Loading...</div>,
}: Props) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [address, setAddress] = useState<string | null>(null);
  const [walletNetwork, setWalletNetwork] = useState<number | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [appChainId, setAppChainId] = useState<ChainId>(INITAL_APP_CHAIN_ID);
  const supportedChainIds = $enum(ChainId).getValues();

  const web3Provider =
    wallet?.provider != null ? new Web3Provider(wallet.provider) : null;

  const isWalletConnected = web3Provider != null;

  const isAppConnected =
    walletNetwork === appChainId && address !== null && web3Provider !== null;

  const isWalletNetworkSupported = supportedChainIds.includes(
    walletNetwork as any
  );

  const readOnlyAppProvider = useMemo(
    () => new JsonRpcProvider(getNetworkConfig(appChainId).rpcUrl, appChainId),
    [appChainId]
  );

  // Instantiate Onboard
  useEffect(() => {
    initOnboard(INITAL_APP_CHAIN_ID, {
      network: (network: number) => {
        setWalletNetwork(network || null);
      },
      address: (address: string | undefined) => {
        setAddress(address || null);
      },
      wallet: (wallet: Wallet) => {
        if (wallet.name === undefined) {
          setWallet(null);
        } else {
          window.localStorage.setItem(
            STORAGE_CONNECTED_WALLET,
            wallet.name || ""
          );
          setWallet(wallet || null);
        }
      },
    });
  }, []);

  // recover previous connection
  useEffect(() => {
    setTimeout(async () => {
      await _reconnectWallet();
      setIsInitializing(false);
    }, ONBOARD_STATE_DELAY);
  }, []);

  const disconnectWallet = () => {
    if (!onboard) {
      console.warn("Unable to connect, onboard is not defined");
      return;
    }
    onboard.walletReset();
    window.localStorage.removeItem(STORAGE_CONNECTED_WALLET);
  };

  const _reconnectWallet = async (): Promise<void> => {
    if (!onboard) {
      console.warn("Unable to connect, onboard is not defined");
      return;
    }

    const previouslySelectedWallet = window.localStorage.getItem(
      STORAGE_CONNECTED_WALLET
    );

    if (previouslySelectedWallet) {
      const success = await onboard.walletSelect(previouslySelectedWallet);
      if (success) {
        await onboard.walletCheck();
      }
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (!onboard) {
      console.warn("Unable to connect, onboard is not defined");
      return;
    }
    const success = await onboard.walletSelect();
    setIsInitializing(true);
    if (success) {
      await onboard.walletCheck();
    }
    setIsInitializing(false);
  };

  const pushNetwork = async (): Promise<void> => {
    if (!onboard || !wallet || wallet.name !== "MetaMask") {
      console.warn("Unable to push network");
      return;
    }

    const provider = wallet.provider;
    const networkConfig = getNetworkConfig(appChainId);

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkConfig.chainIdHex }],
      });
    } catch (switchError) {
      const config = {
        chainId: networkConfig.chainIdHex,
        chainName: networkConfig.name,
        rpcUrls: [networkConfig.rpcUrl],
        blockExplorerUrls: networkConfig.blockExplorerUrls,
        iconUrls: networkConfig.iconUrls,
      };

      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [config],
        });
      } else {
        throw switchError;
      }
    }
  };

  const value = {
    // true when wallet is connected to same network as the dapp
    isAppConnected,
    isWalletConnected,
    isWalletNetworkSupported,
    appChainId,
    wallet,
    walletChainId: walletNetwork,
    address,
    readOnlyAppProvider,
    web3Provider,
    connectWallet,
    disconnectWallet,
    pushNetwork,
    setAppChainId: setAppChainId,
  };

  if (isInitializing) {
    return fallback;
  }

  return (
    <Web3ContextConnection.Provider value={value}>
      {children}
    </Web3ContextConnection.Provider>
  );
}

export function useWeb3Connection() {
  const context = useContext(Web3ContextConnection);
  if (context === undefined) {
    throw new Error(
      "useWeb3Connection must be used within a Web3ConnectionProvider"
    );
  }
  return context;
}
