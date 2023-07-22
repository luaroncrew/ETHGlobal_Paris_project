"""
An abstract class for voting algorithms.
"""


import json


class AbstractVoteAlgo:
    """
    An abstract vote algorithm

    Arguments
    ---------
    - raw_data: a serialized JSON object associating to each subject and each
      voter a unique vote. The value of each vote must be comprised between 0
      and 1.

    Attributes
    ----------
    - votes: the deserialized database of votes
    """

    def __init__(
            self,
            raw_data: str,
    ):
        self._votes = json.loads(raw_data)

    def get_result(
            self,
            subject: str,
            pvalue: float
    ):
        """
        Return the score of the vote on the given subject.

        Arguments
        ---------
        - subject: the subject on which the vote is comptabilized
        """
        return NotImplemented
