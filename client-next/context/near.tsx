import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import nearConfig from "../near/config";

type nearContextType = {
  accountId: string | null;
  isLoggedIn: boolean;
  view: (methodName: string, args?: any) => Promise<any>;
  getHub: (account_id: string) => Promise<any>;
  show: () => void;
  logout: () => void;
};

const nearContextDefaultValues: nearContextType = {
  accountId: null,
  isLoggedIn: false,
  view: () => Promise.resolve(),
  getHub: () => Promise.resolve(),
  show: () => { },
  logout: () => { },
};

const NearContext = createContext<nearContextType>(nearContextDefaultValues);

export function useNear() {
  return useContext(NearContext);
}

type Props = {
  children: ReactNode;
};

export function NearProvider({ children }: Props) {

  const [selector, setSelector] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const initWallet = async () => {
    const walletSelector = await import("near-wallet-selector")
    const NearWalletSelector = walletSelector.default
    const selector = new NearWalletSelector(nearConfig());
    await selector.init();
    setSelector(selector);
  };
  useEffect(() => {
    initWallet();
  }, []);


  const handleSignIn = async () => {
    if (selector) {
      const account = await selector.getAccount();
      console.log("account", account);
      setIsLoggedIn(await selector.isSignedIn());
      setAccountId(account ? account.accountId : null);
    }
  }

  useEffect(() => {
    handleSignIn();
  }, [selector]);

  useEffect(() => {
    if (selector) {
      selector.on("signIn", handleSignIn);
      return () => selector.off("signIn", handleSignIn);
    }
  }, [selector]);


  const logout = async () => {
    await selector.signOut();
    setIsLoggedIn(await selector.isSignedIn());
    setAccountId(null);
  };
  const show = () => {
    selector.show();
  };

  const view = async (methodName: string, args?: any) => {
      return await selector.contract.view({
        methodName,
        args: args
      });
  }

  async function get(account_id: string) {
    console.log("selector.contract", selector.contract)
    return await selector.contract.view({
      methodName: "get",
      args: { account_id }
    });
  }


  const value = {
    accountId,
    isLoggedIn,
    logout,
    show,
    view,
    getHub: get
  };

  return (
    <>
      <NearContext.Provider value={value}>
        {children}
      </NearContext.Provider>
    </>
  );
}


export default NearProvider;