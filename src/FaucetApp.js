import './FaucetApp.css';
import { ethers } from "ethers";

const godWokenUrl = "https://godwoken-testnet-web3-v1-rpc.ckbapp.dev";

// Private key unsafe account MM
const privateKey = "72483587cdfc82a43cd770661f720c5c2e5bcc57324c7bf3749d3d6f78df81b1";

// Addresses tokens sur Godwoken Testnet
const addrTokenA = "0xD29cb1824544C30AEa1F22443e9DCF688ecA0bE4"; 
const addrTokenB = "0xD2Da53D65C362E81C0580C5441baaDD16d4c7D48";

const mintAmount = 10000

let provider, signer, tokenA, tokenB;

const overrides = { gasLimit: 300000 };

async function addTokenToMM(tokenSymbol, tokenAddress) {
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
        },
      },
    });
  
    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Your loss!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function getTokens() {
  
  let addrToMint = document.getElementById('godwoken-address').value.trim();
  
  console.log(`Minting ${mintAmount} TOKENA/ TOKENB to  ${addrToMint}`);

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
  console.log("TokenB deployed to :", tokenB.address);
  
  let resultElem = document.getElementById('mint-result');
  try {

    resultElem.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div> Transaction pending. Wait a few minutes please ...';

    const tx1 = await tokenA.mint(addrToMint, mintAmount, overrides);
    const tx2 = await tokenB.mint(addrToMint, mintAmount, overrides);
  
    Promise.all([tx1.wait(), tx2.wait()])
      .then(() => resultElem.innerHTML = '<span class="text-success">Success !</span>');

  } catch(e) { 
    resultElem.innerHTML = `<span class="text-danger">Transaction error : ${e}</span>`; 
  }

}

function FaucetApp() {
  return (
    <div className="py-3">
      <h1 className="mb-4">Faucet for Nervos Swap</h1>
      <p className="lead mb-4">Get tokens to test <a className="text-decoration-none" href="http://nervoswap.freeddns.org:8080">Nervos Swap</a> application.</p>
      <div className="mb-3">
        <label htmlFor="godwoken-address" className="form-label">Your Godwoken address :</label>
        <input type="text" className="form-control" id="godwoken-address" placeholder="0x..." />
      </div>
      <div className="d-grid mb-4">
          <button type="button" className="btn btn-primary" onClick={getTokens}>Receive {mintAmount} TOKENA and {mintAmount} TOKENB</button>
      </div>
      <p id="mint-result"></p>
      <button type="button" className="btn btn-link btn-sm" onClick={() => addTokenToMM('TOKENA', addrTokenA)}>Add TOKENA to Metamask</button>
      <button type="button" className="btn btn-link btn-sm"  onClick={() => addTokenToMM('TOKENB', addrTokenB)}>Add TOKENB to Metamask</button>      
    </div>
  );
}

export default FaucetApp;
