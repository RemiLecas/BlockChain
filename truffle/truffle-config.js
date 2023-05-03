module.exports = {

  contracts_build_directory: "../client/src/contracts",

  networks: {

    development: {

      host: "127.0.0.1",

      port: 7545,

      network_id: "*" // Match any network id

    }

  },

  // Configure your compilers

  compilers: {

    solc: {

      version: "0.8.18",

    }

  },




};