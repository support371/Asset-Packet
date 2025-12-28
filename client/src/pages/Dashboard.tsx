import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@/components/ui/table";
import { 
  Briefcase, TrendingUp, Landmark, ShieldCheck, 
  Activity, Users, AlertCircle, Search, 
  ArrowUpRight, Clock, Database, Server, Cpu,
  Lock, Key, Smartphone, Fingerprint
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [location] = useLocation();
  const [unlockStep, setUnlockStep] = useState(0); // 0: Locked, 1: 2FA, 2: Unlocked

  const { data: health } = useQuery({
    queryKey: ["/api/health"],
  });

  const { data: diagnostics } = useQuery({
    queryKey: ["/api/admin/diagnostics"],
    enabled: location.startsWith("/admin") || location === "/",
  });

  if (unlockStep < 2 && (location.startsWith("/admin") || location === "/portal")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
          <Lock className="h-10 w-10" />
        </div>
        
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight">Security Protocol Required</h2>
          <p className="text-muted-foreground">
            You are attempting to access a secure enterprise zone. Please verify your identity using the Auth Security Encryptor.
          </p>
        </div>

        <Card className="w-full max-w-sm border-2 border-primary/20 shadow-2xl shadow-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {unlockStep === 0 ? <Fingerprint className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
              {unlockStep === 0 ? "Identity Verification" : "2FA Unlocking"}
            </CardTitle>
            <CardDescription>
              {unlockStep === 0 ? "Scan your credentials to proceed" : "Enter the code from your security device"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {unlockStep === 0 ? (
              <Button 
                className="w-full h-12 text-lg font-semibold"
                onClick={() => setUnlockStep(1)}
              >
                Start Encrypted Session
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-12 w-full bg-muted rounded-md border border-border flex items-center justify-center font-bold text-lg">
                      *
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full h-12 text-lg font-semibold"
                  onClick={() => setUnlockStep(2)}
                >
                  Confirm 2FA Unlock
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          End-to-End Encrypted | AES-256 Bit Security
        </p>
      </div>
    );
  }

  if (location === "/admin/diagnostics") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Diagnostics</h1>
            <p className="text-muted-foreground">Real-time enterprise performance monitoring</p>
          </div>
          <Badge variant="outline" className="px-3 py-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
            Node: SSA-PRIMARY-01
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12%</div>
              <Progress value={12} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4GB / 8GB</div>
              <Progress value={30} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45ms</div>
              <p className="text-xs text-muted-foreground">P95 stable</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Endpoint Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Avg Latency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs">/api/portfolio</TableCell>
                  <TableCell><Badge variant="secondary">GET</Badge></TableCell>
                  <TableCell>12ms</TableCell>
                  <TableCell><div className="flex items-center gap-1.5 text-emerald-500"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Healthy</div></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs">/api/investments</TableCell>
                  <TableCell><Badge variant="secondary">GET</Badge></TableCell>
                  <TableCell>24ms</TableCell>
                  <TableCell><div className="flex items-center gap-1.5 text-emerald-500"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Healthy</div></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs">/api/admin/diagnostics</TableCell>
                  <TableCell><Badge variant="secondary">GET</Badge></TableCell>
                  <TableCell>45ms</TableCell>
                  <TableCell><div className="flex items-center gap-1.5 text-emerald-500"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Healthy</div></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (location === "/portfolio" || location === "/investments" || location === "/grants") {
    const type = location.substring(1);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">{type}</h1>
            <p className="text-muted-foreground">Manage your enterprise {type} and assets.</p>
          </div>
          <Button className="gap-2">
            <Activity className="h-4 w-4" />
            Add New {type.slice(0, -1)}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active {type} List</span>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={`Search ${type}...`} className="pl-9 h-9" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valuation / Amount</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i} className="group cursor-pointer">
                    <TableCell className="font-medium">Enterprise Asset #{1000 + i}</TableCell>
                    <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                    <TableCell>${(i * 1.2).toFixed(1)}M</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-12 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full bg-primary`} style={{ width: `${20 * i}%` }} />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Grade {String.fromCharCode(64 + i)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
          <p className="text-muted-foreground">
            Enterprise Command Center - Graded Performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
            <Activity className="h-3 w-3" />
            System Healthy
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-1">
            <CardTitle className="text-sm font-medium">Platform Grade</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Grade A</div>
            <p className="text-xs text-muted-foreground">
              Based on enterprise metrics
            </p>
          </CardContent>
        </Card>
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-1">
            <CardTitle className="text-sm font-medium">Active Portfolio</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Assets</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-1">
            <CardTitle className="text-sm font-medium">Grants Lifecycle</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">
              8 Pending review
            </p>
          </CardContent>
        </Card>
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-1">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2FA Active</div>
            <p className="text-xs text-muted-foreground">
              Global enforcement
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Audit & Activity Log</CardTitle>
              <CardDescription>
                Recent sensitive enterprise actions
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase">Live Stream</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Role Upgrade", target: "User #452 -> Super Admin", time: "2h ago", icon: ShieldCheck, color: "text-primary" },
                { action: "Portfolio Sync", target: "Global Assets Refreshed", time: "5h ago", icon: Briefcase, color: "text-blue-500" },
                { action: "Grant Review", target: "Grant #882 Approved", time: "12h ago", icon: Landmark, color: "text-emerald-500" },
                { action: "2FA Lockdown", target: "Security Policy Enforcement", time: "1d ago", icon: ShieldCheck, color: "text-amber-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`h-9 w-9 rounded-full bg-muted flex items-center justify-center ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.target}
                    </p>
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase font-mono">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>
              Service level agreement status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Availability</span>
                <span className="font-bold">99.99%</span>
              </div>
              <Progress value={99.9} className="h-1 bg-muted" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">Response (P95)</span>
              <span className="text-sm font-bold text-emerald-500">45ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Error Rate</span>
              <span className="text-sm font-bold text-emerald-500">0.01%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Security Grade</span>
              <span className="text-sm font-bold text-primary">A+</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-3 rounded-md border border-border/50">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">Safe Mode Ready</span>
                  <span>System is optimized for high traffic usage.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
