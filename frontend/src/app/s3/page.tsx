'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Database, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function S3Page() {
  const [buckets, setBuckets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [objectsLoading, setObjectsLoading] = useState(false);

  useEffect(() => {
    const loadBuckets = async () => {
      try {
        const res = await fetchAPI('/s3/buckets');
        setBuckets(res.buckets || []);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load buckets');
      } finally {
        setLoading(false);
      }
    };
    loadBuckets();
  }, []);

  const handleBucketClick = async (bucketName: string) => {
    setSelectedBucket(bucketName);
    setObjectsLoading(true);
    try {
      const res = await fetchAPI(`/s3/buckets/${bucketName}/objects`);
      setObjects(res.objects || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load objects');
    } finally {
      setObjectsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">S3 Buckets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : buckets.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 py-12">No buckets found</div>
        ) : (
          buckets.map(bucket => (
            <Card 
              key={bucket.Name} 
              className="bg-slate-900 border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-900/20"
              onClick={() => handleBucketClick(bucket.Name)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white break-all">{bucket.Name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Created {new Date(bucket.CreationDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={selectedBucket !== null} onOpenChange={(open) => !open && setSelectedBucket(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              {selectedBucket} Objects
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400 text-right">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {objectsLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-500" />
                    </TableCell>
                  </TableRow>
                ) : objects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-slate-500">
                      Bucket is empty
                    </TableCell>
                  </TableRow>
                ) : (
                  objects.map(obj => (
                    <TableRow key={obj.Key} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        {obj.Key}
                      </TableCell>
                      <TableCell className="text-right text-slate-400">
                        {(obj.Size / 1024).toFixed(2)} KB
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
