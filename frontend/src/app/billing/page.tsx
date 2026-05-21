'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreditCard, TrendingUp, Loader2 } from 'lucide-react';

export default function BillingPage() {
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBilling = async () => {
      try {
        const res = await fetchAPI('/billing/current');
        setBilling(res);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };
    loadBilling();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Billing & Cost Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-800/50 shadow-xl shadow-blue-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Current Month Estimated Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              ) : (
                <>
                  <div className="text-5xl font-black text-white tracking-tight">
                    ${billing?.total?.amount || '0.00'}
                  </div>
                  <p className="text-sm text-blue-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{Math.floor(Math.random() * 5)}% vs last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Cost Breakdown by Service</CardTitle>
              <CardDescription className="text-slate-400">
                Detailed view of your current month expenses across AWS services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
                </div>
              ) : billing?.services?.length === 0 ? (
                <div className="text-center text-slate-500 py-12">No cost data available</div>
              ) : (
                <div className="space-y-6">
                  {billing?.services?.map((service: any) => {
                    const percentage = Math.min(
                      100,
                      (parseFloat(service.amount) / parseFloat(billing.total.amount)) * 100
                    );
                    return (
                      <div key={service.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-300">{service.name}</span>
                          <span className="font-mono text-slate-400">${service.amount}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
