import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Briefcase, ShieldCheck, 
  Activity, ArrowUpRight, 
  Zap, BarChart3, Layers, UserPlus, Lock, Fingerprint, Smartphone, Globe
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
  { name: "John Doe", role: "GEM Lead", division: "GEM", initials: "JD", color: "bg-blue-700" },
  { name: "Jane Smith", role: "Alliance Director", division: "Alliance", initials: "JS", color: "bg-amber-600" },
  { name: "Robert Chen", role: "Cyber Analyst", division: "GEM", initials: "RC", color: "bg-blue-600" },
  { name: "Sarah Miller", role: "Asset Manager", division: "Alliance", initials: "SM", color: "bg-amber-500" },
];

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const [unlockStep, setUnlockStep] = useState(0); 
  const [gradeScore, setGradeScore] = useState(98);
  const [filter, setFilter] = useState("all");

  const { data: portfolioItems } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  const { data: diagnostics } = useQuery({
    queryKey: ["/api/admin/diagnostics"],
    enabled: unlockStep === 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGradeScore(prev => Math.min(100, Math.max(95, prev + (Math.random() - 0.5))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (unlockStep < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center space-y-6"
        >
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl animate-ping group-hover:animate-none opacity-20" />
            <Lock className="h-10 w-10 relative z-10" />
          </div>
          
          <div className="text-center space-y-3 max-w-md">
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Identity Synchronization
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Global usage detected. Secure enterprise protocol required for multi-region access.
            </p>
          </div>

          <Card className="w-full max-w-sm border border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                {unlockStep === 0 ? <Fingerprint className="h-5 w-5 text-primary" /> : <Smartphone className="h-5 w-5 text-primary" />}
                {unlockStep === 0 ? "Biometric Uplink" : "2FA Authorization"}
              </CardTitle>
              <CardDescription>
                {unlockStep === 0 ? "Initiating encrypted handshake" : "Verifying multi-factor token"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                {unlockStep === 0 ? (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Button 
                      className="w-full h-14 text-lg font-bold hover-elevate active-elevate-2 shadow-lg shadow-primary/20"
                      onClick={() => setUnlockStep(1)}
                    >
                      Initialize Session
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-14 w-full bg-muted/50 rounded-xl border border-border flex items-center justify-center font-bold text-xl text-primary shadow-inner">
                          {i < 4 ? "•" : ""}
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full h-14 text-lg font-bold hover-elevate active-elevate-2 shadow-lg shadow-primary/20"
                      onClick={() => setUnlockStep(2)}
                    >
                      Unlock Portal
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
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
    <div className="space-y-10 pb-10">
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
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Real-time synchronization across multi-tenant infrastructures with graded performance optimization.
          </p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reliability Score</span>
            <span className="text-2xl font-black tabular-nums text-emerald-500">{gradeScore.toFixed(2)}%</span>
          </div>
          <div className="h-10 w-[1px] bg-border/50" />
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Network Grade", value: "AAA+", sub: "Top 0.1% Global", icon: Zap, color: "text-amber-500" },
          { title: "Portfolio Assets", value: portfolioItems?.length || "--", sub: "Distributed Mesh", icon: Briefcase, color: "text-blue-500" },
          { title: "Liquidity Index", value: "92.4", sub: "Market Optimized", icon: BarChart3, color: "text-primary" },
          { title: "Security Layer", value: diagnostics?.uptime || "99.99%", sub: "Zero Trust Protocol", icon: ShieldCheck, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="group hover-elevate transition-all border-border/40 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
              <p className="text-[10px] font-bold text-muted-foreground mt-1 flex items-center gap-1 uppercase">
                {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Command Center Rebuild */}
      <section id="team" className="space-y-6">
        <div className="flex items-center justify-between border-l-4 border-primary pl-4 py-1">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Team Command Center</h2>
            <p className="text-muted-foreground text-sm font-medium">Personnel Directory v4.0 | Color-Coded Mesh</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter("all")}
              className="rounded-full px-4"
            >
              All Units
            </Button>
            <Button 
              variant={filter === "GEM" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter("GEM")}
              className="rounded-full px-4 border-blue-500/20 text-blue-600 hover:bg-blue-500/5"
            >
              GEM (Cyber)
            </Button>
            <Button 
              variant={filter === "Alliance" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter("Alliance")}
              className="rounded-full px-4 border-amber-500/20 text-amber-600 hover:bg-amber-500/5"
            >
              Alliance (Realty)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers
            .filter(m => filter === "all" || m.division === filter)
            .map((member, i) => (
              <Card key={i} className="group hover-elevate transition-all border-border/40 overflow-hidden text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className={`p-1 rounded-2xl border-4 ${member.division === "GEM" ? "border-blue-700/20" : "border-amber-600/20"} shadow-xl group-hover:scale-105 transition-transform`}>
                    <Avatar className="h-20 w-20 rounded-xl">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${member.initials}&background=${member.color.replace('bg-', '')}&color=fff&size=128&bold=true`} />
                      <AvatarFallback className={`${member.color} text-white font-bold text-2xl`}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{member.role}</p>
                <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="text-[9px] uppercase font-black px-2">
                    {member.division}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setLocation(`/team/${member.name.toLowerCase().replace(' ', '-')}`)}>
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          <Card className="border-2 border-dashed border-border/40 flex flex-col items-center justify-center p-6 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <UserPlus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Provision Unit</p>
          </Card>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-border/40 shadow-xl shadow-foreground/5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b border-border/50 py-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Infrastucture Activity</CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-wider">High-fidelity audit stream</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Live Feed</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {[
                { action: "Core Auth Synchronization", user: "Node-SGP-1", time: "12s ago", status: "Verified" },
                { action: "Cross-Tenant Asset Migration", user: "Admin-X", time: "2m ago", status: "Complete" },
                { action: "Grants Allocation Cycle", user: "System", time: "14m ago", status: "Optimized" },
                { action: "Security Policy Propagated", user: "Global-Root", time: "45m ago", status: "Secure" },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-6 p-6 hover:bg-muted/10 transition-colors group cursor-pointer" onClick={() => setLocation(`/logs/${i}`)}>
                  <div className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors shadow-sm">
                    <Layers className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-sm tracking-tight">{log.action}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>{log.user}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span>{log.time}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-black text-[9px] uppercase tracking-tighter border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-border/40 bg-muted/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Service Health</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-wider">Latency & Throughput</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-muted-foreground">API Throughput</span>
                <span>84.2k req/s</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden border border-border/20">
                <motion.div 
                  className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">P99 Latency</span>
                <p className="text-xl font-black tabular-nums">{diagnostics?.latency || "4.2ms"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Uptime</span>
                <p className="text-xl font-black tabular-nums text-emerald-500">{diagnostics?.uptime || "99.99"}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 group cursor-help transition-all hover:bg-primary/10">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wide">Enterprise Shield</p>
                  <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                    Global 2FA enforcement and hardware security keys enabled for all administrative nodes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
