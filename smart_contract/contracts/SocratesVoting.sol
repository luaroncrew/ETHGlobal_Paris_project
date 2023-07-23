// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Interface needed to use Worldcoin ID feature to verify the votes
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
    
    // A vote consists in an identifier (i.e. the voter), a data piece and the
    // weight given to the vote
    struct Vote {
        string identifier;
        string data_piece;
        uint8 vote; // uint8 is used to store values between 0 and 1 (inclusive)
        address caller;
    }

    // Function to hash a value to a field element, used for converting data
    // to uint256
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }

    // Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    // The address of the World ID Router contract that will be used for verifying proofs
    IWorldID internal immutable worldId;

    // The keccak256 hash of the externalNullifier (unique identifier of the action performed), combination of appId and action
    uint256 internal immutable externalNullifierHash;

    // The World ID group ID (1 for Orb-verified, 0 for Phone-verified)
    uint256 internal immutable groupId = 1;

    // Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    // Array storing the votes
    Vote[] public votes;

    // _worldId: The WorldID instance that will verify the proofs
    // _appId: The World ID app ID
    // _actionId: The World ID action ID
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) {
        worldId = _worldId;
        externalNullifierHash = hashToField(abi
            .encodePacked(hashToField(abi.encodePacked(_appId)), _actionId));
        
    }

    // Verify and execute a vote.
    //
    // signal: An arbitrary input from the user that cannot be tampered with. In this case, it is the user's wallet address.
    // root: The root (returned by the IDKit widget).
    // nullifierHash: The nullifier hash for this proof, preventing double signaling (returned by the IDKit widget).
    // proof: The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the IDKit widget).
    // identifier: identifier of the voter
    // data_piece: object of the vote
    // voteValue: value of the vote
    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        string memory identifier,
        string memory data_piece, 
        uint8 voteValue
    ) public {

        // First, we make sure that each voter can only vote once
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // Record the nullifier hash of the voter to counter Sibyl attacks
        nullifierHashes[nullifierHash] = true;

	// The vote value should be comprised between 0 and 1
        require(voteValue <= 1, "Vote value must be 0 or 1");

        // Then, we use Worldcoin's samart contract to verify the validity of
	// the zero-knowledge proof
        worldId.verifyProof(
            root,
            1,
            hashToField(abi.encodePacked(signal)),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // Append the vote to the list of all votes
        Vote memory newVote = Vote({
            identifier: identifier,
            data_piece: data_piece,
            vote: voteValue,
            caller: msg.sender
        });
        votes.push(newVote);
    }

    // Return all the votes
    function getVotes() public view returns (Vote[] memory) {
        return votes;
    }
}
