import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import Web3 from "web3";
import CarsContract from "../../contracts/CarsContract.json";


export default function AddDialog({ index }) {
    const [open, setOpen] = React.useState(false);
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [marque, setMarque] = useState("");
    const [modele, setModele] = useState("");
    const [fuel, setFuel] = useState("");
    const [color, setColor] = useState("");
    const [power, setPower] = useState(0);
    const [annee, setAnnee] = useState(0);
    const [price, setPrice] = useState(0);
    const numberCars = 0;
    const [cars, setCars] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGoToAdd = async (event) => {
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

            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Metamask n'est pas installé sur cette application")
        }
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <form onSubmit={handleGoToAdd}>
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
                            <div>
                                <label>Enter your price:
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </label>
                            </div>
                            <input type="submit" />
                        </form>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleGoToAdd} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}