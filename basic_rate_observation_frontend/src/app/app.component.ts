import { Component } from '@angular/core';

function hex2a(hexx: string) {
  var hex = hexx.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
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
    address: '0xkjhre2193fdu12d',
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

  statisticCalculationPayload: string = ""

  selectedDataPiece: string = ""

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

    // add the payload to the body of the request according to the cartesi docs
    const response = await fetch(url);
    const response_contents = await response.json();
    this.statistic = hex2a(response_contents['reports'][0]['payload']).split(':')[1].slice(0, -1);
  }

  // async fetchAttestations(): Promise<void> {
  //   const url = 'https://easscan.org/graphql';
  //   const headers = {
  //     'Content-Type': 'application/json',
  //   };
  //
  //   const data = {
  //     query: `
  //     query Attestations {
  //       attestations(take: 25) {
  //         id
  //         attester
  //         recipient
  //         refUID
  //         revocable
  //         revocationTime
  //         expirationTime
  //         data
  //       }
  //     }
  //   `,
  //     variables: {}
  //   };
  //
  //   try {
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers,
  //       body: JSON.stringify(data),
  //     });
  //
  //     const result = await response.json();
  //     console.log(result);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // }

}
