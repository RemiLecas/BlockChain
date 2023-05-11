import Web3 from "web3";

import BuyDialog from "../Dialogs/buyDialog";
import { useEffect, useState } from "react";
import "./List.css";

import CarsContract from "../../contracts/CarsContract.json";

function ListCars() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [cars, setCars] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [firstLoad, setFirstLoad] = useState(false);

    async function getAllCars() {
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
                console.log(allCars);
                setCars(allCars);

            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Metamask n'est pas installé sur cette application")
        }
    }

    async function generateData() {
        if (!firstLoad) {
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

                    try {
                        await contract.methods.generateData().send({ from: accounts[0] });
                    } catch (error) {
                        console.error(error);
                    }


                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error("Metamask n'est pas installé sur cette application")
            }
            setFirstLoad(true);
        } else {
            console.log("Données déja instancié")
        }
    }

    useEffect(() => {
        getAllCars();
    }, [])

    return (
        <div>
            <h2>Liste des voitures disponible</h2>
            <button onClick={generateData}>Généré des datas</button>
            <p>Nombre de voiture dans le parc : {cars.length}</p>
            {cars.map((car, index) => (
                <div key={index}>
                    <div className="card">
                        <div className="container">
                            <h5>Marque : {car.marque} </h5>
                            <h5>Modèle : {car.modele} </h5>
                            <h5>Année : {car.annee} </h5>
                            <h5>Carburant : {car.fuel} </h5>
                            <h5>Couleur : {car.color} </h5>
                            <h5>Puissance : {car.power} </h5>
                            <h5>Prix en € : {car.price} </h5>
                            <h5>Prix en Eth : {car.priceInEth} </h5>
                            <BuyDialog index={index} />

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListCars;
