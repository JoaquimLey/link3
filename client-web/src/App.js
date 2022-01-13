import "regenerator-runtime/runtime";
import Big from "big.js";
import React, { useEffect, useState } from 'react';
// Assets
import logo from './link3_logo.svg';
import nearLogo from './near_logo.svg';

// const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  // useState
  const [list, setList] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);

  // Actions
  const fetchList = async () => {
    if (currentUser) {
      // const status = await contract.list({ account_id: currentUser.accountId });
      const list = await contract.list();
      setList(list);
    }
  }

  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName, "Link3 Testnet");
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  // useEffects
  useEffect(() => {
    fetchList();
  }, [currentUser])

  // Render Methods
  const renderSignInButton = () => {
    return (
      <button onClick={signIn} className="flex items-center space-x-1 bg-pink-500 ease-in-out transform duration-700 hover:bg-pink-300 px-8 py-2 rounded-lg font-bold">
        Login with NEAR
        <img src={nearLogo} className="h-6" alt="Link3 logo" />
      </button>
    )
  }

  const renderLogoutButton = () => {
    return (
      <button onClick={signOut} className="flex items-center space-x-1 bg-pink-500 ease-in-out transform duration-700 hover:bg-pink-300 px-8 py-2 rounded-lg font-bold">
        Disconnect Wallet
        <img src={nearLogo} className="h-6" alt="Link3 logo" />
      </button>
    )
  }

  return (
    <div className="bg-gray-800 text-center items-center min-h-screen w-full flex flex-col justify-center text-white space-y-4">
      <header className="space-y-4">
        <img src={logo} className='h-80 mx-auto rounded-full' alt="NEAR logo" />
        <h1 className="text-6xl">Welcome to Link3</h1>
        <p className="text-md">
          a linktree alternative built on <a className="underline" href="https://near.org" target="_blank">NEAR</a>.
        </p>
      </header>

      <section className='space-y-8'>
        {!currentAccount ? renderSignInButton() : renderLogoutButton()}

        <p className="text-sm">
          <span>by </span>
          <a
            className="underline font-bold"
            href="https://twitter.com/joaquimley"
          >
            @JoaquimLey
          </a>
        </p>
      </section>
    </div>
  );
}

export default App;
