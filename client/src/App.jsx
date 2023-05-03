import Web3 from "web3";
import Wallet from './contracts/Wallet.json';
import { useEffect, useState } from "react";

function App() {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  let [web3, setWeb3] = useState(null)

  const [balance, setBalance] = useState();

  const [currentAccount, setCurrentAccount] = useState();

  // invoke to connect to wallet account

  async function checkAccount() {
    if (window.ethereum) {

      try {
        await window.ethereum.enable();

        const web3 = new Web3(window.ethereum);
        console.log(web3);

        // Récupération du compte MetaMask
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);

        setWeb3(web3);
        setAccounts(accounts);

        const networkId = await web3.eth.net.getId();
        console.log({networkId: networkId})
        const deployedNetwork = Wallet.networks[networkId];
        console.log({deployedNetwork: deployedNetwork})

        const contract = new web3.eth.Contract(
          Wallet.abi,
          deployedNetwork && deployedNetwork.address,
        );

        console.log({contract: contract})


        setContract(contract);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Metamask n'est pas installé sur cette application")
    }


  }

  async function getBalanced() {
    // const count = contract.methods.getBalance();
    console.log('test',  contract.methods.getBalance());
    console.log(contract.methods.getBalance()._method.outputs[0])
    // setBalance(count)
  }

  useEffect(() => {
    checkAccount();
  }, [])

  return (
    <div id="App">
      <div className="container">
        <p>{accounts}</p>

        <button onClick={getBalanced}>Balanced</button>
        <p>{balance}</p>
      </div>
    </div>
  );
}

export default App;
