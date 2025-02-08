import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Globe, MessageSquare } from 'lucide-react';

interface AnalyticsData {
  globalQueries: number;
  userCount: number;
  averageQueriesPerUser: number;
}

const SimpleAnalytics: React.FC<{ data: AnalyticsData }> = ({ data }) => {
  return (<> 
  <h1 className="text-2xl font-bold">Global Analytics</h1>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Global Queries</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.globalQueries.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Count</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.userCount.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Queries/User</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.averageQueriesPerUser.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default SimpleAnalytics;
