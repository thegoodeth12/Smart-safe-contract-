// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract SmartSafeContract {
    address[] public owners;
    uint256 public threshold;
    mapping(address => bool) public isOwner;
    uint256 public nonce;

    // Events
    event ExecutionSuccess(bytes32 txHash);
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event ThresholdChanged(uint256 newThreshold);

    // Modifier to restrict access to owners
    modifier onlyOwners() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    // Modifier to ensure threshold is valid
    modifier validThreshold(uint256 _threshold) {
        require(_threshold > 0 && _threshold <= owners.length, "Invalid threshold");
        _;
    }

    // Constructor to initialize with owners and threshold
    constructor(address[] memory _owners, uint256 _threshold) {
        require(_owners.length > 0, "Owners required");
        require(_threshold > 0 && _threshold <= _owners.length, "Invalid threshold");

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Duplicate owner");
            isOwner[owner] = true;
            owners.push(owner);
        }
        threshold = _threshold;
    }

    // Function to execute a transaction if threshold is met
    function execute(address to, uint256 value, bytes memory data) public onlyOwners returns (bool) {
        require(to != address(0), "Invalid address");
        nonce++; // Simple nonce to prevent replay attacks

        // Simulate multi-signature approval (in a real safe, this would involve a queue)
        (bool success, ) = to.call{value: value}(data);
        require(success, "Execution failed");

        emit ExecutionSuccess(keccak256(abi.encodePacked(to, value, data, nonce)));
        return true;
    }

    // Add a new owner (requires threshold approval in a real implementation)
    function addOwner(address _owner) public onlyOwners {
        require(_owner != address(0), "Invalid owner");
        require(!isOwner[_owner], "Owner already exists");
        isOwner[_owner] = true;
        owners.push(_owner);
        emit OwnerAdded(_owner);
    }

    // Remove an owner (requires threshold approval)
    function removeOwner(address _owner) public onlyOwners {
        require(isOwner[_owner], "Not an owner");
        require(owners.length > 1, "Cannot remove last owner");
        isOwner[_owner] = false;
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == _owner) {
                owners[i] = owners[owners.length - 1];
                owners.pop();
                break;
            }
        }
        if (threshold > owners.length) {
            threshold = owners.length;
        }
        emit OwnerRemoved(_owner);
    }

    // Change the threshold (requires threshold approval)
    function changeThreshold(uint256 _threshold) public onlyOwners validThreshold(_threshold) {
        threshold = _threshold;
        emit ThresholdChanged(_threshold);
    }

    // Get the list of owners
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}
