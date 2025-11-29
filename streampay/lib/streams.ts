import { SDK, SchemaEncoder, zeroBytes32 } from '@somnia-chain/streams';
import { toHex, keccak256, type Hex } from 'viem';
import type { WalletClient, PublicClient } from 'viem';

// Schema Definition Strings (must match exactly when registered)
export const KEEPER_LOG_SCHEMA_DEF = "uint64 timestamp, string decision, uint256 gasPrice, string expectedProfit, uint32 batchSize, string reason";
export const STREAM_UPDATE_SCHEMA_DEF = "uint256 streamId, uint256 newBalance, string status, uint64 timestamp";

// Schema Encoders (for encoding/decoding data)
export const keeperLogEncoder = new SchemaEncoder(KEEPER_LOG_SCHEMA_DEF);
export const streamUpdateEncoder = new SchemaEncoder(STREAM_UPDATE_SCHEMA_DEF);

// Cached Schema IDs (computed once)
let keeperLogSchemaId: Hex | null = null;
let streamUpdateSchemaId: Hex | null = null;

/**
 * Initialize SDK with clients
 */
export function initializeSDK(publicClient: PublicClient, walletClient?: WalletClient) {
  return new SDK({
    public: publicClient,
    wallet: walletClient
  });
}

/**
 * Get or compute the Keeper Log Schema ID
 */
export async function getKeeperLogSchemaId(sdk: SDK): Promise<Hex> {
  if (!keeperLogSchemaId) {
    const result = await sdk.streams.computeSchemaId(KEEPER_LOG_SCHEMA_DEF);
    if (!result || result instanceof Error) {
      throw new Error('Failed to compute keeper log schema ID');
    }
    keeperLogSchemaId = result;
  }
  return keeperLogSchemaId;
}

/**
 * Get or compute the Stream Update Schema ID
 */
export async function getStreamUpdateSchemaId(sdk: SDK): Promise<Hex> {
  if (!streamUpdateSchemaId) {
    const result = await sdk.streams.computeSchemaId(STREAM_UPDATE_SCHEMA_DEF);
    if (!result || result instanceof Error) {
      throw new Error('Failed to compute stream update schema ID');
    }
    streamUpdateSchemaId = result;
  }
  return streamUpdateSchemaId;
}

/**
 * Publish a keeper decision log to Somnia Data Streams
 */
export async function publishKeeperLog(
  sdk: SDK,
  data: {
    timestamp: bigint;
    decision: string;
    gasPrice: bigint;
    expectedProfit: string;
    batchSize: number;
    reason: string;
  }
): Promise<Hex | null> {
  // Get schema ID
  const schemaId = await getKeeperLogSchemaId(sdk);

  // Encode data using SchemaEncoder
  const encodedData: Hex = keeperLogEncoder.encodeData([
    { name: 'timestamp', value: data.timestamp.toString(), type: 'uint64' },
    { name: 'decision', value: data.decision, type: 'string' },
    { name: 'gasPrice', value: data.gasPrice, type: 'uint256' },
    { name: 'expectedProfit', value: data.expectedProfit, type: 'string' },
    { name: 'batchSize', value: data.batchSize.toString(), type: 'uint32' },
    { name: 'reason', value: data.reason, type: 'string' }
  ]);

  // Generate unique Data ID (primary key)
  const dataId = toHex(
    keccak256(new TextEncoder().encode(`keeper-${data.timestamp}-${data.decision}`)),
    { size: 32 }
  );

  // Publish to chain
  const txHash = await sdk.streams.set([{
    id: dataId,
    schemaId: schemaId,
    data: encodedData
  }]);

  if (txHash instanceof Error) {
    throw txHash;
  }

  return txHash;
}

/**
 * Publish a stream balance update to Somnia Data Streams
 */
export async function publishStreamUpdate(
  sdk: SDK,
  data: {
    streamId: bigint;
    newBalance: bigint;
    status: string;
    timestamp: bigint;
  }
): Promise<Hex | null> {
  // Get schema ID
  const schemaId = await getStreamUpdateSchemaId(sdk);

  // Encode data using SchemaEncoder
  const encodedData: Hex = streamUpdateEncoder.encodeData([
    { name: 'streamId', value: data.streamId.toString(), type: 'uint256' },
    { name: 'newBalance', value: data.newBalance.toString(), type: 'uint256' },
    { name: 'status', value: data.status, type: 'string' },
    { name: 'timestamp', value: data.timestamp.toString(), type: 'uint64' }
  ]);

  // Generate unique Data ID
  const dataId = toHex(
    keccak256(new TextEncoder().encode(`stream-${data.streamId}-${data.timestamp}`)),
    { size: 32 }
  );

  // Publish to chain
  const txHash = await sdk.streams.set([{
    id: dataId,
    schemaId: schemaId,
    data: encodedData
  }]);

  if (txHash instanceof Error) {
    throw txHash;
  }

  return txHash;
}
