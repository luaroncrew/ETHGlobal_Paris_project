import { Component } from '@angular/core';

function hex2a(hexx: string) {
  var hex = hexx.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

/**
 * this function allows to fetch the data from the EAS indexer and verify the expertise of
 * one of the addresses from the voters list
 */
async function fetchAttestations() {
  const url = 'https://sepolia.easscan.org/graphql';
  const headers = {
    'Content-Type': 'application/json',
  };

  const data = {
    query: `
      query Attestation {
  attestation(
    where: { id: "0x5b4962318b85a0a5d2990ca4d92b4fc50623893c45bb415532813c04425ace97" }
  ) {
    id
    attester
    recipient
    refUID
    revocable
    revocationTime
    expirationTime
    data
  }
}
    `,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'basicObservationFrontend';
  rate: boolean = false
  inspectURL: string = 'http://localhost:5005/inspect/'
  statistic: string = ""

  selectedDataPiece: string = ""

  selectedCalculationMethod: string = ""

  constructor() {
  }
  observeTab() {
    this.rate = false
  }
  rateTab() {
    this.rate = true
  }

  voteFalse() {
    // SC call for voting false
  }

  voteTrue() {
    // SC call for voting true
  }

  async calculate_statistic() {
    const url: string = this.inspectURL;

    // get the attestation for one of the addresses and verify it
    const attestation = await fetchAttestations();
    const mathExpert = (Boolean(Number(attestation['data']['attestation']['data'].slice(-1))))

    const mockObject = {
      calculationMethod: this.selectedCalculationMethod,
      votes: [
        {
          data: 1,
          address: '0x9FA746b844747f77c6C54F4f88ab71048c608864',
          vote: 1,
          math_expert: mathExpert // this parameter is verified with the attestation signed on-chain
        },
        {
          data: 1,
          address: '0xkjhre2193u1dfd',
          math_expert: false,
          vote: 0
        },
        {
          data: 1,
          address: '0x9FA746b844747f77c6C54F4f88ab71048c608864',
          math_expert: false,
          vote: 0
        },
        {
          data: 1,
          address: '0xkjhredf2193u12d',
          math_expert: false,
          vote: 0.5
        },
        {
          data: 1,
          address: '0xkjhrdfse2193u12d',
          math_expert: true,
          vote: 1
        },
        {
          data: 1,
          address: '0xkjhrdfse2193u12d',
          math_expert: true,
          vote: 0
        },
        {
          data: 1,
          address: '0xkjhrdfse2193u12d',
          math_expert: true,
          vote: 0.3
        }
      ]
    }

    // adding the JSON payload to the request
    const response = await fetch(url + JSON.stringify(mockObject));
    const response_contents = await response.json();
    console.log(response_contents)
    this.statistic = hex2a(response_contents['reports'][0]['payload']).split(':')[1].slice(0, -1);
  }
}
