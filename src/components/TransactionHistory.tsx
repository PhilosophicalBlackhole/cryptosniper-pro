/**
 * Transaction history component with filtering and visibility controls
 */

import React, { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Transaction } from '../types/trading';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [visibleColumns, setVisibleColumns] = useState({
    timestamp: true,
    type: true,
    token: true,
    amount: true,
    price: true,
    gasUsed: true,
    status: true,
    profit: true,
  });

  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'pending'>('all');

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filterStatus === 'all') return true;
    return tx.status === filterStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Transaction History
          </div>
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-600 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Column Visibility Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleColumn('timestamp')}
                className={`h-8 px-2 text-xs ${visibleColumns.timestamp ? 'text-white' : 'text-slate-500'}`}
                title="Toggle Timestamp"
              >
                {visibleColumns.timestamp ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="ml-1">Time</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleColumn('gasUsed')}
                className={`h-8 px-2 text-xs ${visibleColumns.gasUsed ? 'text-white' : 'text-slate-500'}`}
                title="Toggle Gas Info"
              >
                {visibleColumns.gasUsed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="ml-1">Gas</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleColumn('profit')}
                className={`h-8 px-2 text-xs ${visibleColumns.profit ? 'text-white' : 'text-slate-500'}`}
                title="Toggle Profit/Loss"
              >
                {visibleColumns.profit ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="ml-1">P&L</span>
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>
              {filterStatus === 'all' 
                ? 'No transactions yet. Start sniping to see your trading history!' 
                : `No ${filterStatus} transactions found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tx.status)}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">
                          {tx.type.toUpperCase()}
                        </span>
                        {visibleColumns.token && (
                          <span className="text-slate-400 text-xs">
                            {tx.tokenSymbol}
                          </span>
                        )}
                      </div>
                      {visibleColumns.timestamp && (
                        <div className="text-xs text-slate-500">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {visibleColumns.amount && (
                    <div className="text-right">
                      <div className="text-white text-sm font-medium">
                        {tx.amount.toFixed(4)} ETH
                      </div>
                      {visibleColumns.price && (
                        <div className="text-slate-400 text-xs">
                          @ ${tx.price.toFixed(8)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {visibleColumns.gasUsed && (
                    <div className="text-right">
                      <div className="text-slate-400 text-xs">
                        Gas: {(tx.gasUsed / 1000).toFixed(0)}K
                      </div>
                      <div className="text-slate-400 text-xs">
                        {tx.gasPrice} GWEI
                      </div>
                    </div>
                  )}
                  
                  {visibleColumns.profit && tx.profit !== undefined && (
                    <div className="text-right">
                      <div className={`text-sm font-medium ${tx.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.profit >= 0 ? '+' : ''}${tx.profit.toFixed(2)}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {tx.profit >= 0 ? 'Profit' : 'Loss'}
                      </div>
                    </div>
                  )}
                  
                  {visibleColumns.status && (
                    <Badge 
                      variant={tx.status === 'success' ? 'default' : tx.status === 'failed' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {tx.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
