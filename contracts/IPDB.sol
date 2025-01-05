// SPDX-License-Identifier: MIT

// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IPDB {
    // Mapping từ địa chỉ người dùng đến IPFS hash của họ
    mapping(address => string) private userProfiles;

    // Event khi profile được cập nhật
    event ProfileUpdated(address indexed user, string newProfileHash);

    // Cập nhật hoặc tạo mới profile
    function setProfile(string memory _profileHash) public {
        userProfiles[msg.sender] = _profileHash;
        emit ProfileUpdated(msg.sender, _profileHash);
    }

    // Lấy profile hash của một địa chỉ
    function getProfile(address _user) public view returns (string memory) {
        return userProfiles[_user];
    }
}
