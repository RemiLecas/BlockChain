import Web3 from "web3";
import AlertDialog from "../Dialogs/deleteDialog"
import { useEffect, useState } from "react";

import CarsContract from "../../contracts/CarsContract.json";

function ListCars() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const numberCars = 0;
    const [cars, setCars] = useState([]);
    const [accounts, setAccounts] = useState([]);


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
                console.log(allCars);
                setCars(allCars);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Metamask n'est pas installé sur cette application")
        }
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
                <h2>List of cars</h2>
                <div>
                    <ul>
                        {cars.map((car, index) => (
                            <li key={index}>
                                Marque : {car.marque} | Modèle : {car.modele} | Année : {car.annee} | Fuel : {car._fuel} | Color : {car._color} | Power : {car._power}
                            </li>
                        ))}
                        <AlertDialog />
                    </ul>
                </div>
            </div>


        </div>
    );
}

export default ListCars;
