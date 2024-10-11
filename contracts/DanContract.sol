// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DanContract {
    struct Node {
        address nodeAddress;
        string nodeName;
        bool active;
    }

    mapping(address => Node) public nodes;
    address[] public nodeAddresses;

    event NodeAdded(address indexed nodeAddress, string nodeName);
    event NodeRemoved(address indexed nodeAddress);

    function addNode(string memory _nodeName) public {
        require(nodes[msg.sender].nodeAddress == address(0), "Node already exists");
        
        nodes[msg.sender] = Node(msg.sender, _nodeName, true);
        nodeAddresses.push(msg.sender);

        emit NodeAdded(msg.sender, _nodeName);
    }

    function removeNode() public {
        require(nodes[msg.sender].active, "Node not active");

        delete nodes[msg.sender];

        emit NodeRemoved(msg.sender);
    }

    function getNodes() public view returns (Node[] memory) {
        Node[] memory allNodes = new Node[](nodeAddresses.length);
        for (uint i = 0; i < nodeAddresses.length; i++) {
            allNodes[i] = nodes[nodeAddresses[i]];
        }
        return allNodes;
    }
}
