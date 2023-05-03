// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarsContract {
    struct Cars {
        uint256 id;
        string marque;
        string modele;
        uint256 annee;
    }

    Cars[] public carss;

    function addCars(
        string memory _marque,
        string memory _modele,
        uint256 _annee
    ) public {
        uint256 carsId = carss.length;
        carss.push(Cars(carsId, _marque, _modele, _annee));
    }

    function getAllCars() public view returns (Cars[] memory) {
        return carss;
    }
}
