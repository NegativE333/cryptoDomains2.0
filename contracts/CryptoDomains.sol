// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CryptoDomains is ERC721 {
    uint256 public maxSupply;
    uint256 public totalSupply;
    address public owner;

    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
        address ownerAddress;
        bool isForSale;
    }

    mapping(uint256 => Domain) domains;
    mapping(address => string[]) userDomains; // Map user addresses to their domain names

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        owner = msg.sender;
    }

    function list(string memory _name, uint256 _cost) public {
        maxSupply++;
        domains[maxSupply] = Domain(_name, _cost, false, address(0), false);
    }

    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= maxSupply);
        require(domains[_id].isOwned == false);
        require(msg.value >= domains[_id].cost);

        domains[_id].isOwned = true;
        domains[_id].ownerAddress = msg.sender;
        totalSupply++;

        // Add the domain name to the user's owned domains
        userDomains[msg.sender].push(domains[_id].name);

        _safeMint(msg.sender, _id);
    }

    function getDomain(uint256 _id) public view returns (Domain memory) {
        return domains[_id];
    }

    function getDomainByName(string memory _domainName) public view returns (Domain memory) {
        for (uint256 i = 1; i <= maxSupply; i++) {
            if (keccak256(bytes(domains[i].name)) == keccak256(bytes(_domainName))) {
                return domains[i]; // Return the domain with the matching name
            }
        }
    
        revert("Domain not found"); // Revert if the domain with the given name is not found
    }

    function getDomainIdByName(string memory _domainName) public view returns (uint256) {
        for (uint256 i = 1; i <= maxSupply; i++) {
            if (keccak256(bytes(domains[i].name)) == keccak256(bytes(_domainName))) {
                return i; // Return the domain ID with the matching name
            }
        }

        revert("Domain not found"); // Revert if the domain with the given name is not found
    }

    function isDomainListed(string memory _domainName) public view returns (bool) {
        for (uint256 i = 1; i <= maxSupply; i++) {
            if (keccak256(bytes(domains[i].name)) == keccak256(bytes(_domainName))) {
                return true; // The domain is listed
            }
        }
        return false; // The domain is not listed
    }

    function isDomainTaken(string memory _domainName) public view returns (bool) {
        for (uint256 i = 1; i <= maxSupply; i++) {
            if (keccak256(bytes(domains[i].name)) == keccak256(bytes(_domainName)) && domains[i].isOwned) {
                    return true; // The domain is taken
            }
        }
        return false; // The domain is not taken
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function transferOwnership(uint256 _id, address _newOwner) public {
        require(domains[_id].isOwned, "Domain is not owned");
        require(domains[_id].ownerAddress == msg.sender, "Only the owner can transfer ownership");

        // Transfer ownership of the domain
        domains[_id].ownerAddress = _newOwner;

        // Remove the domain from the current owner's list
        string[] storage ownedDomains = userDomains[msg.sender];
        for (uint256 i = 0; i < ownedDomains.length; i++) {
            if (keccak256(bytes(ownedDomains[i])) == keccak256(bytes(domains[_id].name))) {
                ownedDomains[i] = ownedDomains[ownedDomains.length - 1];
                ownedDomains.pop();
                break;
            }
        }

        // Add the domain to the new owner's list
        userDomains[_newOwner].push(domains[_id].name);
    }

    function listDomainForSale(uint256 _id, uint256 _price) public {
        require(domains[_id].isOwned, "Domain is not owned");
        require(domains[_id].ownerAddress == msg.sender, "Only the owner can list for sale");

        // Set the domain for sale and specify the price
        domains[_id].isForSale = true;
        domains[_id].cost = _price;
    }

    function buyDomain(uint256 _id) public payable {
        require(domains[_id].isForSale, "Domain is not for sale");
        require(msg.value >= domains[_id].cost, "Insufficient funds to purchase");

        // Transfer ownership to the buyer
        address previousOwner = domains[_id].ownerAddress;
        domains[_id].ownerAddress = msg.sender;
        domains[_id].isForSale = false;
        totalSupply++;

        // Remove the domain from the previous owner's list
        string[] storage ownedDomains = userDomains[previousOwner];
        for (uint256 i = 0; i < ownedDomains.length; i++) {
            if (keccak256(bytes(ownedDomains[i])) == keccak256(bytes(domains[_id].name))) {
                ownedDomains[i] = ownedDomains[ownedDomains.length - 1];
                ownedDomains.pop();
                break;
            }
        }

        // Add the domain to the buyer's list
        userDomains[msg.sender].push(domains[_id].name);

        // Transfer funds to the previous owner
        payable(previousOwner).transfer(msg.value);
    }

    function getUserDomains() public view returns (string[] memory) {
        return userDomains[msg.sender];
    }
}
