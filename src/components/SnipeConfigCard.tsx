/**
 * Individual snipe configuration card component
 */

import React, { useState } from 'react';
import { Target, Settings, Trash2, Play, Pause, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { HelpTooltip } from './HelpTooltip';
import { AdvancedSettings } from './AdvancedSettings';
import { SnipeConfig, MarketData } from '../types/trading';

interface SnipeConfigCardProps {
  config: SnipeConfig;
  marketData?: MarketData;
  onUpdate: (id: string, updates: Partial<SnipeConfig>) => void;
  onRemove: (id: string) => void;
}

export function SnipeConfigCard({ config, marketData, onUpdate, onRemove }: SnipeConfigCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);
  const [userConfirmed, setUserConfirmed] = useState(false);

  const handleSave = () => {
    onUpdate(config.id, editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const formatPrice = (price: number) => {
    return price.toFixed(8);
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  // Validation for safe trading
  const isConfigurationValid = () => {
    return (
      config.targetPrice > 0 &&
      config.maxPrice > 0 &&
      config.amount > 0 &&
      config.slippage > 0 &&
      config.maxPrice >= config.targetPrice &&
      config.amount <= 10 && // Reasonable max amount
      config.slippage <= 50 && // Reasonable max slippage
      userConfirmed
    );
  };

  const getValidationMessage = () => {
    if (config.targetPrice <= 0) return "Please set a target price";
    if (config.maxPrice <= 0) return "Please set a maximum price";
    if (config.amount <= 0) return "Please set an amount to trade";
    if (config.slippage <= 0) return "Please set slippage tolerance";
    if (config.maxPrice < config.targetPrice) return "Max price must be >= target price";
    if (config.amount > 10) return "Amount seems too high (>10 ETH)";
    if (config.slippage > 50) return "Slippage seems too high (>50%)";
    if (!userConfirmed) return "Please confirm your settings below";
    return "";
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <span className="font-mono text-sm">
              {config.tokenAddress.slice(0, 8)}...{config.tokenAddress.slice(-6)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={config.enabled ? "default" : "secondary"}
              className={config.enabled ? "bg-green-600 text-white border-green-500" : "bg-slate-600 text-slate-200 border-slate-500"}
            >
              {config.enabled ? 'Active' : 'Inactive'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-slate-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(config.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {marketData && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-800 rounded-lg">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-xs">Current Price</span>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-600">~{Math.floor((Date.now() - marketData.timestamp) / 1000)}s ago</span>
                </div>
              </div>
              <div className="text-white font-semibold">${formatPrice(marketData.price)}</div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">5m Change</span>
              <div className={`font-semibold flex items-center gap-1 ${getPriceChangeColor(marketData.priceChange5m)}`}>
                {marketData.priceChange5m > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {marketData.priceChange5m.toFixed(2)}%
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">Liquidity</span>
              <div className="text-white font-semibold">${(marketData.liquidity / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">Holders</span>
              <div className="text-white font-semibold">{marketData.holders.toLocaleString()}</div>
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Label htmlFor="targetPrice" className="text-slate-300">Target Price</Label>
                  <HelpTooltip
                    title="Target Price"
                    content="The ideal price you want to buy the token at. The bot will try to execute trades at or below this price."
                    size="md"
                  />
                </div>
                <Input
                  id="targetPrice"
                  type="number"
                  step="0.00000001"
                  value={editConfig.targetPrice}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, targetPrice: parseFloat(e.target.value) }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Label htmlFor="maxPrice" className="text-slate-300">Max Price</Label>
                  <HelpTooltip
                    title="Maximum Price"
                    content="The highest price you're willing to pay. This acts as a safety limit to prevent buying at extremely high prices during volatile moments."
                    size="md"
                  />
                </div>
                <Input
                  id="maxPrice"
                  type="number"
                  step="0.00000001"
                  value={editConfig.maxPrice}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Label htmlFor="amount" className="text-slate-300">Amount (ETH)</Label>
                  <HelpTooltip
                    title="Trade Amount"
                    content="How much ETH you want to spend on this token. This is the total amount that will be used to buy the token when the conditions are met."
                    size="md"
                  />
                </div>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={editConfig.amount}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Label htmlFor="slippage" className="text-slate-300">Slippage (%)</Label>
                  <HelpTooltip
                    title="Slippage Tolerance"
                    content="The maximum price difference you'll accept between when you submit the trade and when it executes. Higher slippage = more likely to execute but potentially worse price."
                    size="md"
                  />
                </div>
                <Input
                  id="slippage"
                  type="number"
                  step="0.1"
                  value={editConfig.slippage}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, slippage: parseFloat(e.target.value) }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={editConfig.enabled}
                onCheckedChange={(checked) => setEditConfig(prev => ({ ...prev, enabled: checked }))}
              />
              <Label htmlFor="enabled" className="text-slate-300">Enable Sniping</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-slate-600 text-slate-300">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-4">
              {/* Current vs Target Price Comparison */}
              <div className="p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-sm">Current Price:</span>
                    <HelpTooltip
                      title="Current Market Price"
                      content="The current trading price of this token on the market. This updates in real-time."
                      size="md"
                    />
                  </div>
                  <div className="text-white font-semibold">${formatPrice(0.00009850)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-sm">Your Target:</span>
                    <HelpTooltip
                      title="Your Target Price"
                      content="The price you want to buy at. The bot will execute when the market price reaches this level."
                      size="md"
                    />
                  </div>
                  <div className="text-white font-semibold">${formatPrice(config.targetPrice)}</div>
                </div>
                <div className="mt-2 text-xs">
                  {config.targetPrice > 0.00009850 ? (
                    <span className="text-red-400">⚠️ Target above current price - may execute immediately</span>
                  ) : (
                    <span className="text-green-400">✓ Waiting for price to drop to target</span>
                  )}
                </div>
              </div>

              {/* Configuration Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Max Price:</span>
                    <HelpTooltip
                      title="Maximum Price"
                      content="The highest price you're willing to pay. This acts as a safety limit to prevent buying at extremely high prices during volatile moments."
                      size="md"
                    />
                  </div>
                  <div className="text-white font-semibold">${formatPrice(config.maxPrice)}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Amount:</span>
                    <HelpTooltip
                      title="Trade Amount"
                      content="How much ETH you want to spend on this token. This is the total amount that will be used to buy the token when the conditions are met."
                      size="md"
                    />
                  </div>
                  <div className="text-white font-semibold">{config.amount} ETH</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Slippage:</span>
                    <HelpTooltip
                      title="Slippage Tolerance"
                      content="The maximum price difference you'll accept between when you submit the trade and when it executes. Higher slippage = more likely to execute but potentially worse price."
                      size="md"
                    />
                  </div>
                  <div className="text-white font-semibold">{config.slippage}%</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Status:</span>
                    <HelpTooltip
                      title="Snipe Status"
                      content="Whether this snipe configuration is actively monitoring the market for your target price."
                      size="md"
                    />
                  </div>
                  <div className="text-white font-semibold">
                    {config.enabled ? 'Active' : 'Paused'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <AdvancedSettings
                config={config}
                onUpdate={(updates) => onUpdate(config.id, updates)}
              />

              {/* Safety Confirmation */}
              {!config.enabled && (
                <div className="p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold text-sm">Safety Check</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="confirm-settings"
                        checked={userConfirmed}
                        onCheckedChange={setUserConfirmed}
                      />
                      <Label htmlFor="confirm-settings" className="text-yellow-300 text-sm">
                        I have reviewed my settings and understand the risks
                      </Label>
                    </div>
                    {!isConfigurationValid() && (
                      <div className="text-red-400 text-xs mt-1">
                        ⚠️ {getValidationMessage()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={() => onUpdate(config.id, { enabled: !config.enabled })}
                disabled={!config.enabled && !isConfigurationValid()}
                className={`w-full ${
                  config.enabled 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : isConfigurationValid() 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                {config.enabled ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Sniping
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {isConfigurationValid() ? 'Start Sniping' : 'Configure Settings First'}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
