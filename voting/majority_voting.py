"""
An class implementing a majority voting algorithm.
"""


from voting import AbstractVoteAlgo


class MajorityVoteAlgo(AbstractVoteAlgo):
    """
    An algorithm that implements a majority vote.
    """

    def __init__(
            self,
            raw_data: str
    ):
        super().__init__(raw_data)


    def get_result(
            self,
            subject: str
    ):
        """
        Return the score of the vote on the given subject.

        Arguments
        ---------
        - subject: the subject on which the vote is comptabilized
        """
        votes = self._votes[subject]
        return sum(votes.values()) / len(votes)
