import Web3 from "web3";
import DeleteDialog from "../Dialogs/deleteDialog"
import { useEffect, useState } from "react";
import "./List.css";

import CarsContract from "../../contracts/CarsContract.json";

function DetailCars() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const numberCars = 0;
    const [car, setCar] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [value, setValue] = useState(0);


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
                const car = await contract.methods.getByIndex().call();
                console.log(car);
                setCar(car);

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
        <div>
            <h2>List of cars</h2>
            {cars.map((car, index) => (
                <div key={index}>
                    <div className="card">
                        <div className="container">
                            <label>Enter your marque:
                                <input
                                    type="text"
                                    value={marque}
                                    onChange={(e) => setMarque(e.target.value)}
                                />
                            </label>
                            <h5>Modèle : {car.modele} </h5>
                            <h5>Année : {car.annee} </h5>
                            <h5>Fuel : {car._fuel} </h5>
                            <h5>Color : {car._color} </h5>
                            <h5>Power : {car._power} </h5>
                            <h5>Price : {car.price} </h5>
                            <DeleteDialog index={index} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DetailCars;
