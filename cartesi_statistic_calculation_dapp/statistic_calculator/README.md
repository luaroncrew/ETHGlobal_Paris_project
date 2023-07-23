# Cartesi statistic calculator
built on version 0.9

inputs:
- string: calculation method
- array: vote information (extracted from the blockchain)

outputs:
- float: statistic

## Why Cartesi?

Cartesi allows Socrate to make vote calculations off-chain and verify
their result on chain. When the calculation becomes complex, Cartesi can speed up the calculation and 
save gas for the execution.

In the application you can find a basic implementation of some
vote statistic calculation algorithms:

```python
voting_algorithms = {
    'weighted_for_maths': math_expert_weighted_votes,
    '42': get_mock_vote_statistic,
    'uniform': uniform_vote
}
```

these functions can be found in the `statistic_calculator.py`

The calculator must be called from one of the frontend applications of Socrate by its url 
address via an http request, like (in case you run on the local machine):

http://localhost:5005/inspect/

## Useful commands:

build the image
```shell
docker buildx bake -f docker-bake.hcl -f docker-bake.override.hcl --load
```

run the image:
```shell
docker compose -f ./docker-compose-base.yml -f ./docker-compose.override.yml up
```

remove the image volumes !important
```shell
docker compose -f ./docker-compose-base.yml -f ./docker-compose.override.yml down -v
```

in another terminal instance* get filtered logs of the application"
```shell
docker compose -f ./docker-compose-base.yml -f ./docker-compose.override.yml logs -f server_manager
```
