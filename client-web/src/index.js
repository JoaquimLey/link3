// import React, { StrictMode } from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import * as nearAPI from 'near-api-js';
// import getConfig from './near/config.js';

// // Initializing contract
// async function initContract() {
//   const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

//   // Initializing connection to the NEAR TestNet
//   const near = await nearAPI.connect({
//     keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
//     ...nearConfig
//   });

//   // Needed to access wallet
//   const walletConnection = new nearAPI.WalletConnection(near);

//   // Load in account data
//   let currentUser;
//   if (walletConnection.getAccountId()) {
//     currentUser = {
//       accountId: walletConnection.getAccountId(),
//       balance: (await walletConnection.account().state()).amount
//     };
//   }

//   // Initializing our contract APIs by contract name and configuration
//   const contract = new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
//     viewMethods: ['info', 'list'],
//     changeMethods: ['update_published_status', 'list_all', 'create_link'],
//     // Sender is the account ID to initialize transactions.
//     // getAccountId() will return empty string if user is still unauthorized
//     sender: walletConnection.getAccountId()
//   });

//   return { contract, currentUser, nearConfig, walletConnection };
// }

// window.nearInitPromise = initContract().then(({ contract, currentUser, nearConfig, walletConnection }) => {
//   ReactDOM.render(
//     <StrictMode>
//       <App
//         contract={contract}
//         currentUser={currentUser}
//         nearConfig={nearConfig}
//         wallet={walletConnection}
//       />
//     </StrictMode>,
//     document.getElementById('root')
//   );
// });


import React from 'react';
import ReactDOM from 'react-dom';
import * as nearAPI from 'near-api-js';
import getConfig from './near/config.js';
import './index.css';
import App from './App';

global.Buffer = global.Buffer || require('buffer').Buffer

const initContract = async () => {

  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    ...nearConfig
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount
    };
  }

  // Initializing our contract APIs by contract name and configuration
  const contract = new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
    viewMethods: ['info', 'list'],
    changeMethods: ['update_published_status', 'list_all', 'create_link'],
    // Sender is the account ID to initialize transactions.
    // getAccountId() will return empty string if user is still unauthorized
    sender: walletConnection.getAccountId()
  });
  return { contract, currentUser, nearConfig, walletConnection };
}
window.nearInitPromise = initContract().then(({ contract, currentUser, nearConfig, walletConnection }) => {
  ReactDOM.render(
    <React.StrictMode>
      <App
        contract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={walletConnection}
      />
    </React.StrictMode>,
    document.getElementById('root')
  );
});