import { config } from "https://deno.land/x/dotenv@v3.1.0/mod.ts";
import { ethers } from "https://esm.sh/ethers?dts";

const { INFURA_PROJECT_ID } = config();
const [address] = Deno.args;

if (!address) {
  console.log("address is not defined in args.");
  Deno.exit(1);
}

const infura = `wss://ropsten.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
const provider = new ethers.providers.WebSocketProvider(infura);

const blockNumber = await provider.getBlockNumber();
console.log("blockNumber:", blockNumber);

// provider.on("block", (blockNumber) => {
//   // Emitted on every block change
//   console.log("blockNumber:", blockNumber);
// });

provider.on("pending", async (txHash) => {
  const tx = await provider.getTransaction(txHash);
  if (tx && [tx.from, tx.to].includes(address)) {
    console.log(`${address} is working!!`);
    console.log(tx);
    console.log(`etherscan: https://ropsten.etherscan.io/tx/${tx.hash}`);
    console.log("value:", tx.value.toString().padStart(4, "0"));
  }
});

// Deno.exit(0);
