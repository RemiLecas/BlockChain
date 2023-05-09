// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CarsContract {
    uint256 public numberCars;
    uint256 totalPrice;
    address owner;
    bool firstLoad;
    uint256 money;

    constructor() {
        numberCars = 0;
        totalPrice = 0;
        owner = msg.sender;
        firstLoad = false;
        money = 1000;
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
    mapping(address => Cars[]) public myCars;

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
        uint256 _priceInEth = (_price % 1714);

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
        // Ajoute +1 au nombre de voiture total
        numberCars++;

        // Ajoute le prix de la voiture au montant total du parc
        totalPrice += _price;
    }

    // Retourne toutes les voitures
    function getAllCars() public view returns (Cars[] memory) {
        return carss;
    }

    // Retourne le prix total de toute les voitures
    function getTotalPriceCars() public view returns (uint256) {
        return totalPrice;
    }

    // Permet de supprimer une voiture
    function deleteCars(uint256 index) public {
        // Vérification de l'index s'il est valide + vérification que ca soit bien le owner du véhicule
        require(index < carss.length);
        require(msg.sender == carss[index].owner);

        totalPrice -= carss[index].price;
        numberCars -= 1;
        delete carss[index];
    }

    // permet d'avoir le nombre de voiture
    function getNumbersOfCars() public view returns (uint256) {
        return numberCars;
    }

    // Récupére le montant total du compte de l'utilisateur
    function getMoney() public view returns (uint256) {
        return money;
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

        // On enlève l'ancien prix pour mettre le nouveau
        totalPrice = totalPrice - carss[index].price;

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

        // On actualise le prix total
        totalPrice += _price;
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

    function getByIndex(uint256 index)
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
        //Vérifie si l'utilisateur à la money nécessaire à la transaction

        // On mets le montant de la voiture en Eth dans la variable amountPaid
        uint256 amountPaid = carss[index].priceInEth;

        if (money >= amountPaid) {
            //Retire la valeur de la voiture du portefeuille de l'utilisateur
            money = money - amountPaid;

            Cars storage car = carss[index];

            //Ajoute la voiture achété au tableau myCar
            myCars[msg.sender].push(car);

            // Supprime la voiture du tableau carss qui représente toutes les voitures disponible à la vente
            if (index < carss.length - 1) {
                carss[index] = carss[carss.length - 1];
            }
            carss.pop();
        }
    }

    function getMyCars() public view returns (Cars[] memory) {
        return myCars[msg.sender];
    }

        function sellCar(uint256 index, uint256 price) public {
        require(
            index < myCars[msg.sender].length,
            "L'index de la voiture est invalide"
        );

        Cars storage car = myCars[msg.sender][index];

        // Met à jour le prix de la voiture
        car.priceInEth = price;

        // Transfère la propriété de la voiture à l'adresse du contrat
        car.owner = address(this);

        // Ajoute la voiture au tableau carss
        carss.push(car);

        // Supprime la voiture du tableau myCars
        delete myCars[msg.sender][index];

        money += price;
    }
}
