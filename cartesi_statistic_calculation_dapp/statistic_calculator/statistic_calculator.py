import json
from os import environ
import logging
import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")


def get_mock_vote_statistic():
    return 42


MATH_EXPERTISE_FACTOR = 1.2


def math_expert_weighted_votes(votes: list):
    """
    input in format:
    votes = [
            'address': string
            'math_expert': bool,
            'vote': number
        },
        {
            'address': '0xkjhre2193u12d'
            'math_expert': False,
            'vote': 0
        },
        {
            'address': '0xkjhre2193u12d'
            'math_expert': False,
            'vote': 1
        },
        ...
    ]
    :return: float, statistic
    """
    total_score = 0
    for vote in votes:
        if vote['math_expert'] is True:
            total_score += vote['vote'] * MATH_EXPERTISE_FACTOR
        else:
            total_score += vote['vote']

    statistic = total_score / len(votes)
    return statistic


def uniform_vote(votes: list):
    """
    input in format:
    votes = [
            'address': string
            'math_expert': bool,
            'vote': number
        },
        {
            'address': '0xkjhre2193u12d'
            'math_expert': False,
            'vote': 0
        },
        {
            'address': '0xkjhre2193u12d'
            'math_expert': False,
            'vote': 1
        },
        ...
    ]
    :return: float, statistic
    """
    total_score = 0
    for vote in votes:
        total_score += vote['vote']
    statistic = total_score / len(votes)
    return statistic


voting_algorithms = {
    'weighted_for_maths': math_expert_weighted_votes,
    '42': get_mock_vote_statistic,
    'uniform': uniform_vote
}

def hex2str(hex):
    """
    Decodes a hex string into a regular string
    """
    return bytes.fromhex(hex[2:]).decode("utf-8")


def str2hex(str):
    """
    Encodes a string as a hex string
    """
    return "0x" + str.encode("utf-8").hex()


def handle_inspect(data):
    logger.info(f"Received inspect request data {data}  type: {type(data)}")
    logger.info("Adding report")

    # this must have been implemented but errors
    # in data transfer have appeared at the last moment
    # this code was responsible for the choice of the calculation method

    data = json.loads(hex2str(data['payload']))
    logger.info(data)
    chosen_algorithm = data['calculationMethod']
    votes = data['votes']
    statistic_calculation_function = voting_algorithms[str(chosen_algorithm)]
    statistic = statistic_calculation_function(votes)
    jsonstr = json.dumps({"calculated_statistic": statistic})
    response = requests.post(rollup_server + "/report", json={"payload": str2hex(jsonstr)})
    logger.info(f"Received report status {response.status_code}")
    return "accept"


handlers = {
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]

        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])