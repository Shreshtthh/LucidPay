'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StreamCard from '@/components/layout/StreamCard';
import { useAccount } from 'wagmi';
import { useUserStreams, useProtocolStats, useActiveStreams, useStreamEvents } from '@/hooks/useStreamContract';
import { formatWeiToEther } from '@/lib/utils';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Clock, 
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle hydration properly
  useEffect(() => {
    setMounted(true);
    setIsClient(true);
  }, []);

  // Only fetch data after component is mounted and on client
  const { sentStreams, receivedStreams } = useUserStreams(mounted && isClient ? address : undefined);
  const { stats } = useProtocolStats();
  const { activeStreamIds } = useActiveStreams();
  const { recentEvents } = useStreamEvents();

  // Show loading skeleton during hydration
  if (!mounted || !isClient) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Show wallet connection prompt
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <div className="relative mb-8">
            <Zap className="h-24 w-24 text-somnia-500 mx-auto" />
            <div className="absolute inset-0 animate-pulse-glow">
              <Zap className="h-24 w-24 text-somnia-400 opacity-50 mx-auto" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-somnia-500 to-somnia-700 bg-clip-text text-transparent">
            Welcome to StreamPay
          </h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to start streaming payments in real-time on Somnia blockchain
          </p>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Key Features:</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-somnia-500" />
                <span>Per-second payment streaming</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Real-time balance updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-purple-500" />
                <span>Work, subscription & gaming streams</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`dashboard-${isClient ? 'client' : 'server'}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-somnia-500 to-somnia-600 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back! 👋
                </h1>
                <p className="text-somnia-100 mb-4">
                  Manage your real-time payment streams
                </p>
                <div className="flex space-x-3">
                  <Button asChild variant="secondary">
                    <Link href="/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Stream
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Link href="/templates">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Browse Templates
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="relative">
                  <Zap className="h-20 w-20 text-white/20" />
                  <div className="absolute inset-0 animate-pulse-glow">
                    <Zap className="h-20 w-20 text-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalStreams || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All time streams created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.activeStreams || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently streaming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalVolume ? `${formatWeiToEther(stats.totalVolume, 2)} STT` : '0 STT'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total value streamed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Streams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(sentStreams?.length || 0) + (receivedStreams?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sent & received
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      {recentEvents && recentEvents.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest stream events in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.slice(0, 5).map((event, index) => (
                  <div key={`${event.transactionHash}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      {event.type === 'StreamCreated' && (
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      {event.type === 'Withdrawn' && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                      {event.type === 'StreamCancelled' && (
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {event.type === 'StreamCreated' && 'Stream Created'}
                          {event.type === 'Withdrawn' && 'Funds Withdrawn'}
                          {event.type === 'StreamCancelled' && 'Stream Cancelled'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stream #{event.args?.streamId?.toString() || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* User Streams Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sent Streams */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowUpRight className="h-5 w-5 text-orange-500" />
                <span>Outgoing Streams</span>
                <Badge variant="outline">{sentStreams?.length || 0}</Badge>
              </CardTitle>
              <CardDescription>
                Streams you created and are paying out
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sentStreams && sentStreams.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {/* --- FIX IS HERE --- */}
                  {sentStreams.slice().reverse().map((streamId) => (
                    <StreamCard key={streamId} streamId={streamId} isReceived={false} />
                  ))}
                  {/* --- END OF FIX --- */}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowUpRight className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No outgoing streams yet</p>
                  <Button asChild variant="outline" className="mt-3">
                    <Link href="/create">Create your first stream</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Received Streams */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowDownLeft className="h-5 w-5 text-green-500" />
                <span>Incoming Streams</span>
                <Badge variant="outline">{receivedStreams?.length || 0}</Badge>
              </CardTitle>
              <CardDescription>
                Streams you're receiving payments from
              </CardDescription>
            </CardHeader>
            <CardContent>
              {receivedStreams && receivedStreams.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {/* --- FIX IS HERE --- */}
                  {receivedStreams.slice().reverse().map((streamId) => (
                    <StreamCard key={streamId} streamId={streamId} isReceived={true} />
                  ))}
                  {/* --- END OF FIX --- */}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowDownLeft className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No incoming streams yet</p>
                  <p className="text-sm mt-1">Share your address to receive streams</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get started with streaming
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto flex-col py-6">
                <Link href="/create">
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Create Stream</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Start a new payment stream
                  </span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto flex-col py-6">
                <Link href="/templates">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Browse Templates</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Use pre-made stream templates
                  </span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto flex-col py-6">
                <Link href="/analytics">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span className="font-semibold">View Analytics</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Track your streaming activity
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}