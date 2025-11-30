# 👁️ LucidPay
## The First "Conscious" Payment Protocol on Somnia

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://lucid-pay.vercel.app/)
[![Watch Demo](https://img.shields.io/badge/video-youtube-red)](https://youtu.be/CuY0QMgi2tE)

> **Your money just woke up.** LucidPay is a real-time payment streaming protocol powered by Somnia Data Streams. Unlike passive streams, our on-chain AI agent actively optimizes transactions and broadcasts its decision-making process in real-time. Transparent, instant, and alive.

---

## 🌟 Vision: Transparent AI-Powered Payments

LucidPay reimagines payment streaming by making AI decision-making **completely transparent**. Every calculation, every choice, every optimization—all visible in real-time through **Somnia Data Streams**.

We built LucidPay specifically for the **Somnia Data Streams Hackathon** to showcase how blockchain transparency can extend beyond transactions to **AI reasoning itself**.

---

## 💡 The Problem: Opaque & Inefficient Automation

Traditional payment streaming protocols (like Sablier or Superfluid) suffer from three critical flaws:

### 1. **They are "Dumb"**
Automation bots run blindly, often wasting gas on small updates or failing to optimize for network conditions.

### 2. **They are Opaque** 
Users must trust off-chain keepers without knowing:
- Why a stream wasn't updated
- Why a specific batch was chosen
- What the keeper is actually thinking

### 3. **High Latency**
Frontends rely on heavy RPC polling to show balance updates, creating a laggy user experience.

---

## ⚡ The Solution: Somnia Data Streams

LucidPay solves this by integrating **Somnia Data Streams (SDS)** to create a **"Glass Box" AI architecture**.

### We don't just execute transactions—we stream the AI's thoughts.

### How We Use Somnia Data Streams:

#### 🔍 **Transparent AI Logging**
Every time our Intelligent Keeper wakes up, it:
- Calculates profitability
- Analyzes gas prices  
- Makes a decision (EXECUTE or SKIP)
- **Publishes this entire decision process to a Somnia Data Stream**

#### ⚡ **Zero-Latency UI**
The frontend subscribes to these streams via WebSocket. Instead of polling the blockchain, users see:
- The AI's real-time activity
- Stream updates the instant they happen
- The keeper's reasoning for every decision

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   Frontend UI   │ ← WebSocket subscription to Data Streams
└────────┬────────┘
         │
    ┌────▼────────────────────────────────────┐
    │   Somnia Data Streams (Testnet)         │
    │   • KeeperLog Schema                    │
    │   • StreamUpdate Schema                 │
    └────┬───────────────────▲────────────────┘
         │                   │
         │              Publishes
         │              decisions
    ┌────▼──────────┐  ┌────┴────────────┐
    │  StreamPay    │  │ Intelligent     │
    │  Smart        │◄─┤ Keeper Agent    │
    │  Contracts    │  │ (AI + Gemini)   │
    └───────────────┘  └─────────────────┘
```

---

## 🧠 The Data Schema

We registered **two custom schemas** on the Somnia Testnet to structure our AI's decision logs. This allows any indexer or UI to decode the agent's behavior.

### Schema 1: **KeeperLog** (AI Decision Stream)

**Purpose:** Broadcasts every keeper decision with full transparency

```solidity
uint64 timestamp, 
string decision,        // "EXECUTE" or "SKIP"
uint256 gasPrice, 
string expectedProfit, 
uint32 batchSize, 
string reason          // Natural language explanation
```

**Real-world Example:**

When the AI decides to SKIP a transaction because gas is too high:

```json
{
  "timestamp": "1732984400",
  "decision": "SKIP",
  "gasPrice": "5000000000",
  "expectedProfit": "-0.002",
  "batchSize": 15,
  "reason": "Gas spike detected. Waiting for < 3 Gwei."
}
```

### Schema 2: **StreamUpdate** (Payment Execution Stream)

**Purpose:** Records actual on-chain payment stream updates

```solidity
uint256 streamId,
address recipient,
uint256 amountStreamed,
uint64 timestamp
```

**Real-world Example:**

```json
{
  "streamId": "42",
  "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "amountStreamed": "1500000000000000000",
  "timestamp": "1732984430"
}
```

This data is **immutable** and **verifiable** on the Somnia Network.

---

## 🚀 Key Features

### 1. 👁️ Glass Box AI Agent [Works on Localhost]

The `intelligent-keeper.ts` script doesn't just run—it **communicates**.

**Process Flow:**
1. **Input:** Fetches active streams and current gas prices
2. **Process:** Uses Gemini AI to calculate optimal batch size for maximum profit
3. **Output:** Publishes the decision to SDS **before** executing on-chain

**Why This Matters:**
- Users can audit every keeper decision
- Developers can analyze AI behavior patterns
- Trust is built through transparency, not blind faith

### 2. 🌊 Reactive "Live" Dashboard

Using the `@somnia-chain/streams` SDK, our frontend hooks (`useStreamData.ts`) listen for these updates.

**Benefits:**
- ❌ **No Polling:** We removed `setInterval` loops for data fetching
- ✅ **Instant Feedback:** Users see "AI Thinking..." and "Batch Executed" notifications pushed directly from the chain
- ⚡ **Zero Latency:** Updates appear in milliseconds, not seconds

### 3. 🗣️ Natural Language Onboarding

Create streams by typing:

```
"Pay 500 STT to alice.eth over the next 2 weeks for design work"
```

Our NLP engine parses the intent and formats the transaction automatically.

---

## 🛠️ Technical Stack

| Layer | Technology |
|-------|-----------|
| **Blockchain** | Somnia Testnet (Devnet) |
| **Data Layer** | Somnia Data Streams SDK (`@somnia-chain/streams`) |
| **Smart Contracts** | Solidity (Hardhat/Viem) |
| **AI Engine** | Google Gemini Flash 2.5 |
| **Frontend** | Next.js 14, Tailwind CSS, Framer Motion |
| **Backend Agent** | Node.js (Autonomous Keeper Bot) |

---

## 🏁 Quick Start Guide

### Prerequisites

- Node.js 18+
- Somnia Testnet Wallet with STT tokens
- Google Gemini API Key ([Get free at aistudio.google.com](https://aistudio.google.com))
- Somnia Data Streams API Key ([Get from Somnia Developer Portal](https://docs.somnia.network))

### 1. Clone & Install

```bash
git clone https://github.com/shreshtthh/LucidPay.git
cd LucidPay
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Contract Addresses (Pre-deployed on Somnia Testnet)
NEXT_PUBLIC_LUCIDPAY_ADDRESS=0xeff8b331a37cb2c03c04a087c53695a2b6dc0d45
NEXT_PUBLIC_STREAM_KEEPER_ADDRESS=0x251c6cff222eed46017731b4c87afd7af08f0c60
NEXT_PUBLIC_STREAM_FACTORY_ADDRESS=0xd91324c4c700bea8748ec11d8c510d8b32d2ca00
NEXT_PUBLIC_KEEPER_ADDRESS=0xd701436ccB7ae9223d270783e54C2463DB7fb004

# Data Streams Schema IDs
NEXT_PUBLIC_KEEPER_LOG_SCHEMA_ID=0x9de20e34b7be51af519bca2a118b40aec574bfb854e80f8dce73f0d41e2c84e2
NEXT_PUBLIC_STREAM_UPDATE_SCHEMA_ID=0xfceb6ab76e4162f13ac116c1248eef37973a0a4d46039521470dd0fd8c3a3c22

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
SOMNIA_STREAMS_API_KEY=your_somnia_streams_api_key_here

# Keeper Configuration
KEEPER_PRIVATE_KEY=your_keeper_wallet_private_key
```

### 3. Register Data Schemas (One-Time Setup)

This script uses the Somnia SDK to register the KeeperLog and StreamUpdate schemas on-chain.

```bash
npm run register-schemas
```

**Output:** You'll receive schema IDs that are already configured in the `.env` file above.

### 4. Run the Intelligent Keeper

Start the autonomous agent. It will begin analyzing the chain and publishing thoughts to the Data Stream.

```bash
npm run keeper
```

**Expected Behavior:**
```
🤖 Intelligent Keeper Started
⏰ Checking streams every 30 seconds...
📊 Found 12 active streams
💰 Total streamable: 45.5 STT
⛽ Current gas: 2.3 Gwei
🧠 AI Decision: EXECUTE (Expected profit: +0.15 STT)
📡 Publishing to Data Stream...
✅ Decision logged to chain
🔄 Executing batch update...
✅ Transaction confirmed!
```

### 5. Run the Frontend

```bash
npm run dev
```

Access the dApp at: **http://localhost:3000**

---

## 📜 Key Files for Judges

### 1. **Data Streams Integration**

**File:** `scripts/register-schemas.ts`  
Shows how we define and register custom Data Stream schemas on-chain.

**File:** `keeper/intelligent-keeper.ts`  
Core logic where the AI calculates profitability and publishes to the stream using `sdk.streams.set()`.

**File:** `hooks/useStreamData.ts`  
Frontend hook that consumes the data stream to update the UI in real-time.

### 2. **AI Agent Logic**

**File:** `keeper/batch-optimizer.ts`  
Gemini AI analyzes:
- Total keeper rewards vs gas costs
- Optimal batch sizing
- Market timing decisions

### 3. **Smart Contracts**

**File:** `contracts/contracts/LucidPay.sol`  
Core payment streaming logic with keeper incentives (0.1% fee per update).

---

## 🎥 Demo Materials

- **Live dApp:** [https://lucid-pay.vercel.app/](https://lucid-pay.vercel.app/)
- **Demo Video:** [https://youtu.be/CuY0QMgi2tE](https://youtu.be/CuY0QMgi2tE)
- **GitHub Repository:** [https://github.com/shreshtthh/LucidPay](https://github.com/shreshtthh/LucidPay)

---

## 🏆 Why LucidPay Stands Out

### 🎯 Perfect Alignment with Somnia Data Streams

LucidPay showcases the **true power** of Somnia Data Streams:

1. **Transparency Beyond Transactions**  
   We don't just log what happened—we log **why it happened**. Every AI decision is auditable.

2. **Real-Time UI Without Polling**  
   Data Streams enable a fundamentally better UX—instant updates with zero latency.

3. **Verifiable AI Behavior**  
   The keeper's entire decision history is on-chain and queryable, creating accountability.

### 🚀 Innovation Highlights

| Feature | Traditional Approach | LucidPay Approach |
|---------|---------------------|------------------|
| **Keeper Logic** | Black box off-chain bot | Glass box AI with published reasoning |
| **Trust Model** | "Trust us, it works" | "Here's exactly what we're thinking" |
| **Auditability** | None (off-chain) | Full decision history on-chain |

### 📊 Technical Achievements

- ✅ **Two custom Data Stream schemas** registered and actively used
- ✅ **Real-time WebSocket integration** for live AI decision feed
- ✅ **Autonomous AI agent** that publishes reasoning before execution
- ✅ **Full-stack dApp** with natural language onboarding
- ✅ **Production-ready** architecture (separate web app + keeper bot)

---

## 🔮 Future Roadmap

### Phase 1: Enhanced Data Streams
- **Price Oracle Streams:** Integrate Chainlink price feeds via SDS to allow streaming in USD terms (auto-converting to STT)
- **Multi-Keeper Competition:** Allow multiple keepers to compete, with decisions published to Data Streams for comparison

### Phase 2: Advanced AI Features
- **Reputation Streams:** Analyze wallet history to assign a "Trust Score" to stream recipients, publishing this score via SDS
- **Predictive Gas Modeling:** Use historical Data Stream data to train ML models for better gas price predictions

### Phase 3: Ecosystem Integration
- **Developer SDK:** Package our Data Streams patterns for other builders
- **Analytics Dashboard:** Public explorer for all keeper decisions and AI reasoning patterns

---

## 🙏 Acknowledgments

Built with 💙 for the **Somnia Data Streams Hackathon**.

Special thanks to the Somnia team for creating the infrastructure that makes transparent, real-time AI decision-making possible on-chain.

---

**LucidPay:** Where AI transparency meets payment streaming. Built on Somnia Data Streams.
