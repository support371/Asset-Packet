import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Briefcase, ShieldCheck, 
  Activity, ArrowUpRight, 
  Zap, BarChart3, Layers, UserPlus, Lock, Fingerprint, Smartphone, Globe, Mail, Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Portfolio, Communication, AuditLog } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const teamMembers = [
  { name: "John Doe", role: "GEM Lead", division: "GEM", initials: "JD", color: "bg-blue-700" },
  { name: "Jane Smith", role: "Alliance Director", division: "Alliance", initials: "JS", color: "bg-amber-600" },
  { name: "Robert Chen", role: "Cyber Analyst", division: "GEM", initials: "RC", color: "bg-blue-600" },
  { name: "Sarah Miller", role: "Asset Manager", division: "Alliance", initials: "SM", color: "bg-amber-500" },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [unlockStep, setUnlockStep] = useState(0); 
  const [gradeScore, setGradeScore] = useState(99.99);
  const [filter, setFilter] = useState("all");

  const { data: portfolioItems } = useQuery<Portfolio[]>({ queryKey: ["/api/portfolio"] });
  const { data: communications } = useQuery<Communication[]>({ queryKey: ["/api/communications"] });
  const { data: logs } = useQuery<AuditLog[]>({ queryKey: ["/api/audit-logs"] });
  const { data: diagnostics } = useQuery<{ uptime?: string; latency?: string; grade?: string }>({ 
    queryKey: ["/api/admin/diagnostics"],
    enabled: unlockStep === 2 
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGradeScore(prev => Math.min(100, Math.max(99.95, prev + (Math.random() - 0.5) * 0.01)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => [
    { title: "Network Grade", value: diagnostics?.grade || "AAA+", icon: Zap, color: "text-amber-500" },
    { title: "Portfolio Assets", value: portfolioItems?.length ?? "0", icon: Briefcase, color: "text-blue-500" },
    { title: "Newsletters", value: communications?.length ?? "0", icon: Mail, color: "text-primary" },
    { title: "Security Layer", value: diagnostics?.uptime || "99.99%", icon: ShieldCheck, color: "text-emerald-500" },
  ], [diagnostics, portfolioItems, communications]);

  if (unlockStep < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 flex flex-col items-center space-y-6">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-2xl relative">
            <Lock className="h-10 w-10 relative z-10" />
          </div>
          <div className="text-center space-y-3 max-w-md">
            <h2 className="text-3xl font-bold tracking-tight">Enterprise Shield</h2>
            <p className="text-muted-foreground leading-relaxed">Multi-region administrative access requires biometric verification.</p>
          </div>
          <Card className="w-full max-w-sm bg-card/50 backdrop-blur-xl border-primary/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                {unlockStep === 0 ? <Fingerprint className="h-5 w-5 text-primary" /> : <Smartphone className="h-5 w-5 text-primary" />}
                {unlockStep === 0 ? "Biometric Uplink" : "MFA Handshake"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full h-14 font-bold text-lg hover-elevate active-elevate-2 shadow-lg shadow-primary/20" onClick={() => setUnlockStep(unlockStep + 1)}>
                {unlockStep === 0 ? "Initialize Secure Session" : "Authorize Portal Unlock"}
              </Button>
            </CardContent>
          </Card>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> RSA-4096</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Global Mesh</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] font-black tracking-tighter uppercase px-2 bg-primary/5 text-primary border-primary/10">
              Tier 1 Enterprise
            </Badge>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Node: ID-X99</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/50">
            Global Command
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">Enterprise multi-tenant infrastructure monitoring and synchronization.</p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reliability Index</span>
            <span className="text-2xl font-black text-emerald-500 tabular-nums">{gradeScore.toFixed(3)}%</span>
          </div>
          <div className="h-10 w-[1px] bg-border/50" />
          <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="group hover-elevate transition-all border-border/40 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
              <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tight">Active Protocol</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section id="team" className="space-y-6">
        <div className="flex items-center justify-between border-l-4 border-primary pl-4 py-1">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Team Command Center</h2>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-0.5">Personnel Directory v4.1</p>
          </div>
          <div className="flex gap-2">
            {["all", "GEM", "Alliance"].map((d) => (
              <Button key={d} variant={filter === d ? "default" : "outline"} size="sm" onClick={() => setFilter(d)} className="rounded-full px-4 capitalize font-bold text-xs">
                {d === "all" ? "All Units" : d}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.filter(m => filter === "all" || m.division === filter).map((member, i) => (
            <Card key={i} className="group hover-elevate active-elevate-2 transition-all text-center p-6 border-border/40">
              <div className="flex justify-center mb-4">
                <div className="p-1 rounded-2xl border-2 border-primary/10 shadow-xl group-hover:scale-105 transition-transform">
                  <Avatar className="h-20 w-20 rounded-xl">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${member.initials}&background=${member.color.replace('bg-', '')}&color=fff&size=128&bold=true`} />
                    <AvatarFallback className={`${member.color} text-white font-bold`}>{member.initials}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{member.name}</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{member.role}</p>
              <div className="mt-4 pt-4 border-t border-border/40">
                <Badge variant="secondary" className="text-[9px] uppercase font-black px-2 py-0.5">
                  {member.division} SECURED
                </Badge>
              </div>
            </Card>
          ))}
          <Card className="border-2 border-dashed border-border/40 flex flex-col items-center justify-center p-6 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10">
              <UserPlus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">Provision Unit</p>
          </Card>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-border/40 shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50 py-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">Infrastructure Activity</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-wider">High-fidelity audit stream</CardDescription>
              </div>
              <Badge variant="outline" className="animate-pulse bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[9px] font-black">Live Feed</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {logs?.map((log) => (
                <div key={log.id} className="flex items-center gap-6 p-6 hover:bg-muted/10 transition-colors group cursor-pointer">
                  <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                    <Layers className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm tracking-tight">{log.action}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>{log.targetType}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span>{formatDistanceToNow(new Date(log.createdAt || Date.now()))} ago</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-black text-[9px] uppercase border-emerald-500/20 text-emerald-500">
                    VERIFIED
                  </Badge>
                </div>
              ))}
              {(!logs || logs.length === 0) && (
                <div className="p-12 text-center space-y-2">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto opacity-20" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Logs...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-border/40 bg-muted/5">
          <CardHeader className="border-b border-border/50 py-6">
            <CardTitle className="text-xl font-bold">Health Metrics</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Node Latency & Throughput</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                <span className="text-muted-foreground">API Throughput</span>
                <span>84.2k req/s</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden border border-border/20">
                <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5 }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-1">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">P99 Latency</span>
                <p className="text-xl font-black tabular-nums">{diagnostics?.latency || "4.2ms"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-1">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Uptime</span>
                <p className="text-xl font-black tabular-nums text-emerald-500">{diagnostics?.uptime || "99.999"}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest">Zero Trust Protocol</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">
                Global 2FA enforcement active. All administrative nodes verified via hardware security keys.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
