# SmartClaim – Decentralized Insurance dApp

SmartClaim is a decentralized insurance application built with Solidity, React, and Ethers.js. The system allows users to register insurance policies, submit claims with evidence, and enables admin-level control for claim approval and payout processing.

This project demonstrates practical use of blockchain in the insurance sector, focusing on transparency, automation, and user trust.

---

## Features

- Connect and disconnect Ethereum wallets (MetaMask)
- Register new insurance policies with conditions and payout amounts
- Submit insurance claims with supporting descriptions and image file references
- Admin dashboard for claim approval and issuing payouts
- Fully styled React frontend
- Interacts directly with Ethereum smart contracts using Ethers.js

---

## Tech Stack

**Smart Contract:** Solidity  
**Frontend:** React.js, CSS  
**Blockchain Integration:** Ethers.js  
**Deployment:** GitHub Pages

---

## Smart Contract Summary

**File:** `Insurance.sol`  
**Key Functions:**

- `registerPolicy(address _policyHolder, uint256 _payoutAmount, string _condition)`
- `submitClaim(uint256 _policyId, string _evidence)`
- `approveClaim(uint256 _policyId)`
- `payout(uint256 _policyId)`

**Events:**

- `PolicyRegistered`
- `ClaimSubmitted`
- `ClaimApproved`
- `PayoutIssued`

---

## Running Locally

1. Clone the repository:

```bash
git clone https://github.com/SamOpera/smartclaim.git
cd smartclaim/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. To build for production:

```bash
npm run build
```

---

## Project Structure

```
smartclaim/
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── logo.png
│   └── public/
│       └── index.html
├── contracts/
│   └── Insurance.sol
```

---

## License

This project is licensed under the MIT License.

---

## Author

**Olakeye Samson Kehinde**  
GitHub: [SamOpera](https://github.com/SamOpera)  
Email: olakeyesamson1@gmail.com
