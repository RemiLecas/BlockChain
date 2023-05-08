// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CarsContract {
    uint256 public numberCars;
    uint256 totalPrice;
    address owner;

    constructor() {
        numberCars = 0;
        totalPrice = 0;
        owner = msg.sender;
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
    function getBalance() public view returns (uint256) {
        return msg.sender.balance;
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
        require(index < carss.length, "Index invalide");
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
}
