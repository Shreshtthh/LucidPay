/**
 * Somnia Data Streams Schema Registration Script
 * 
 * Run this ONCE during deployment to register your schemas on-chain:
 * npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" scripts/register-schemas.ts
 * 
 * After running successfully, schemas will be available for:
 * - AI Keeper decision logging (transparent, verifiable)
 * - Real-time stream balance updates (WebSocket push)
 */

import 'dotenv/config';
import { initializeSDK, KEEPER_LOG_SCHEMA_DEF, STREAM_UPDATE_SCHEMA_DEF } from '../lib/streams';
import { zeroBytes32 } from '@somnia-chain/streams';
import { createWalletClient, createPublicClient, http, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';

// Somnia Testnet Chain Definition
const somniaTestnet = defineChain({
  id: 50311,
  name: 'Somnia Testnet',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://dream-rpc.somnia.network'] }
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://somnia-devnet.socialscan.io' }
  },
  testnet: true
});

const KEEPER_PRIVATE_KEY = process.env.KEEPER_PRIVATE_KEY as `0x${string}`;
const SOMNIA_RPC_URL = process.env.SOMNIA_RPC_URL || "https://dream-rpc.somnia.network";

if (!KEEPER_PRIVATE_KEY) {
  throw new Error("❌ Missing KEEPER_PRIVATE_KEY in .env file");
}

const account = privateKeyToAccount(KEEPER_PRIVATE_KEY);

const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(SOMNIA_RPC_URL)
});

const walletClient = createWalletClient({
  account,
  chain: somniaTestnet,
  transport: http(SOMNIA_RPC_URL)
});

async function registerSchemas() {
  console.log("🚀 Registering Somnia Data Stream Schemas...\n");

  // Initialize SDK
  const sdk = initializeSDK(publicClient, walletClient);

  try {
    // Register AI Keeper Log Schema
    console.log("📝 Registering Keeper Log Schema...");
    const keeperSchemaId = await sdk.streams.computeSchemaId(KEEPER_LOG_SCHEMA_DEF);
    
    const ignoreRegistered = true;
    const keeperTxHash = await sdk.streams.registerDataSchemas(
      [{
        schemaName: "Lucidpay_Keeper_Log_v1",
        schema: KEEPER_LOG_SCHEMA_DEF,
        parentSchemaId: zeroBytes32 as Hex
      }],
      ignoreRegistered
    );
    
    console.log(`✅ Keeper Log Schema registered`);
    console.log(`   Schema Name: Lucidpay_Keeper_Log_v1`);
    console.log(`   Schema Definition: ${KEEPER_LOG_SCHEMA_DEF}`);
    console.log(`   Schema ID: ${keeperSchemaId}`);
    console.log(`   Tx Hash: ${keeperTxHash}\n`);

    // Register Stream Update Schema
    console.log("📝 Registering Stream Update Schema...");
    const streamSchemaId = await sdk.streams.computeSchemaId(STREAM_UPDATE_SCHEMA_DEF);
    
    const streamTxHash = await sdk.streams.registerDataSchemas(
      [{
        schemaName: "Lucidpay_Update_v1",
        schema: STREAM_UPDATE_SCHEMA_DEF,
        parentSchemaId: zeroBytes32 as Hex
      }],
      ignoreRegistered
    );
    
    console.log(`✅ Stream Update Schema registered`);
    console.log(`   Schema Name: Lucidpay_Update_v1`);
    console.log(`   Schema Definition: ${STREAM_UPDATE_SCHEMA_DEF}`);
    console.log(`   Schema ID: ${streamSchemaId}`);
    console.log(`   Tx Hash: ${streamTxHash}\n`);

    console.log("🎉 All schemas registered successfully!");
    console.log("\n📋 Next Steps:");
    console.log("1. Your keeper bot can now publish AI decisions to the Data Stream");
    console.log("2. Your frontend can subscribe to real-time updates via WebSocket");
    console.log("3. Run: npm run keeper (to start the intelligent keeper)");
    console.log("4. All AI decisions will be transparent and verifiable on-chain\n");

  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log("ℹ️  Schemas already registered - skipping");
      console.log("   Your schemas are ready to use!\n");
    } else {
      console.error("❌ Schema registration failed:", error);
      throw error;
    }
  }
}

registerSchemas()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
