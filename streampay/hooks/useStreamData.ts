'use client';

import { useState, useEffect } from 'react';
import { initializeSDK, getKeeperLogSchemaId, getStreamUpdateSchemaId, keeperLogEncoder, streamUpdateEncoder } from '@/lib/streams';
import { createPublicClient, http } from 'viem';
import { somniaTestnet } from '@/lib/contracts';

// Hook for Live AI Keeper Feed (Polling-based - can be upgraded to WebSocket events)
export function useKeeperLiveFeed() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const publicClient = createPublicClient({
      chain: somniaTestnet,
      transport: http()
    });
    const sdk = initializeSDK(publicClient);
    
    let intervalId: NodeJS.Timeout;
    
    const fetchLogs = async () => {
      try {
        const schemaId = await getKeeperLogSchemaId(sdk);
        
        // For now, we'll use polling. In production, use subscribe() with WebSocket
        // This would require keeper address - for demo, we'll just show structure
        
        setIsConnected(true);
        console.log('⚡ Keeper Feed Ready (polling mode)');
        
        // TODO: Implement with actual keeper publisher address
        // const keeperAddress = process.env.NEXT_PUBLIC_KEEPER_ADDRESS;
        // const data = await sdk.streams.getAllPublisherDataForSchema(schemaId, keeperAddress);
        
        // For now, return empty array until keeper address is configured
        // In production: decode data using keeperLogEncoder.decodeData()
        
      } catch (err) {
        console.error("Failed to fetch keeper logs:", err);
        setIsConnected(false);
      }
    };

    fetchLogs();
    intervalId = setInterval(fetchLogs, 10000); // Poll every 10 seconds

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return { logs, isConnected };
}

// Hook for Real-Time Stream Balance Updates
// Note: This would require implementing a stream update publisher in your keeper
// For now, returns null - use existing useRealTimeBalance from useStreamContract
export function useStreamBalance(streamId: string | undefined) {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [status, setStatus] = useState<string>('active');

  // TODO: Implement stream balance polling/subscription
  // This requires the keeper to publish balance updates to Somnia Streams
  // For now, falls back to contract-based balance reading
  
  return { balance, status };
}
