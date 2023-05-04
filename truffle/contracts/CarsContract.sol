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
        numberCars++;

        totalPrice += _price;
    }

    function getAllCars() public view returns (Cars[] memory) {
        return carss;
    }

    function getTotalPriceCars() public view returns (uint256) {
        return totalPrice;
    }

    function deleteCars(uint256 index) public {
        // Vérification de l'index si il est valide
        require(index < carss.length && msg.sender == carss[index].owner);

        totalPrice -= carss[index].price;
        delete carss[index];
    }

    function getNumbersOfCars() public view returns (uint256) {
        return numberCars;
    }

    function getBalance() public view returns (uint256) {
        return msg.sender.balance;
    }

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
        require(index < carss.length && msg.sender == carss[index].owner);
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

    function getOwner() public view returns (address) {
        return owner;
    }

    function changeOwner(address newOwner) public {
        require(msg.sender == owner);
        owner = newOwner;
    }

    function isMine() public view returns (bool) {
        return (owner == msg.sender);
    }
}
