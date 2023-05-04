import Web3 from "web3";
import { useEffect, useState } from "react";

import CarsContract from "./contracts/CarsContract.json";

function App() {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
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

        // récupération de toutes mes voitures
        const allCars = await contract.methods.getAllCars().call();
        setCars(allCars);

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

  const addCars = async (event) => {
    event.preventDefault();
    await contract.methods.addCars(marque, modele, fuel, color, power, annee).send({ from: accounts[0] });

    // J'appelle toute mes voitures pour actualiser ma liste
    getAllCars();

  }

  async function getAllCars() {
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
        <h2>Form add cars</h2>

        <form onSubmit={addCars}>
          <div>
            <label>Enter your marque:
              <input
                type="text"
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Enter your modele:
              <input
                type="text"
                value={modele}
                onChange={(e) => setModele(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Enter your fuel:
              <input
                type="text"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Enter your color:
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Enter your power:
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Enter your annee:
              <input
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
              />
            </label>
          </div>
          <input type="submit" />
        </form>
        
        <div>
          <h2>List of cars</h2>
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
    </div>
  );
}

export default App;
