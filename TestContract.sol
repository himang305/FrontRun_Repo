// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestTokenWAirdrop is ERC20, Pausable, Ownable {

    mapping(address => uint256) public airdropRecord;

    event AirdropWithdraw(address user, uint256 amount);

    constructor() ERC20("TestToken", "TT") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function airdrop(address[] calldata _user, uint256[] calldata _amounts) external onlyOwner{
        for(uint i=0; i<_user.length; i++){
            airdropRecord[_user[i]] += _amounts[i];
        }
    }

    function withdraw() external whenNotPaused{
        address user = msg.sender;
        uint amount = airdropRecord[user];
         _mint(user, airdropRecord[user]);
         airdropRecord[user] = 0;
         emit AirdropWithdraw(user, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}