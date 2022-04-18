const { expect } = require("chai");
const { ethers } = require("hardhat");

const overrides = { gasLimit: 300000 };

let signer, tokenA, tokenB;

async function showBalance(account) {
  console.log(`${account.address} balance :`)
  console.log("CKB", ethers.utils.formatUnits(await account.getBalance(), 8));    
  for (let token of [tokenA, tokenB]) {
      let name = await token.name(), balance = await token.balanceOf(account.address);
      console.log(name, ethers.utils.formatUnits(balance));    
  }
};

before(async function () {
  [signer, account1] = await ethers.getSigners();
  console.log("Signer:", signer.address);
  console.log("Account 1:", account1.address);

  const TokenA = await ethers.getContractFactory("TokenA");
  tokenA = await TokenA.deploy();
  await tokenA.deployed();
  console.log("TokenA deployed to:", tokenA.address);

  const TokenB = await ethers.getContractFactory("TokenB");
  tokenB = await TokenB.deploy();
  await tokenB.deployed();
  console.log(`TokenB deployed to: ${tokenB.address}\n`);
});

describe("Faucet", function () {
  it("IT Faucet", async function () {
      
    await showBalance(signer);

    await showBalance(account1);

    const tx = await tokenA.mint(account1.address, 2000, overrides);
    await tx.wait();

    const balance = await tokenA.balanceOf(account1.address);
    const twoThousand = ethers.utils.parseUnits("2000", 18); 

    expect(ethers.utils.formatUnits(balance)).to.equal(ethers.utils.formatUnits(twoThousand));

    await showBalance(account1);

  });
});
