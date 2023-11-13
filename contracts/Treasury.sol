// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IVault.sol";


error TREASURY_UNRECOGNISED_TOKEN();


/// @title Treasury Contract
/// @notice This contract manages the deposits and withdrawals of stablecoins (DAI, USDT, USDC) into various vaults to generate yield.
/// @dev The contract uses OpenZeppelin's Context for ownership management and IERC20 for token interactions.
contract Treasury is Context {
    
    /// @notice The contract owner's address, set at contract deployment.
    address immutable owner ;
    /// @notice Addresses for the stablecoin tokens: DAI, USDT, USDC.
    address public immutable DAI;
    address public immutable USDT ;
    address public immutable USDC ;

    /// @notice Array of vault addresses where funds are deposited.
    address[] public vaults;

    /// @notice Struct to keep track of individual stablecoin balances.
    struct Coins{
        uint256 dai;
        uint256 usdc;
        uint256 usdt;
    }
     /// @notice Struct to track the yield information for each vault.
    struct Yield{
        uint256 amountAllocated;
        uint256 amountRecieved;
        uint256 yeildGenerated;
        address coinAddr;
    }
    /// @notice Enum for identifying the type of coin.
    enum Coin {
        DAI,
        USDT,
        USDC
    }

    /// @notice Mapping to track the allocation percentages for each vault.
    mapping(address => Coins) public protocolAllocation;

    /// @notice Mapping to track the user funds in the contract.
    mapping(address => Coins) public userFunds;

     /// @notice Mapping to keep track of yield per vault.
    mapping (address => Yield) public yeildPerVault;
    /// @notice Event emitted when a user deposits tokens.
    event UserDeposit(address indexed staker,uint256 indexed amount ,Coin tokenRecieved);
    /// @notice Event emitted when tokens are deposited into a vault.
    event VaultDeposit(address indexed vault,uint256 indexed amount, Coin tokenSubmit);
    /// @notice Event emitted when tokens are withdrawn from a vault.
    event VaultWithdraw(address indexed vault,uint256 indexed amountRecieved);


    modifier onlyOwner {
        require(_msgSender() == owner,"Treasury: User is not the Owner!");
        _;        
    }

    /// @notice Constructor to initialize the Treasury contract with token addresses.
    constructor(address daiTokenAddr, address usdtTokenAddr,address usdcTokenAddr){
        DAI = daiTokenAddr;
        USDT = usdtTokenAddr;
        USDC = usdcTokenAddr;
        owner = _msgSender();
    }
    /// @dev Internal function to handle fund transfers to vaults.
    function _transferFunds(address token,address vault, uint256 amount) private {
        require(IERC20(token).approve(vault,amount), "Approval failed");
        IVault(vault).depositAll();
        yeildPerVault[vault].amountAllocated = amount;
    }
    /** 
     * @notice Sets the allocation percentages for a given vault.
     * @param vault The address of the vault.
     * @param daiPercentage Percentage allocation for DAI.
     * @param usdcPercentage Percentage allocation for USDC.
     * @param usdtPercentage Percentage allocation for USDT.
    **/
    function setAllocation(address vault, uint256 daiPercentage , uint256 usdcPercentage , uint256 usdtPercentage) public onlyOwner {
        protocolAllocation[vault] = Coins(daiPercentage,usdtPercentage,usdcPercentage);
        vaults.push(vault);
    }

    /// @notice Allows users to deposit tokens into the Treasury.
    /// @param token The address of the token to deposit.
    /// @param amount The amount of tokens to deposit.
    function depositToken(address token, uint256 amount) external {
        IERC20(token).transferFrom(_msgSender(),address(this),amount);
        Coin Id;
        if(token == DAI){
            userFunds[_msgSender()].dai = amount;
            Id = Coin.DAI;
        }
        else if(token == USDC){
            userFunds[_msgSender()].usdc = amount;
            Id = Coin.USDC;
        }
        else if(token == USDT){
            userFunds[_msgSender()].usdt = amount;
            Id = Coin.USDT;
        }
        else {
            revert TREASURY_UNRECOGNISED_TOKEN();
        }

        emit UserDeposit(_msgSender(),amount,Id);
    }

    /// @notice Deposits tokens from the Treasury to a specific protocol (vault).
    /// @param token The address of the token to deposit.
    /// @param vault The address of the vault to deposit into.
    function depositToProtocol(address token, address vault) public onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 amount;
        if(token == DAI){
            amount = (balance * protocolAllocation[vault].dai) /  100;
            _transferFunds(token,vault,balance);
            yeildPerVault[vault].coinAddr = DAI;
            emit VaultDeposit(vault,amount,Coin.DAI);
        }
        else if(token == USDT){
            amount = (balance * protocolAllocation[vault].usdt) /  100;
            _transferFunds(token,vault,amount);
            yeildPerVault[vault].coinAddr = USDT;
            emit VaultDeposit(vault,amount,Coin.USDT);
        }
        else if(token == USDC){
            amount = (balance * protocolAllocation[vault].usdc) /  1000;
            _transferFunds(token,vault,amount);
            yeildPerVault[vault].coinAddr = USDC;
            emit VaultDeposit(vault,amount,Coin.USDC);
        }
        else{
             revert TREASURY_UNRECOGNISED_TOKEN();
        }        
    }   

     /// @notice Withdraws all funds from a specific vault.
    /// @param vault The address of the vault to withdraw from.
    function withdrawFromProtocol(address vault) public onlyOwner {
        address token = yeildPerVault[vault].coinAddr;
        uint256 balanceBeforeWitdrawal = IERC20(token).balanceOf(address(this));
        IVault(vault).withdrawAll();
        uint256 balanceAfterWithdrawal = IERC20(token).balanceOf(address(this));

        uint256 diff = balanceAfterWithdrawal - balanceBeforeWitdrawal;
        yeildPerVault[vault].amountRecieved = diff;
        yeildPerVault[vault].yeildGenerated = (diff * 100) / yeildPerVault[vault].amountAllocated;

        emit VaultWithdraw(vault,diff); 

    }
    /// @notice Withdraws a specific token from the Treasury to the owner.
    /// @param token The address of the token to withdraw.
    function withdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));      
        require(IERC20(token).transferFrom(address(this),owner,balance),"Treasury: Transfer failed");
    }   
     /// @notice Calculates the total yield generated by all vaults.
    /// @return totalYield The total yield generated.
    function calculateTotalYield() external view returns (uint256 totalYield) {
        for (uint i = 0; i < vaults.length; i++) {
            totalYield += yeildPerVault[vaults[i]].yeildGenerated;
        }
    }
}
