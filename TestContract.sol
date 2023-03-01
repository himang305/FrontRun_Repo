// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AirdropContract is Pausable, Ownable {
    mapping(address => uint256) public airdropRecord;

    event AirdropWithdraw(address user, uint256 amount);

    constructor() {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function airdrop(address[] calldata _user, uint256[] calldata _amounts)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < _user.length; i++) {
            airdropRecord[_user[i]] += _amounts[i];
        }
    }

    function withdraw() external whenNotPaused {
        address user = msg.sender;
        uint256 amount = airdropRecord[user];
        (bool sent, ) = user.call{value: amount}("");
        require(sent, "Failed to send Ether");
        airdropRecord[user] = 0;
        emit AirdropWithdraw(user, amount);
    }

    function receiveEther() external payable {}
}
