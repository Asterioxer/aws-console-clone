'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Square, RotateCw, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EC2Page() {
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<any>(null);

  const loadInstances = async () => {
    try {
      const res = await fetchAPI('/ec2/instances');
      setInstances(res.instances || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load instances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstances();
  }, []);

  const handleAction = async (id: string, action: 'start' | 'stop' | 'reboot') => {
    setActionLoading(`${action}-${id}`);
    try {
      await fetchAPI(`/ec2/instances/${id}/${action}`, { method: 'POST' });
      toast.success(`Instance ${action} initiated`);
      setTimeout(loadInstances, 2000); // Reload after a delay
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} instance`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'running': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'stopped': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">EC2 Instances</h1>
        <Button onClick={loadInstances} variant="outline" className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
          <RotateCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Instance ID</TableHead>
                <TableHead className="text-slate-400">Instance State</TableHead>
                <TableHead className="text-slate-400">Instance Type</TableHead>
                <TableHead className="text-slate-400">Availability Zone</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : instances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No instances found
                  </TableCell>
                </TableRow>
              ) : (
                instances.map((inst) => (
                  <TableRow 
                    key={inst.id} 
                    className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedInstance(inst)}
                  >
                    <TableCell className="font-medium text-white">{inst.name}</TableCell>
                    <TableCell className="text-slate-400">{inst.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(inst.state)}>
                        {inst.state}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{inst.type}</TableCell>
                    <TableCell className="text-slate-400">{inst.az}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                          disabled={inst.state === 'running' || actionLoading !== null}
                          onClick={() => handleAction(inst.id, 'start')}
                        >
                          {actionLoading === `start-${inst.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          disabled={inst.state === 'stopped' || actionLoading !== null}
                          onClick={() => handleAction(inst.id, 'stop')}
                        >
                          {actionLoading === `stop-${inst.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                          disabled={actionLoading !== null}
                          onClick={() => handleAction(inst.id, 'reboot')}
                        >
                          {actionLoading === `reboot-${inst.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={selectedInstance !== null} onOpenChange={(open) => !open && setSelectedInstance(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Instance Details</DialogTitle>
          </DialogHeader>
          {selectedInstance && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium text-slate-400">Instance ID</span>
                <span className="col-span-3 text-sm">{selectedInstance.id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium text-slate-400">Public IP</span>
                <span className="col-span-3 text-sm">{selectedInstance.publicIp || 'None'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium text-slate-400">Launch Time</span>
                <span className="col-span-3 text-sm">{new Date(selectedInstance.launchTime).toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
