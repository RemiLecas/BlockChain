// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CarsContract {
    struct Cars {
        uint256 id;
        string marque;
        string modele;
        string _fuel;
        string _color;
        uint256 _power;
        uint256 annee;
    }

    Cars[] public carss;

    function addCars(
        string memory _marque,
        string memory _modele,
        string memory _fuel,
        string memory _color,
        uint256 _power,
        uint256 _annee
    ) public {
        uint256 carsId = carss.length;
        carss.push(
            Cars(carsId, _marque, _modele, _fuel, _color, _power, _annee)
        );
    }

    function getAllCars() public view returns (Cars[] memory) {
        return carss;
    }
}
