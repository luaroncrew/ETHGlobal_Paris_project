# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample
contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Contract overview

The idea behind this smart contract is to collect votes from the users.
Of course, it is needed to check the validity of those votes, and to protect
the campaign of vote from Sybil attacks.
In order to achieve this level of security, we are using Worldcoin ID
technology.
