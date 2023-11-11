// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDefiProtocol {
    function deposit(uint amount, address token) external;
    function withdraw(uint amount, address token) external;
    function calculateYield(address token) external view returns (uint);
}

contract Treasury is Ownable {
    // Example token addresses
    address constant USDC = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address constant USDT = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address constant DAI = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;

    // Mapping to track the allocation percentages
    mapping(address => uint) public allocations;

    // Array of DeFi protocols
    address[] public defiProtocols;

    function setAllocation(address protocol, uint percentage) public onlyOwner {
        allocations[protocol] = percentage;
    }

    function addDefiProtocol(address protocol) public onlyOwner {
        defiProtocols.push(protocol);
    }

    function depositToProtocol(address token, uint amount) public onlyOwner {
        require(IERC20(token).approve(address(this), amount), "Approval failed");
        uint totalAllocation;
        for (uint i = 0; i < defiProtocols.length; i++) {
            uint allocation = (amount * allocations[defiProtocols[i]]) / 100;
            IDefiProtocol(defiProtocols[i]).deposit(allocation, token);
            totalAllocation += allocation;
        }
        require(totalAllocation == amount, "Allocation mismatch");
    }

    function withdrawFromProtocol(address token, uint amount) public onlyOwner {
        for (uint i = 0; i < defiProtocols.length; i++) {
            IDefiProtocol(defiProtocols[i]).withdraw(amount, token);
        }
    }

    function calculateTotalYield() public view returns (uint totalYield) {
        for (uint i = 0; i < defiProtocols.length; i++) {
            totalYield += IDefiProtocol(defiProtocols[i]).calculateYield(USDC);
        }
    }
}
