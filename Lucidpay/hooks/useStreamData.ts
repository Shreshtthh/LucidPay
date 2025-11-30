'use client';

import { useState, useEffect } from 'react';
import { initializeSDK, getKeeperLogSchemaId } from '@/lib/streams';
import { createPublicClient, http } from 'viem';
import { somniaTestnet } from '@/lib/contracts';

// Hook for Live AI Keeper Feed (Polling-based - fetches from blockchain)
export function useKeeperLiveFeed() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchLogs = async () => {
      try {
        const publicClient = createPublicClient({
          chain: somniaTestnet,
          transport: http()
        });
        
        const sdk = initializeSDK(publicClient);
        const schemaId = await getKeeperLogSchemaId(sdk);

        if (!schemaId) {
          throw new Error('Schema ID not available');
        }

        // Fetch all keeper logs from the blockchain
        const keeperAddress = process.env.NEXT_PUBLIC_KEEPER_ADDRESS as `0x${string}`;
        
        if (!keeperAddress) {
          console.warn('⚠️ KEEPER_ADDRESS not set in .env');
          setError('Keeper address not configured');
          setIsConnected(false);
          return;
        }

        console.log('🔍 Fetching logs for keeper:', keeperAddress);

        // getAllPublisherDataForSchema returns Hex[] | SchemaDecodedItem[][] | null
        // It returns raw hex strings that need manual decoding
        const allData = await sdk.streams.getAllPublisherDataForSchema(
          schemaId,
          keeperAddress
        );

        // Handle Error or null response
        if (allData instanceof Error) {
          throw allData;
        }

        if (!allData) {
          console.log('📭 No logs found yet');
          setLogs([]);
          setIsConnected(true);
          setError(null);
          return;
        }

        console.log('📊 Fetched', allData.length, 'raw log entries');
        console.log('📦 First item structure:', JSON.stringify(allData[0]?.slice(0, 200)));

        // Use the SDK's built-in deserialiseRawData method
        // This handles the complex data format returned by Somnia
        try {
          const decodedData = await sdk.streams.deserialiseRawData(
            allData as any,
            schemaId
          );

          console.log('🔍 Decoded data type:', typeof decodedData, 'isArray:', Array.isArray(decodedData));
          
          if (!decodedData || decodedData instanceof Error || !Array.isArray(decodedData)) {
            console.log('⚠️ No decoded data returned');
            setLogs([]);
            setIsConnected(true);
            setError(null);
            return;
          }

          console.log('🔍 First decoded item:', JSON.stringify(decodedData[0]));

          // decodedData is SchemaDecodedItem[][] - array of arrays with .value properties
          const parsedLogs = decodedData.map((item: any, index: number) => {
            try {
              // Each item is an array of SchemaDecodedItem objects
              // Schema: "uint64 timestamp, string decision, uint256 gasPrice, string expectedProfit, uint32 batchSize, string reason"
              if (Array.isArray(item) && item.length >= 6) {
                return {
                  id: index,
                  timestamp: Number(item[0]?.value || Date.now()),
                  decision: String(item[1]?.value || 'SKIP'),
                  gasPrice: item[2]?.value?.toString() || '0',
                  expectedProfit: String(item[3]?.value || '0'),
                  batchSize: Number(item[4]?.value || 0),
                  reason: String(item[5]?.value || 'Unknown')
                };
              }
              
              console.warn('⚠️ Unexpected item structure at index', index, ':', item);
              return null;
            } catch (err) {
              console.error('❌ Failed to parse log at index', index, ':', err);
              return null;
            }
          }).filter(Boolean);

          console.log('✅ Decoded', parsedLogs.length, 'keeper logs successfully');
          setLogs(parsedLogs.reverse().slice(0, 50)); // Show newest 50
          setIsConnected(true);
          setError(null);
        } catch (decodeErr: any) {
          console.error('❌ Failed to deserialise data:', decodeErr);
          setError('Failed to decode keeper logs');
          setLogs([]);
          setIsConnected(true);
        }

      } catch (err: any) {
        console.error('❌ Failed to fetch keeper logs:', err);
        setError(err.message || 'Failed to fetch logs');
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchLogs();

    // Poll every 10 seconds for new logs
    interval = setInterval(fetchLogs, 10000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return { logs, isConnected, error };
}

// Hook for Real-Time Stream Balance Updates
export function useStreamBalance(streamId: string | undefined) {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [status, setStatus] = useState<string>('active');

  // This would require keeper to publish balance updates
  // For now, return null (use contract-based balance instead)
  
  return { balance, status };
}