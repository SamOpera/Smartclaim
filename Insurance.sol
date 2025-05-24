import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import "./App.css";

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

const contractABI = [
  {
    inputs: [
      { internalType: "address", name: "_policyHolder", type: "address" },
      { internalType: "uint256", name: "_payoutAmount", type: "uint256" },
      { internalType: "string", name: "_condition", type: "string" }
    ],
    name: "registerPolicy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_policyId", type: "uint256" },
      { internalType: "string", name: "_evidence", type: "string" }
    ],
    name: "submitClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_policyId", type: "uint256" }],
    name: "approveClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_policyId", type: "uint256" }],
    name: "payout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [policyAddress, setPolicyAddress] = useState("");
  const [payout, setPayout] = useState("");
  const [condition, setCondition] = useState("");
  const [claimPolicyId, setClaimPolicyId] = useState("");
  const [evidence, setEvidence] = useState("");
  const [actionPolicyId, setActionPolicyId] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection rejected.");
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  const getContract = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(contractAddress, contractABI, signer);
  };

  const registerPolicy = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.registerPolicy(policyAddress, parseEther(payout), condition);
      await tx.wait();
      alert("✅ Policy registered on blockchain!");
    } catch (error) {
      console.error(error);
      alert("❌ Error registering policy.");
    }
  };

  const submitClaim = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.submitClaim(claimPolicyId, evidence);
      await tx.wait();
      alert("✅ Claim submitted!");
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting claim.");
    }
  };

  const approveClaim = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.approveClaim(actionPolicyId);
      await tx.wait();
      alert("✅ Claim approved!");
    } catch (error) {
      console.error(error);
      alert("❌ Error approving claim.");
    }
  };

  const payoutClaim = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.payout(actionPolicyId);
      await tx.wait();
      alert("✅ Payout successful!");
    } catch (error) {
      console.error(error);
      alert("❌ Error processing payout.");
    }
  };

  return (
    <div className="container">
      <h1>SmartClaim Insurance dApp</h1>
      {account ? (
        <>
          <p><strong>Connected:</strong> {account}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      <div className="section">
        <h2>Register Policy</h2>
        <input type="text" placeholder="Policyholder Address" value={policyAddress} onChange={e => setPolicyAddress(e.target.value)} />
        <input type="text" placeholder="Payout (ETH)" value={payout} onChange={e => setPayout(e.target.value)} />
        <input type="text" placeholder="Condition (e.g., flood)" value={condition} onChange={e => setCondition(e.target.value)} />
        <button onClick={registerPolicy}>Register Policy</button>
      </div>

      <div className="section">
        <h2>Submit Claim</h2>
        <input type="text" placeholder="Policy ID" value={claimPolicyId} onChange={e => setClaimPolicyId(e.target.value)} />
        <input type="text" placeholder="Evidence" value={evidence} onChange={e => setEvidence(e.target.value)} />
        <button onClick={submitClaim}>Submit Claim</button>
      </div>

      <div className="section">
        <h2>Approve & Payout</h2>
        <input type="text" placeholder="Policy ID" value={actionPolicyId} onChange={e => setActionPolicyId(e.target.value)} />
        <button onClick={approveClaim}>Approve Claim</button>
        <button onClick={payoutClaim}>Payout</button>
      </div>
    </div>
  );
}

export default App;
