const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3');
const Libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
const Websockets = require('libp2p-websockets');
const { NOISE } = require('@chainsafe/libp2p-noise');
const Mplex = require('libp2p-mplex');
const Bootstrap = require('libp2p-bootstrap');
const MDNS = require('libp2p-mdns');
const KadDHT = require('libp2p-kad-dht');
const { multiaddr } = require('multiaddr');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Setup Web3 and contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const contractAddress = '0x6BA5a13BfeF4A84cBB8b49cC58624FaB34918da3'; // Replace with your actual contract address
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "nodeAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "nodeName",
                "type": "string"
            }
        ],
        "name": "NodeAdded",
        "type": "event"
    },
    // Add the rest of your ABI here based on the output from the grep command
];

const danContract = new web3.eth.Contract(contractABI, contractAddress);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 2. libp2p Configuration
let libp2p;

async function setupLibp2p() {
    libp2p = await Libp2p.create({
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/0', // TCP
                '/ip4/0.0.0.0/tcp/0/ws', // WebSocket
            ]
        },
        modules: {
            transport: [TCP, Websockets],
            streamMuxer: [Mplex],
            connEncryption: [NOISE],
            peerDiscovery: [Bootstrap, MDNS],
            dht: KadDHT
        },
        config: {
            peerDiscovery: {
                autoDial: true,
                bootstrap: {
                    enabled: true,
                    list: [] // Optional: list of bootstrap peers
                },
                mdns: {
                    interval: 10000,
                    enabled: true
                }
            }
        }
    });

    await libp2p.start();

    libp2p.on('peer:discovery', (peerId) => {
        console.log(`Discovered peer: ${peerId.toB58String()}`);
    });

    libp2p.connectionManager.on('peer:connect', (connection) => {
        console.log(`Connected to peer: ${connection.remotePeer.toB58String()}`);
    });

    console.log('libp2p node is running');
}

// 3. Automate Node Adding and IP Assignment
let ipPool = [];
const generateIP = () => {
    const ipBase = '192.168.1.';
    let lastIP = ipPool.length + 1;  // Simple incremental IP generation
    let newIP = ipBase + lastIP;
    ipPool.push(newIP);
    return newIP;
};

// 4. Route: Add Node with Web3 + libp2p
app.post('/nodes', async (req, res) => {
    const { nodeName } = req.body;
    const accounts = await web3.eth.getAccounts();

    try {
        // Assign a dynamic IP
        const ipAddress = generateIP();

        // Add the node on-chain via the contract
        const result = await danContract.methods.addNode(nodeName).send({ from: accounts[0] });

        // Add the node to libp2p network
        const peerId = libp2p.peerId.toB58String(); // Current libp2p node peer ID
        const nodeAddress = `/ip4/${ipAddress}/tcp/0/p2p/${peerId}`;

        // Optionally add multiaddr to the libp2p address book
        libp2p.peerStore.addressBook.set(peerId, [multiaddr(nodeAddress)]);

        res.json({ status: 'Node added', nodeAddress, ipAddress, result });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// 5. Route: Fetch all Nodes (Web3)
app.get('/nodes', async (req, res) => {
    try {
        const nodes = await danContract.methods.getNodes().call();
        res.json(nodes);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Start server and libp2p
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    await setupLibp2p();  // Start libp2p network
});
