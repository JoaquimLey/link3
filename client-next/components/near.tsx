import NearWalletSelector from "near-wallet-selector";

const Near = async () => {
  const selector = new NearWalletSelector({
    wallets: ["near-wallet", "sender-wallet", "ledger-wallet"],
    networkId: "testnet",
    contract: { contractId: "guest-book.testnet" },
  });
  await selector.init()
  await selector.signOut();
  alert("cenas")
  selector.show()
};
export default Near;