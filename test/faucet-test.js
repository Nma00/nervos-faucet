const { expect } = require("chai");
const { ethers } = require("hardhat");

const overrides = { gasLimit: 300000 };

const godWokenUrl = "https://godwoken-testnet-web3-v1-rpc.ckbapp.dev";

// Private key unsafe user MM
const privateKey = "72483587cdfc82a43cd770661f720c5c2e5bcc57324c7bf3749d3d6f78df81b1";

// Addresses tokens sur Godwoken Testnet
const addrTokenA = "0xD29cb1824544C30AEa1F22443e9DCF688ecA0bE4"; 
const addrTokenB = "0xD2Da53D65C362E81C0580C5441baaDD16d4c7D48";

let provider, signer, tokenA, tokenB;

async function showBalance(addr) {
  console.log(`${addr} balance :`)
  console.log("CKB", ethers.utils.formatUnits(await provider.getBalance(addr), 8));    
  let balanceA = await tokenA.balanceOf(addr);
  let balanceB = await tokenB.balanceOf(addr);
  console.log("TokenA", ethers.utils.formatUnits(balanceA));    
  console.log("TokenB", ethers.utils.formatUnits(balanceB)); 
};

before(async function () {
  
  provider = new ethers.providers.JsonRpcProvider(godWokenUrl);
  signer = new ethers.Wallet(privateKey, provider);

  console.log("Signer:", signer.address);
  
  const abiToken = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount)",
    "function mint(address account, uint256 amount)"
  ];

  tokenA = new ethers.Contract(addrTokenA, abiToken, signer);
  tokenB = new ethers.Contract(addrTokenB, abiToken, signer);
  
  console.log("TokenA deployed to :", tokenA.address);
  console.log(await tokenA.name());
  console.log(await tokenA.symbol());
  console.log("TokenB deployed to :", tokenB.address);
  console.log(await tokenB.name());
  console.log(await tokenB.symbol());

});

describe("Faucet Test 2", function () {
  it("IT Faucet 2", async function () {
    
    // Unsafe account MM
    let account = "0xb6d6859d4BC21F1dEdE6eE6c314DFF8d4fCE0ECf";
      
    await showBalance(signer.address);
    
    await showBalance(account);

    const tx = await tokenA.mint(account, 2000, overrides);
    await tx.wait();

    await showBalance(account);

  });
});
