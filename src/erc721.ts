import { config } from "https://deno.land/x/dotenv@v3.1.0/mod.ts";
import { ethers } from "https://esm.sh/ethers?dts";

import { sendLineNotify } from "./utils/line-helper.ts";

const { INFURA_URL, CONTRACT_ADDRESS } = config();

const provider = new ethers.providers.WebSocketProvider(INFURA_URL);
const blockNumber = await provider.getBlockNumber();
console.log("blockNumber:", blockNumber);

const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event PunkTransfer(address indexed from, address indexed to, uint256 punkIndex)",
  "event PunkBought(uint indexed punkIndex, uint value, address indexed fromAddress, address indexed toAddress)",
  "event PunkOffered(uint indexed punkIndex, uint minValue, address indexed toAddress)",
];

const sendNotify = async (
  msg: string,
  transactionHash: string,
  punkIndex: number
): Promise<void> => {
  console.log(msg);
  console.log(`https://etherscan.io/tx/${transactionHash}`);

  const punkIndexStr = punkIndex.toString().padStart(4, "0");
  console.log(
    `https://www.larvalabs.com/public/images/cryptopunks/${punkIndexStr}.png`
  );

  await sendLineNotify(msg);
};

const erc721 = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

erc721.on("PunkTransfer", (owner, to, punkIndex, { transactionHash }) => {
  const msg = `PunkTransfer: ${punkIndex} was transferd from ${owner} to ${to}.`;
  sendNotify(msg, transactionHash, punkIndex);
});

erc721.on("PunkBought", (punkIndex, value, owner, to, { transactionHash }) => {
  const msg = `PunkBought: ${punkIndex} was bought from ${owner} to ${to} for ${value} wei.`;
  sendNotify(msg, transactionHash, punkIndex);
});

erc721.on("PunkOffered", (punkIndex, minValue, to, { transactionHash }) => {
  const msg = `PunkOffered: ${punkIndex} was offerd from ${to} for ${minValue} wei.`;
  sendNotify(msg, transactionHash, punkIndex);
});
