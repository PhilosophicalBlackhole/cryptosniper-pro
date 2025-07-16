/**
 * User dashboard component for authenticated users
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  Crown, 
  BarChart3,
  MessageSquare,
  BookOpen,
  CreditCard,
  History,
  Bell,
  ChevronDown
} from 'lucide-react';

interface UserDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    plan: 'free' | 'pro' | 'premium';
    avatar?: string | null;
  };
  onLogout: () => void;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export function UserDashboard({ user, onLogout, onNavigate, children }: UserDashboardProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPlanBadge = () => {
    switch (user.plan) {
      case 'free':
        return <Badge variant="secondary">Free</Badge>;
      case 'pro':
        return <Badge className="bg-blue-600 text-white">Pro</Badge>;
      case 'premium':
        return <Badge className="bg-purple-600 text-white">Premium</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Trading Dashboard', 
      icon: BarChart3,
      available: true
    },
    { 
      id: 'history', 
      label: 'Trade History', 
      icon: History,
      available: true
    },
    { 
      id: 'tutorials', 
      label: 'Tutorials', 
      icon: BookOpen,
      available: true
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: MessageSquare,
      available: user.plan !== 'free'
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: CreditCard,
      available: true
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoSniper Pro</h1>
                <p className="text-slate-400 text-sm">Member Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>
              
              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 text-slate-300 hover:text-white"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                  {getPlanBadge()}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {showUserMenu && (
                  <Card className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border-slate-800 z-50">
                    <CardContent className="p-2">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          onClick={() => onNavigate('profile')}
                          className="w-full justify-start text-slate-300 hover:text-white"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile Settings
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => onNavigate('billing')}
                          className="w-full justify-start text-slate-300 hover:text-white"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Billing & Plans
                        </Button>
                        <hr className="my-2 border-slate-700" />
                        <Button
                          variant="ghost"
                          onClick={onLogout}
                          className="w-full justify-start text-red-400 hover:text-red-300"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-800 min-h-screen">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => item.available && onNavigate(item.id)}
                disabled={!item.available}
                className={`w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 ${
                  !item.available ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
                {!item.available && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    Pro
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
          
          {/* Upgrade prompt for free users */}
          {user.plan === 'free' && (
            <Card className="m-4 bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/50">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <Crown className="h-8 w-8 mx-auto text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold">Upgrade to Pro</h3>
                    <p className="text-slate-400 text-sm">
                      Unlock real trading & advanced features
                    </p>
                  </div>
                  <Button 
                    onClick={() => onNavigate('billing')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
