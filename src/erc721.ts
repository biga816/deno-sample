import { config } from "https://deno.land/x/dotenv@v3.1.0/mod.ts";
import { ethers } from "https://esm.sh/ethers?dts";

import { sendLineNotify } from "./utils/line-helper.ts";

const { INFURA_PROJECT_ID } = config();

// const infura = `wss://ropsten.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
const infura = `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
const provider = new ethers.providers.WebSocketProvider(infura);

const blockNumber = await provider.getBlockNumber();
console.log("blockNumber:", blockNumber);

// const address = "0x20fe562d797a42dcb3399062ae9546cd06f63280"; // Link Token
const address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"; // CryptoPunks

const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event PunkTransfer(address indexed from, address indexed to, uint256 punkIndex)",
  "event PunkBought(uint indexed punkIndex, uint value, address indexed fromAddress, address indexed toAddress)",
];

const erc721 = new ethers.Contract(address, abi, provider);

erc721.on("PunkTransfer", (owner, to, punkIndex, event) => {
  const { transactionHash } = event;
  const msg = `${punkIndex} was transferd from ${owner} to ${to}.`;
  console.log(msg);
  console.log(`etherscan: https://etherscan.io/tx/${transactionHash}`);

  const punkIndexStr = punkIndex.toString().padStart(4, "0");
  console.log(
    `url: https://www.larvalabs.com/public/images/cryptopunks/${punkIndexStr}.png`
  );

  sendLineNotify(msg);
});

erc721.on("PunkBought", (punkIndex, value, owner, to, event) => {
  const { transactionHash } = event;
  const msg = `${punkIndex} was bought from ${owner} to ${to} for ${value} wei.`;
  console.log(msg);
  console.log(`etherscan: https://etherscan.io/tx/${transactionHash}`);

  const punkIndexStr = punkIndex.toString().padStart(4, "0");
  console.log(
    `url: https://www.larvalabs.com/public/images/cryptopunks/${punkIndexStr}.png`
  );

  sendLineNotify(msg);
});

// Deno.exit(0);
