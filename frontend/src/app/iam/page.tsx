'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Shield, Loader2 } from 'lucide-react';

export default function IAMPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          fetchAPI('/iam/users'),
          fetchAPI('/iam/roles')
        ]);
        setUsers(usersRes.users || []);
        setRoles(rolesRes.roles || []);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load IAM data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Identity and Access Management</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-lg mb-8">
          <TabsTrigger value="users" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-md px-6">
            <User className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-md px-6">
            <Shield className="w-4 h-4 mr-2" />
            Roles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">IAM Users</CardTitle>
              <CardDescription className="text-slate-400">Manage your AWS account users and their access.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Username</TableHead>
                    <TableHead className="text-slate-400">User ID</TableHead>
                    <TableHead className="text-slate-400">Created</TableHead>
                    <TableHead className="text-right text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-500" />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-500">No users found</TableCell>
                    </TableRow>
                  ) : (
                    users.map(user => (
                      <TableRow key={user.UserId} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-200">{user.UserName}</TableCell>
                        <TableCell className="text-slate-400 text-sm font-mono">{user.UserId}</TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {new Date(user.CreateDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">IAM Roles</CardTitle>
              <CardDescription className="text-slate-400">Roles that can be assumed by trusted entities.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Role Name</TableHead>
                    <TableHead className="text-slate-400">Role ID</TableHead>
                    <TableHead className="text-slate-400">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-500" />
                      </TableCell>
                    </TableRow>
                  ) : roles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-slate-500">No roles found</TableCell>
                    </TableRow>
                  ) : (
                    roles.map(role => (
                      <TableRow key={role.RoleId} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-200">{role.RoleName}</TableCell>
                        <TableCell className="text-slate-400 text-sm font-mono">{role.RoleId}</TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {new Date(role.CreateDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
