"""
An class implementing a majority voting algorithm.
"""


from scipy.stats import ttest_1samp
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
            subject: str,
            pvalue: float
    ):
        """
        Return the score of the vote on the given subject.

        Arguments
        ---------
        - subject: the subject on which the vote is comptabilized
        - pvalue: the minimal pvalue of the system
        """
        votes = list(self._votes[subject].values())
        computed_pvalue = ttest_1samp(
                votes,
                0.5,
                alternative='less'
        ).pvalue
        print(computed_pvalue, pvalue)
        return computed_pvalue > pvalue
