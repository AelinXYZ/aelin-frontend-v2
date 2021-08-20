import {
  createContext,
  Dispatch,
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
import coerce from "@/utils/coerce";
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
  walletChainId: number | null;
  address: string | null;
  rpcProvider: JsonRpcProvider;
  web3Provider: Web3Provider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  pushNetwork: () => Promise<void>;
  setAppChainId: Dispatch<SetStateAction<ChainId>>;
};

const Web3ContextConnection = createContext<Web3Context | undefined>(undefined);

type Props = {
  children: ReactNode;
  initalAppChainId: ChainId;
};

export default function Web3ConnectionProvider({
  initalAppChainId,
  children,
}: Props) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletNetwork, setWalletNetwork] = useState<number | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [appChainId, setAppChainId] = useState<ChainId>(initalAppChainId);
  const supportedChainIds = $enum(ChainId).getValues();

  // check if chain id is in list of supported ids
  const isWalletNetworkSupported = supportedChainIds.includes(
    walletNetwork as any
  );

  // if no web3 connection with valid address on valid chain id, wallet is not connected
  const web3Provider = useMemo(
    () => (wallet?.provider != null ? new Web3Provider(wallet.provider) : null),
    [wallet?.provider]
  );

  const isWalletConnected =
    onboard?.getState().address != null && web3Provider != null;

  // if no web3 connection with valid address on valid chain id, wallet is not connected
  const isAppConnected = walletNetwork === appChainId;

  const connectedChainId =
    isAppConnected && isWalletNetworkSupported
      ? coerce(ChainId, walletNetwork)
      : null;
  const _chainId = connectedChainId ?? appChainId;

  // connect rpc provider to "selected" network
  const rpcProvider = useMemo(
    () => new JsonRpcProvider(getNetworkConfig(_chainId).rpcUrl, _chainId),
    [_chainId]
  );

  // Instantiate Onboard
  useEffect(() => {
    initOnboard(appChainId, {
      network: (network: number) => {
        setWalletNetwork(network);
      },
      address: (address: string) => {
        setAddress(address);
      },
      wallet: (wallet: Wallet) => {
        setWallet(wallet);
      },
    });
  }, [appChainId]);

  // recover previous connection
  useEffect(() => {
    setTimeout(() => {
      _reconnectWallet();
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
    const previouslySelectedWallet = coerce(
      WalletType,
      window.localStorage.getItem(STORAGE_CONNECTED_WALLET)
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
    if (success) {
      await onboard.walletCheck();
    }
  };

  const pushNetwork = async (): Promise<void> => {
    debugger
    if (!onboard || !wallet || wallet.name !== 'MetaMask') {
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
        rpcUrls: networkConfig.rpcUrl,
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
    appChainId: _chainId,
    walletChainId: walletNetwork,
    address,
    rpcProvider,
    web3Provider,
    connectWallet,
    disconnectWallet,
    pushNetwork,
    setAppChainId: setAppChainId,
  };

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
