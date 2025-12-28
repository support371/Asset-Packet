import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Briefcase, TrendingUp, Landmark, ShieldCheck, 
  Activity, Users, ArrowUpRight, AlertCircle 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [location] = useLocation();

  const { data: health } = useQuery({
    queryKey: ["/api/health"],
  });

  const { data: diagnostics } = useQuery({
    queryKey: ["/api/admin/diagnostics"],
    enabled: location.startsWith("/admin"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {location === "/" ? "Executive Overview" : 
             location.substring(1).charAt(0).toUpperCase() + location.substring(2)}
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
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Audit log of sensitive enterprise actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Admin Role Modified
                    </p>
                    <p className="text-sm text-muted-foreground">
                      User ID #452 updated to Super Admin
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    2h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Diagnostics</CardTitle>
            <CardDescription>
              Real-time health monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Latency</span>
              <span className="text-sm font-bold text-emerald-500">45ms (P95)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <span className="text-sm font-bold text-emerald-500">0.01%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bundle Size</span>
              <span className="text-sm font-bold text-emerald-500">Optimized</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                <AlertCircle className="h-3 w-3" />
                Safe Mode is currently DISABLED
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
