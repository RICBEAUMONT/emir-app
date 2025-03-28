'use client'

import React from 'react';
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  Calendar 
} from "lucide-react"

// Placeholder data - replace with real data from your backend
const metrics = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users
  },
  {
    title: "Active Sessions",
    value: "456",
    change: "+8%",
    trend: "up",
    icon: Activity
  },
  {
    title: "Average Time",
    value: "12m",
    change: "-2%",
    trend: "down",
    icon: Clock
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp
  }
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500">Track your application's performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Last 30 days</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                <p className={`text-sm mt-2 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change} from last period
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <metric.icon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Overview</h2>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <BarChart3 className="h-12 w-12 text-gray-400" />
              <p className="ml-2 text-gray-500">Activity chart coming soon</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">User Demographics</h2>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <Users className="h-12 w-12 text-gray-400" />
              <p className="ml-2 text-gray-500">User demographics chart coming soon</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Engagement Metrics</h2>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <Activity className="h-12 w-12 text-gray-400" />
              <p className="ml-2 text-gray-500">Engagement metrics coming soon</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Revenue Analysis</h2>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <TrendingUp className="h-12 w-12 text-gray-400" />
              <p className="ml-2 text-gray-500">Revenue charts coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 