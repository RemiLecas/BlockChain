import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import Web3 from "web3";
import CarsContract from "../../contracts/CarsContract.json";


export default function SellDialog({ index, price }) {
    const [open, setOpen] = React.useState(false);
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);

    async function init() {

    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGoToBuy = async (event) => {
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

                // Achat de la voiture
                await contract.methods.sellCar(index, price).send({ from: accounts[0] });

                setOpen(false);
                window.location.reload();
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
                Vendre
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Êtes vous sur de vouloir vendre la voiture ?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleGoToBuy} autoFocus>
                        Vendre
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}