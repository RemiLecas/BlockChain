// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CarsContract {
    address owner;
    bool firstLoad;

    constructor() {
        owner = msg.sender;
        firstLoad = false;
    }

    struct Cars {
        uint256 id;
        string marque;
        string modele;
        string fuel;
        string color;
        uint256 power;
        uint256 annee;
        uint256 price;
        uint256 priceInEth;
        address owner;
    }

    Cars[] public carss;
    // mapping(address => Cars[]) public myCars;
    // address[] public myCars_result;
    Cars[] public myCars;
    mapping(address => uint256) balances;

    function addCars(
        string memory _marque,
        string memory _modele,
        string memory _fuel,
        string memory _color,
        uint256 _power,
        uint256 _annee,
        uint256 _price
    ) public {
        uint256 carsId = carss.length;
        address _owner;

        // Calcul du prix de la voiture en ethereum
        uint256 _priceInEth = (_price / 1714); // Valeur de l'Eth le vendredi 5/05/2023

        carss.push(
            Cars(
                carsId,
                _marque,
                _modele,
                _fuel,
                _color,
                _power,
                _annee,
                _price,
                _priceInEth,
                _owner
            )
        );
    }

    // Retourne toutes les voitures
    function getAllCars() public view returns (Cars[] memory) {
        return carss;
    }

    // Permet de supprimer une voiture
    function deleteCars(uint256 index) public {
        // Vérification de l'index s'il est valide + vérification que ca soit bien le owner du véhicule
        require(index < myCars.length);
        require(msg.sender == myCars[index].owner);

        delete myCars[index];
    }

    // Récupére le montant total du compte de l'utilisateur
    function getMoney() public view returns (uint256) {
        return address(msg.sender).balance;
    }

    // Permet de modifier une voiture
    function modifyCars(
        uint256 index,
        string memory _marque,
        string memory _modele,
        string memory _fuel,
        string memory _color,
        uint256 _power,
        uint256 _annee,
        uint256 _price
    ) public {
        // Vérification de l'index si il est valide
        require(index < carss.length);
        require(msg.sender == carss[index].owner);
        Cars storage car = carss[index]; // Récupère la voiture à l'index donné

        car.marque = _marque;
        car.modele = _modele;
        car.annee = _annee;
        car.fuel = _fuel;
        car.color = _color;
        car.power = _power;
        car.price = _price;
        car.owner = msg.sender;

        // Calcul du prix de la voiture en ethereum
        uint256 _priceInEth = (_price % 1714);
        car.priceInEth = _priceInEth;
    }

    // Récupére le propriétaire du véhicule
    function getOwner() public view returns (address) {
        return owner;
    }

    // Change le propriétaire du véhicule
    function changeOwner(address newOwner) public {
        require(msg.sender == owner);
        owner = newOwner;
    }

    // Sert à savoir si le véhicule nous appartient
    function isMine() public view returns (bool) {
        return (owner == msg.sender);
    }

    function getByIndex(
        uint256 index
    )
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            address,
            uint256,
            string memory,
            uint256
        )
    {
        require(index < carss.length);

        Cars storage car = carss[index];
        return (
            car.marque,
            car.modele,
            car.annee,
            car.owner,
            car.price,
            car.fuel,
            car.power
        );
    }

    //Generate data
    function generateData() public returns (string memory) {
        if (firstLoad == false) {
            uint256 carsId = carss.length;
            carss.push(
                Cars(
                    carsId,
                    "Tesla",
                    "X",
                    "Electrique",
                    "Noir",
                    150,
                    2022,
                    42000,
                    2,
                    msg.sender
                )
            );
            carss.push(
                Cars(
                    carsId,
                    "Ford",
                    "Mustang",
                    "Essence",
                    "Rouge",
                    250,
                    2022,
                    60099,
                    3,
                    msg.sender
                )
            );
            carss.push(
                Cars(
                    carsId,
                    "Renault",
                    "Scenic",
                    "Diesel",
                    "Blanc",
                    110,
                    2018,
                    20000,
                    2,
                    msg.sender
                )
            );
            firstLoad = true;
            return "Donnees initialise";
        } else {
            return "Donnees deja initialise";
        }
    }

    // Achat de voiture via la money de l'utilisateur
    function buyCar(uint256 index) public payable {
        // On mets le montant de la voiture en Eth dans la variable amountPaid
        uint256 amountPaid = carss[index].priceInEth;

        if (address(msg.sender).balance >= amountPaid) {
            //Retire la valeur de la voiture du portefeuille de l'utilisateur

            address(msg.sender).balance - amountPaid;

            Cars storage cars = carss[index];

            //Ajoute la voiture achété au tableau myCar
            myCars.push(cars);

            // Supprime la voiture du tableau
            if (index < carss.length - 1) {
                carss[index] = carss[carss.length - 1];
            }
            carss.pop();
        }
    }

    function getMyCars() public view returns (Cars[] memory) {
        return myCars;
    }

    function sellCar(uint256 index, uint256 price) public {
        require(index < myCars.length, "L'index de la voiture est invalide");

        Cars storage car = myCars[index];

        // Met à jour le prix de la voiture
        car.priceInEth = (price / 1714);

        // Transfère la propriété de la voiture à l'adresse du contrat
        car.owner = address(this);

        // Ajoute la voiture au tableau carss
        carss.push(car);

        // Supprime la voiture du tableau
        if (index < myCars.length - 1) {
            myCars[index] = myCars[carss.length - 1];
        }
        myCars.pop();

        address(msg.sender).balance + car.priceInEth;
    }
}
