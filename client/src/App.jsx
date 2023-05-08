import Web3 from "web3";
import { useEffect, useState } from "react";

import CarsContract from "./contracts/CarsContract.json";
import ListCars from "./components/Cars/List";
import AddDialog from "./components/Dialogs/addDialog";

function App() {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(null);


  const [balance, setBalance] = useState();


  async function init() {
    if (window.ethereum) {

      try {

        // demande la connexion à metamask
        await window.ethereum.enable();

        // J'init de mon web3
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);

        // Récupération du compte MetaMask
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        // Initialisation du contrat
        // Récupération du networkId
        const networkId = await web3.eth.net.getId();
        // Récupération du network déployé grâce au network Id
        const deployedNetwork = CarsContract.networks[networkId];

        const contract = new web3.eth.Contract(
          CarsContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

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
    console.log('test', contract.methods.getBalance());
    console.log(contract.methods.getBalance()._method.outputs[0])
    // setBalance(count)
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div id="App">
      <div className="container">
        <p>Wallet : {accounts}</p>

        <button onClick={getBalanced}>Balanced</button>
        <p>{balance}</p>

        <hr />
        <h2>Form add cars</h2>

        <AddDialog />

        <ListCars />
      </div>
    </div>
  );
}

export default App;
