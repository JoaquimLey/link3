import NearWalletSelector from "near-wallet-selector";
import dynamic from "next/dynamic";
import { createContext, ReactNode, useContext, useState } from "react";

type BuiltInWalletId = "near-wallet" | "sender-wallet" | "ledger-wallet" | "math-wallet";
type NetworkId = "mainnet" | "betanet" | "testnet";
type Theme = "dark" | "light" | "auto";

interface Options {
  // List of wallets you want to support in your dApp.
  wallets: Array<BuiltInWalletId>;
  // Network ID matching that of your dApp.
  networkId: NetworkId;
  contract: {
    // Account ID of the Smart Contract used for 'view' and 'signAndSendTransaction' calls.
    contractId: string;
    // Optional: Specify limited access to particular methods on the Smart Contract.
    methodNames?: Array<string>;
  };
  ui?: {
    // Optional: Specify light/dark theme for UI. Defaults to the browser configuration when
    // omitted or set to 'auto'.
    theme?: Theme;
    // Optional: Provides customisation description text in the UI.
    description?: string;
  };
}



type nearContextType = {
  accountId: string | null;
  isLoggedIn: boolean;
  wallet: object;
  show: () => void;
  login: () => void;
  logout: () => void;
};

const nearContextDefaultValues: nearContextType = {
  accountId: null,
  isLoggedIn: false,
  wallet: {},
  login: () => { },
  logout: () => { },
  show: () => { },
};

const NearContext = createContext<nearContextType>(nearContextDefaultValues);

export function useNear() {
  return useContext(NearContext);
}

type Props = {
  children: ReactNode;
};

export function NearProvider({ children }: Props) {
  const selector = new NearWalletSelector({
    wallets: ["near-wallet", "sender-wallet", "ledger-wallet"],
    networkId: "testnet",
    contract: { contractId: "guest-book.testnet" },
  });

  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [wallet, setWallet] = useState<object>({});



  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };
  const show = () => {
    setIsLoggedIn(false);
  };

  const value = {
    accountId,
    isLoggedIn,
    wallet,
    login,
    logout,
    show,
  };

  return (
    <>
      <NearContext.Provider value={value}>
        {children}
      </NearContext.Provider>
    </>
  );
}
