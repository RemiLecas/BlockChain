import Web3 from "web3";
import { useEffect, useState } from "react";

import CarsContract from "./contracts/CarsContract.json";
import ListCars from "./components/Cars/List";
import MyCars from "./components/Cars/myCars";

function App() {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [balance, setBalance] = useState();
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [fuel, setFuel] = useState("");
  const [color, setColor] = useState("");
  const [power, setPower] = useState(0);
  const [annee, setAnnee] = useState(0);
  const [price, setPrice] = useState(0);
  const numberCars = 0;
  const [cars, setCars] = useState([]);


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

        // const count = await contract.methods.getMoney()._method.outputs[0];
        // setBalance(count);

        let money = await contract.methods.getMoney().call();
        setBalance(money)

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Metamask n'est pas installé sur cette application")
    }
  }

  const goToAdd = async (event) => {
    event.preventDefault();
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

        await contract.methods.addCars(marque, modele, fuel, color, power, annee, price).send({ from: accounts[0] });
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Metamask n'est pas installé sur cette application")
    }
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div id="App">
      <div className="container">
        <p>Compte : {accounts}</p>
        <p>Argent :{balance}</p>

        <hr />
        <h2>Formulaire d'ajout de Voiture</h2>

        <form onSubmit={goToAdd}>
          <div>
            <label>Entrer la marque:
              <input
                type="text"
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Entrer le modele:
              <input
                type="text"
                value={modele}
                onChange={(e) => setModele(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Entrer le type de carburant:
              <input
                type="text"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Entrer la couleur:
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Entrer la puissance du véhicule:
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Entrer l'année:
              <input
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>Entrer le prix:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
          </div>
          

          <button type="submit">Ajouter</button>
        </form>
        <ListCars contract={contract}/>

        <MyCars contract={contract}/>
      </div>
    </div>
  );
}

export default App;
