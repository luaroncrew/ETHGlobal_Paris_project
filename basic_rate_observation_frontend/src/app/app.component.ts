import { Component } from '@angular/core';
import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { getDefaultProvider } from 'ethers';
import {SignerOrProvider} from "@ethereum-attestation-service/eas-sdk/dist/transaction";


function hex2a(hexx: string) {
  var hex = hexx.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

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


// in production this part must be assembled
// out of attestations from EAS and read method of Socrate protocol SC
const MOCK_VOTERS = [
  {
    data: 1,
    address: '0xkjhre2193u1dfd',
    math_expert: false,
    vote: 0
  },
  {
    data: 1,
    address: '0x9FA746b844747f77c6C54F4f88ab71048c608864', // gwenole.eth
    math_expert: false,
    vote: 0
  },
  {
    data: 1,
    address: '0xkjhredf2193u12d',
    math_expert: false,
    vote: 1
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
    vote: 1
  },
  {
    data: 1,
    address: '0xkjhrdfse2193u12d',
    math_expert: true,
    vote: 1
  },
]

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
          address: '0x9FA746b844747f77c6C54F4f88ab71048c608864', // gwen
          vote: 1,
          math_expert: mathExpert
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
