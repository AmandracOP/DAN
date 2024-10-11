// truffle-config.js
module.exports = {
    networks: {
      development: {
        host: "127.0.0.1", // Localhost (default: none)
        port: 8545,        // Standard Ethereum port (default: none)
        network_id: "*",   // Any network (default: none)
      },
    },
  
    compilers: {
      solc: {
        version: "0.8.0", // Specify the version of Solidity to use
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  };
  