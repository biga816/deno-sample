import { config } from "https://deno.land/x/dotenv@v3.1.0/mod.ts";
import { ethers } from "https://esm.sh/ethers?dts";

const { INFURA_PROJECT_ID } = config();

// const infura = `wss://ropsten.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
const infura = `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
const provider = new ethers.providers.WebSocketProvider(infura);

const blockNumber = await provider.getBlockNumber();
console.log("blockNumber:", blockNumber);

// const address = "0x20fe562d797a42dcb3399062ae9546cd06f63280"; // Link Token
const address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"; // CryptoPunks

const abi = [
  // "event Transfer(address indexed from, address indexed to, uint amount)",
  // "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];

const erc721 = new ethers.Contract(address, abi, provider);

erc721.on("Transfer", (owner, to, tokenId, event) => {
  const { transactionHash } = event;
  console.log(`${tokenId} was transferd from ${owner} to ${to}.`);
  console.log(`etherscan: https://etherscan.io/tx/${transactionHash}`);

  const tokenIdStr = tokenId.toString().padStart(4, "0");
  console.log(
    `url: https://www.larvalabs.com/public/images/cryptopunks/${tokenIdStr}.png`
  );
});

// Deno.exit(0);
