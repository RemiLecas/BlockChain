import Web3 from "web3";
import DeleteDialog from "../Dialogs/deleteDialog";
import ModifyDialog from "../Dialogs/modifyDialog";
import SellDialog from "../Dialogs/sellDialog";
import { useEffect, useState } from "react";
import "./List.css";

import CarsContract from "../../contracts/CarsContract.json";

function MyCars() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const numberCars = 0;
    const [myCars, setMyCars] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [value, setValue] = useState(0);
    const [firstLoad, setFirstLoad] = useState(false);

    async function getMyCars() {
        console.log("getMyCars()")
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
                const myCars = await contract.methods.getMyCars().call();
                console.log(myCars);
                setMyCars(myCars);

            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Metamask n'est pas installé sur cette application")
        }
    }

    useEffect(() => {
        getMyCars();
    }, [])

    return (
        <div>
            <h2>Liste de mes voitures</h2>
            <p>Nombre de voiture dans votre parc: {myCars.length}</p>
            {myCars.map((car, index) => (
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
                            <ModifyDialog index={index} />
                            <DeleteDialog index={index} />
                            <SellDialog index={index} price={car.priceInEth} /> 

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyCars;
