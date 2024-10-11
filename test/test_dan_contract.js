const DanContract = artifacts.require('DanContract');

contract('DanContract', (accounts) => {
    let instance;

    before(async () => {
        instance = await DanContract.deployed();
    });

    it('should add a new node', async () => {
        await instance.addNode("Node1", { from: accounts[0] });
        const node = await instance.nodes(accounts[0]);
        assert.equal(node.nodeName, "Node1", "Node name should match");
    });

    it('should retrieve all nodes', async () => {
        const nodes = await instance.getNodes();
        assert.equal(nodes.length, 1, "Should retrieve one node");
    });

    it('should remove a node', async () => {
        await instance.removeNode({ from: accounts[0] });
        const node = await instance.nodes(accounts[0]);
        assert.equal(node.active, false, "Node should be inactive");
    });
});
