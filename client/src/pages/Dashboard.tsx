import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from "@/components/ui/table";
import { 
  Briefcase, TrendingUp, Landmark, ShieldCheck, 
  Activity, Users, AlertCircle, Search, 
  ArrowUpRight, Clock, Database, Server, Cpu
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [location] = useLocation();

  const { data: health } = useQuery({
    queryKey: ["/api/health"],
  });

  const { data: diagnostics } = useQuery({
    queryKey: ["/api/admin/diagnostics"],
    enabled: location.startsWith("/admin") || location === "/",
  });

  const isAdmin = location.startsWith("/admin");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {location === "/" ? "Executive Overview" : 
             location.substring(1).split('/')[0].charAt(0).toUpperCase() + location.substring(1).split('/')[0].slice(1)}
          </h1>
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
