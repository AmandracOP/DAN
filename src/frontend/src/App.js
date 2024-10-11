import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [nodeName, setNodeName] = useState('');
    const [nodes, setNodes] = useState([]);

    // Define the backend server URL
    const backendUrl = 'http://localhost:3001'; // Change this to match your Express server port

    const addNode = async () => {
        if (!nodeName) return;
        try {
            const response = await axios.post(`${backendUrl}/nodes`, { nodeName });
            console.log(response.data);
            fetchNodes(); // Refresh the node list after adding
            setNodeName(''); // Clear input field
        } catch (error) {
            console.error("Error adding node:", error);
        }
    };

    const fetchNodes = async () => {
        try {
            const response = await axios.get(`${backendUrl}/nodes`);
            setNodes(response.data);
        } catch (error) {
            console.error("Error fetching nodes:", error);
        }
    };

    useEffect(() => {
        fetchNodes();
    }, []);

    return (
        <div className="App">
            <h1>Decentralized Autonomous Network</h1>
            <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Enter Node Name"
            />
            <button onClick={addNode}>Add Node</button>

            <h2>Nodes in the Network</h2>
            <ul>
                {nodes.map((node, index) => (
                    <li key={index}>
                        {node.nodeName} (Address: {node.nodeAddress})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
