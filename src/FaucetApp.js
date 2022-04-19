import './FaucetApp.css';

function getTokens() {
  console.log('Get tokens !!!!', document.getElementById('godwoken-address').value);
}

function FaucetApp() {
  return (
    <div className="py-3">
      <h1 className="mb-4">Nervos Swap Faucet</h1>
      <p className="lead mb-4">Get test tokens for <a className="text-decoration-none" href="http://nervoswap.freeddns.org:8080">Nervos Swap</a>.</p>
      <div className="mb-3">
        <label htmlFor="godwoken-address" className="form-label">Your Godwoken Testnet address</label>
        <input type="text" className="form-control" id="godwoken-address" placeholder="" />
      </div>
      <div className="d-grid mb-4">
          <button type="button" className="btn btn-primary" onClick={getTokens}>Get 10000 TOKENA and 10000 TOKENB</button>
      </div>
      <button type="button" className="btn btn-link btn-sm">Add TOKENA to Metamask</button><button type="button" className="btn btn-link btn-sm">Add TOKENB to Metamask</button>      
    </div>
  );
}

export default FaucetApp;
