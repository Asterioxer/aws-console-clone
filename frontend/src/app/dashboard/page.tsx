'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Database, Users, CreditCard, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    instances: { total: 0, running: 0 },
    s3: { buckets: 0 },
    billing: { amount: '0.00', unit: 'USD' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ec2Res, s3Res, billingRes] = await Promise.all([
          fetchAPI('/ec2/instances').catch(() => ({ instances: [] })),
          fetchAPI('/s3/buckets').catch(() => ({ buckets: [] })),
          fetchAPI('/billing/current').catch(() => ({ total: { amount: '0.00', unit: 'USD' } }))
        ]);

        const instances = ec2Res.instances || [];
        setMetrics({
          instances: {
            total: instances.length,
            running: instances.filter((i: any) => i.state === 'running').length
          },
          s3: { buckets: (s3Res.buckets || []).length },
          billing: billingRes.total || { amount: '0.00', unit: 'USD' }
        });
      } catch (err: any) {
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Instances</CardTitle>
            <Server className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{loading ? '-' : metrics.instances.total}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-500">{loading ? '-' : metrics.instances.running} running</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">S3 Buckets</CardTitle>
            <Database className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{loading ? '-' : metrics.s3.buckets}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Current Month Cost</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? '-' : `$${metrics.billing.amount}`}
            </div>
            <p className="text-xs text-slate-500 mt-1">Estimated</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">System Status</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">Healthy</div>
            <p className="text-xs text-slate-500 mt-1">All services operational</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
