import { keccak256 } from "ethers";
import { ethers } from "hardhat";

async function main() {

  const appId = "app_staging_8483971b3b9a3a9c239bf16987cbf618";
  const worldId = "0x05C4AE6bC33e6308004a47EbFa99E5Abb4133f86";
  const actionId = "vote_1";
  const socrate = await ethers.deployContract("SocratesVoting", [appId, worldId, actionId]);

  await socrate.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
