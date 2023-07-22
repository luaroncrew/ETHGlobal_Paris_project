// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IWorldID {
    function verifyProof(
        uint256 groupId,
        uint256 root,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view returns (bool);
}

contract SocratesVoting {
    
    struct Vote {
        string identifier;
        string data_piece;
        uint8 vote; // uint8 is used to store values between 0 and 1 (inclusive)
    }

    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The address of the World ID Router contract that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The keccak256 hash of the externalNullifier (unique identifier of the action performed), combination of appId and action
    uint256 internal immutable externalNullifierHash;

    /// @dev The World ID group ID (1 for Orb-verified, 0 for Phone-verified)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    Vote[] public votes;

    /// @param _worldId The WorldID instance that will verify the proofs
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) {
        worldId = _worldId;
        externalNullifierHash = hashToField(abi
            .encodePacked(hashToField(abi.encodePacked(_appId)), _actionId));
        
    }

    /// @param signal An arbitrary input from the user that cannot be tampered with. In this case, it is the user's wallet address.
    /// @param root The root (returned by the IDKit widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the IDKit widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the IDKit widget).
    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        string memory identifier,
        string memory data_piece, 
        uint8 voteValue
    ) public {

        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        require(voteValue <= 1, "Vote value must be 0 or 1");

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            1,
            hashToField(abi.encodePacked(signal)),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // Function to vote and append a new object to "votes" array
        Vote memory newVote = Vote({
            identifier: identifier,
            data_piece: data_piece,
            vote: voteValue
        });
        
        votes.push(newVote);
        // We now record the user has done this, so they can't do it again (sybil-resistance)
        nullifierHashes[nullifierHash] = true;
    }

    // Function to read and return all the votes
    function getVotes() public view returns (Vote[] memory) {
        return votes;
    }
}