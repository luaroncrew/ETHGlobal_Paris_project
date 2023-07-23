# Socrates
Socrates is a credibility
quantification protocol
that enables greater objectivity
when making decisions about the
truth or falsity of information.

![](assets/logo.png)



## Architecture overview
![](assets/Socrates.png)

The philosophy behind Socrates is its modularity. With Socrates you can verify any kind 

## Technologies used
- Ethereum testnet (voting smart contract)
- Worldcoin (for unique identity)
- Cartesi (for off-chain vote statistic calculation)
- EAS (for weighted votes)

In this repository you can find different parts of the application:
- `/basic_rate_observation_frontend` An example of the observation frontend application
(AES implementation and Cartesi calls can be found there)
- `/smart_contract` Solidity smart contract allowing people to vote
- `cartesi_statistic_calculation_dapp` An example of a voting algorithm plugin