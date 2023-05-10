import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import Web3 from "web3";
import CarsContract from "../../contracts/CarsContract.json";

function ModifyDialog({ index }) {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [car, setCar] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [marque, setMarque] = useState(car.marque);
    const [modele, setModele] = useState(car.modele);
    const [fuel, setFuel] = useState(car.fuel);
    const [color, setColor] = useState(car.color);
    const [power, setPower] = useState(car.power);
    const [annee, setAnnee] = useState(car.annee);
    const [price, setPrice] = useState(car.price);
    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setOpen(false);
    };


    const handleClickOpen = async (event) => {
        event.preventDefault();
        setOpen(true);

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

                const car = await contract.methods.getByIndex(index).call();
                console.log(car);

                setCar(car);


            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Metamask n'est pas installé sur cette application")
        }
    }

    const modifyCar = async (event) => {
        event.preventDefault();
        if (accounts && accounts[0]) {

            const modifyMarque = marque || car.marque;
            const modifyModele = modele || car.modele;
            const modifyFuel = fuel || car.fuel;
            const modifyColor = color || car.color;
            const modifyPower = power || car.power;
            const modifyAnnee = annee || car.annee;
            const modifyPrice = price || car.price;

            await contract.methods.modifyCars(index, modifyMarque, modifyModele, modifyFuel, modifyColor, modifyPower, modifyAnnee, modifyPrice).send({ from: accounts[0] });

            setOpen(false);
            window.location.reload();
        } else {
            console.log("Il n'y a pas de compte")
        }

    };


    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Modifier
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Êtes vous sur de vouloir la modifier ?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">

                        <div>
                            <label>Marque :</label>
                            <input
                                type="text"
                                id="marque"
                                name="marque"
                                defaultValue={car.marque}
                                onChange={(e) => setMarque(e.target.value)}
                            />
                            <label>Modele :</label>
                            <input
                                type="text"
                                id="modele"
                                name="modele"
                                defaultValue={car.modele}
                                onChange={(e) => setModele(e.target.value)}
                            />
                            <label>Fuel :</label>
                            <input
                                type="text"
                                id="fuel"
                                name="fuel"
                                defaultValue={car.fuel}
                                onChange={(e) => setFuel(e.target.value)}
                            />
                            <label>Color :</label>
                            <input
                                type="text"
                                id="color"
                                name="color"
                                defaultValue={car.color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                            <label>Power :</label>
                            <input
                                type="number"
                                id="power"
                                name="power"
                                defaultValue={car.power}
                                onChange={(e) => setPower(e.target.value)}
                            />
                            <label>Annee :</label>
                            <input
                                type="number"
                                id="annee"
                                name="annee"
                                defaultValue={car.annee}
                                onChange={(e) => setAnnee(e.target.value)}
                            />
                            <label>Price :</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                defaultValue={car.price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button autoFocus onClick={modifyCar}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default ModifyDialog;
