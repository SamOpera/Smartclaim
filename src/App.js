import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import "./App.css";
import logo from "./logo.png";

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const contractABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_policyHolder", "type": "address" },
      { "internalType": "uint256", "name": "_payoutAmount", "type": "uint256" },
      { "internalType": "string", "name": "_condition", "type": "string" }
    ],
    "name": "registerPolicy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_policyId", "type": "uint256" },
      { "internalType": "string", "name": "_evidence", "type": "string" }
    ],
    "name": "submitClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_policyId", "type": "uint256" }],
    "name": "approveClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_policyId", "type": "uint256" }],
    "name": "payout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const [policyAddress, setPolicyAddress] = useState("");
  const [payout, setPayout] = useState("");
  const [condition, setCondition] = useState("");
  const [claimPolicyId, setClaimPolicyId] = useState("");
  const [evidence, setEvidence] = useState("");
  const [claimImage, setClaimImage] = useState(null);
  const [adminPolicyId, setAdminPolicyId] = useState("");

  useEffect(() => {
    if (window.ethereum && account) {
      const prov = new BrowserProvider(window.ethereum);
      setProvider(prov);
      prov.getSigner().then(signer => {
        const insuranceContract = new Contract(contractAddress, contractABI, signer);
        setContract(insuranceContract);
      });
    }
  }, [account]);

  const toggleWalletConnection = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please open this site inside the MetaMask mobile app or install MetaMask.");
      return;
    }

    if (!account) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection rejected.");
      }
    } else {
      setAccount(null);
      setProvider(null);
      setContract(null);
    }
  };

  const registerPolicy = async () => {
    try {
      const tx = await contract.registerPolicy(
        policyAddress,
        parseEther(payout),
        condition
      );
      await tx.wait();
      alert("✅ Policy registered!");
    } catch (err) {
      alert("❌ Error registering policy.");
      console.error(err);
    }
  };

  const submitClaim = async () => {
    try {
      if (!claimImage) {
        alert("Please select an image to upload as part of evidence.");
        return;
      }

      const tx = await contract.submitClaim(claimPolicyId, `${evidence} - Image: ${claimImage.name}`);
      await tx.wait();
      alert("✅ Claim submitted!");
    } catch (err) {
      alert("❌ Error submitting claim.");
      console.error(err);
    }
  };

  const approveClaim = async () => {
    try {
      const tx = await contract.approveClaim(adminPolicyId);
      await tx.wait();
      alert("✅ Claim approved!");
    } catch (err) {
      alert("❌ Error approving claim.");
      console.error(err);
    }
  };

  const payoutClaim = async () => {
    try {
      const tx = await contract.payout(adminPolicyId);
      await tx.wait();
      alert("✅ Payout sent!");
    } catch (err) {
      alert("❌ Error issuing payout.");
      console.error(err);
    }
  };

  return (
    <div className="app">
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="Logo" style={{ height: "60px", marginTop: "1rem", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }} />
      </div>

      <h1>SmartClaim Insurance dApp</h1>

      <div className="wallet-status">
        <button className="wallet-btn" onClick={toggleWalletConnection}>
          {account ? "❌ Disconnect Wallet" : "🔗 Connect Wallet"}
        </button>
        {account && <p><strong>Connected Wallet:</strong> {account}</p>}

        {!window.ethereum && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            ⚠ MetaMask not detected.{" "}
            <a
              href="https://metamask.app.link/dapp/samopera.github.io/smartclaim"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              Open in MetaMask App
            </a>
          </p>
        )}
      </div>

      <section>
        <h2>Register a New Policy</h2>
        <input type="text" placeholder="Policyholder Address" value={policyAddress} onChange={(e) => setPolicyAddress(e.target.value)} />
        <input type="text" placeholder="Payout (ETH)" value={payout} onChange={(e) => setPayout(e.target.value)} />
        <input type="text" placeholder="Condition (e.g. flood, fire)" value={condition} onChange={(e) => setCondition(e.target.value)} />
        <button onClick={registerPolicy}>Register Policy</button>
      </section>

      <section>
        <h2>Submit a Claim</h2>
        <input type="text" placeholder="Policy ID" value={claimPolicyId} onChange={(e) => setClaimPolicyId(e.target.value)} />
        <input type="text" placeholder="Evidence description" value={evidence} onChange={(e) => setEvidence(e.target.value)} />
        <input type="file" onChange={(e) => setClaimImage(e.target.files[0])} />
        <button onClick={submitClaim}>Submit Claim</button>
      </section>

      <section>
        <h2>Admin Controls</h2>
        <input type="text" placeholder="Policy ID (Admin)" value={adminPolicyId} onChange={(e) => setAdminPolicyId(e.target.value)} />
        <button onClick={approveClaim}>✅ Approve Claim</button>
        <button onClick={payoutClaim}>💸 Payout</button>
      </section>
    </div>
  );
}

export default App;
