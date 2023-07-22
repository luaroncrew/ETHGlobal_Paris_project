// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SocratesVoting {
    
    struct Vote {
        string identifier;
        string data_piece;
        uint8 vote; // uint8 is used to store values between 0 and 1 (inclusive)
    }

    /// @param signal An arbitrary input from the user that cannot be tampered with. In this case, it is the user's wallet address.
    /// @param root The root (returned by the IDKit widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the IDKit widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the IDKit widget).
    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            groupId, // set to "1"
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // We now record the user has done this, so they can't do it again (sybil-resistance)
        nullifierHashes[nullifierHash] = true;

        // Finally, execute your logic here, knowing the user is verified
        
        Vote[] public votes; // The array to store votes
        mapping(string => mapping(string => bool)) private hasVoted; // Mapping to keep track of votes for each identifier and data piece

        // Function to vote and append a new object to "votes" array
        function vote(string memory identifier, string memory data_piece, uint8 voteValue) public {
            require(voteValue <= 1, "Vote value must be 0 or 1");
            require(!hasVoted[identifier][data_piece], "You have already voted for this data piece.");
            
            Vote memory newVote = Vote({
                identifier: identifier,
                data_piece: data_piece,
                vote: voteValue
            });
            
            votes.push(newVote);
            hasVoted[identifier][data_piece] = true;
        }
    }

    // Function to read and return all the votes
    function getVotes() public view returns (Vote[] memory) {
        return votes;
    }
}