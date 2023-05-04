import Web3 from "web3";
import Wallet from './contracts/Wallet.json';
import { useEffect, useState } from "react";

import CarsContract from "./contracts/CarsContract.json";

function App() {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contrat, setContrat] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [fuel, setFuel] = useState("");
  const [color, setColor] = useState("");
  const [power, setPower] = useState(0);
  const [annee, setAnnee] = useState(0);
  const numberCars = 0;
  const [cars, setCars] = useState([]);

  const [balance, setBalance] = useState();

  const [currentAccount, setCurrentAccount] = useState();

  //Init mon application
  async function init() {
    // Je lance mon check de compte
    await checkAccount();
  }


  async function checkAccount() {
    if (window.ethereum) {

      try {
        await window.ethereum.enable();

        // J'init maintenant mon Web3 pour obtenir mon contrat déployé
        const web3 = new Web3(window.ethereum);
        console.log(web3);

        // Récupération du compte MetaMask
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);

        setWeb3(web3);
        setAccounts(accounts);

        const networkId = await web3.eth.net.getId();
        console.log({ networkId: networkId })
        const deployedNetwork = CarsContract.networks[networkId];
        console.log({ deployedNetwork: deployedNetwork })

        const contract = new web3.eth.Contract(
          CarsContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        console.log({ contract: contract })


        setContract(contract);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Metamask n'est pas installé sur cette application")
    }
  }

  // const initWeb3 = async () => {
  //   const networkId = await web3.eth.net.getId();
  //   const deployedNetwork = CarsContract.networks[networkId];
  //   const instance = new web3.eth.Contract(CarsContract.abi, deployedNetwork && deployedNetwork.address);
  //   setWeb3(web3);
  //   setContrat(instance);
  // };

  async function getBalanced() {
    // const count = contract.methods.getBalance();
    console.log('test', contract.methods.getBalance());
    console.log(contract.methods.getBalance()._method.outputs[0])
    // setBalance(count)
  }

  const addCars = async (event) => {
    event.preventDefault();
    await contract.methods.addCars(marque, modele, fuel, color, power, annee).send({ from: accounts[0] });

  }

  const getAllCars = async (event) => {
    event.preventDefault();

    const allCars = await contract.methods.getAllCars().call();

    console.log(allCars);
    setCars(allCars);


  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div id="App">
      <div className="container">
        <p>{accounts}</p>

        <button onClick={getBalanced}>Balanced</button>
        <p>{balance}</p>

        <hr />

        <form onSubmit={addCars}>
          <label>Enter your marque:
            <input
              type="text"
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
            />
          </label>
          <label>Enter your modele:
            <input
              type="text"
              value={modele}
              onChange={(e) => setModele(e.target.value)}
            />
          </label>
          <label>Enter your fuel:
            <input
              type="text"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            />
          </label>
          <label>Enter your color:
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
          <label>Enter your power:
            <input
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </label>
          <label>Enter your annee:
            <input
              type="number"
              value={annee}
              onChange={(e) => setAnnee(e.target.value)}
            />
          </label>
          <input type="submit" />
        </form>

        <div>
          <button onClick={getAllCars}>Get All Cars</button>
        </div>

        <div>
          <ul>
            {cars.map((car, index) => (
              <li key={index}>
                Marque : {car.marque} | Modèle : {car.modele} | Année : {car.annee} | Fuel : {car._fuel} | Color : {car._color} | Power : {car._power}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;
