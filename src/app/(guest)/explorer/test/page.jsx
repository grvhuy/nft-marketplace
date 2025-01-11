'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NFTTransactionChart = ({ transactionHistory }) => {
  const [selectedTx, setSelectedTx] = useState(null);

  // Sample transaction history
  const history = [
    {
      blockNumber: "3n",
      from: "0x0000000000000000000000000000000000000000",
      timestamp: "1/5/2025, 7:17:39 PM",
      to: "0x6041702E4C881AF5b57aD03B20DeDbE3d6563b1a",
      transactionHash: "0x5490dac93603d61833d0ce8dd477bacbd61cafab4a744143f053e886a1632ae3",
      type: "Transfer",
      value: "0.0025",
    },
    {
      blockNumber: "3n",
      from: "0x6041702E4C881AF5b57aD03B20DeDbE3d6563b1a",
      timestamp: "1/5/2025, 7:17:39 PM",
      to: "0xCA31d6f6ffe7873a5260100e75d0514A9A0dC06A",
      transactionHash: "0x5490dac93603d61833d0ce8dd477bacbd61cafab4a744143f053e886a1632ae3",
      type: "Transfer",
      value: "0.0025",
    },
    {
      blockNumber: "5n",
      from: "0xCA31d6f6ffe7873a5260100e75d0514A9A0dC06A",
      timestamp: "1/5/2025, 7:26:24 PM",
      to: "0x33b5f8c53D87e40d0B364Ada00b6F110e053Eef6",
      transactionHash: "0x0ba8ad90cf99242d7da2530347753a775e0a6c6418bcab23c8b26371886fe150",
      type: "Transfer",
      value: "2",
    },
    {
      blockNumber: "6n",
      from: "0x33b5f8c53D87e40d0B364Ada00b6F110e053Eef6",
      timestamp: "1/5/2025, 7:30:26 PM",
      to: "0xCA31d6f6ffe7873a5260100e75d0514A9A0dC06A",
      transactionHash: "0xf69e2fe661ff3659471c6048ea6de00a56f7673314069399ca31775a57f48720",
      type: "Transfer",
      value: "0",
    }
  ];

  // Process data for the chart
  const chartData = history
    .filter(tx => tx.type === "Transfer")
    .map(tx => ({
      ...tx,
      displayDate: new Date(tx.timestamp).toLocaleDateString(),
      value: parseFloat(tx.value),
      shortHash: tx.transactionHash.slice(0, 6) + '...' + tx.transactionHash.slice(-4)
    }));

  const handleClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setSelectedTx(data.activePayload[0].payload);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const tx = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="text-sm">Date: {tx.displayDate}</p>
          <p className="text-sm">Value: {tx.value} ETH</p>
          <p className="text-sm">TX: {tx.shortHash}</p>
        </div>
      );
    }
    return null;
  };

  const TransactionDetails = ({ tx }) => {
    if (!tx) return null;
    return (
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Transaction Details</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedTx(null)}
          >
            ✕
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Block:</span> {tx.blockNumber}</p>
          <p><span className="font-medium">Hash:</span> {tx.transactionHash}</p>
          <p><span className="font-medium">From:</span> {tx.from}</p>
          <p><span className="font-medium">To:</span> {tx.to}</p>
          <p><span className="font-medium">Value:</span> {tx.value} ETH</p>
          <p><span className="font-medium">Time:</span> {tx.timestamp}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>NFT Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              onClick={handleClick}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="displayDate" 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                label={{ value: 'Value (ETH)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ r: 6, cursor: 'pointer' }}
                activeDot={{ r: 8, cursor: 'pointer' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <TransactionDetails tx={selectedTx} />
      </CardContent>
    </Card>
  );
};

export default NFTTransactionChart;