// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title IVault Interface
/// @notice Interface for interacting with Beefy Finance's Yield Optimizer vaults.
/// @dev This interface allows for depositing to and withdrawing from Beefy vaults.
 /// Each deposit returns mooTokens, representing the depositor's share in the vault.
interface IVault {
    /// @notice Deposit a specific amount of tokens into the vault.
    /// @param amount The amount of tokens to deposit.
    function deposit(uint256 amount) external ;

    /// @notice Deposit all tokens of the specified type held by the contract into the vault.
    function depositAll() external;

    /// @notice Withdraw all tokens of the specified type from the vault.
    function withdrawAll() external;
}