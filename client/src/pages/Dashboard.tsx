import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Briefcase, ShieldCheck, 
  Activity, ArrowUpRight, 
  Zap, BarChart3, Layers, UserPlus, Lock, Fingerprint, Smartphone, Globe, Mail
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Portfolio, Communication } from "@shared/schema";

const teamMembers = [
  { name: "John Doe", role: "GEM Lead", division: "GEM", initials: "JD", color: "bg-blue-700" },
  { name: "Jane Smith", role: "Alliance Director", division: "Alliance", initials: "JS", color: "bg-amber-600" },
  { name: "Robert Chen", role: "Cyber Analyst", division: "GEM", initials: "RC", color: "bg-blue-600" },
  { name: "Sarah Miller", role: "Asset Manager", division: "Alliance", initials: "SM", color: "bg-amber-500" },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [unlockStep, setUnlockStep] = useState(0); 
  const [gradeScore, setGradeScore] = useState(98);
  const [filter, setFilter] = useState("all");

  const { data: portfolioItems } = useQuery<Portfolio[]>({ queryKey: ["/api/portfolio"] });
  const { data: communications } = useQuery<Communication[]>({ queryKey: ["/api/communications"] });
  const { data: diagnostics } = useQuery<{ uptime?: string; latency?: string }>({ 
    queryKey: ["/api/admin/diagnostics"],
    enabled: unlockStep === 2 
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
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 flex flex-col items-center space-y-6">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-2xl relative">
            <Lock className="h-10 w-10 relative z-10" />
          </div>
          <div className="text-center space-y-3 max-w-md">
            <h2 className="text-3xl font-bold tracking-tight">Identity Synchronization</h2>
            <p className="text-muted-foreground leading-relaxed">Global usage detected. Secure enterprise protocol required.</p>
          </div>
          <Card className="w-full max-w-sm bg-card/50 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                {unlockStep === 0 ? <Fingerprint className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                {unlockStep === 0 ? "Biometric Uplink" : "2FA Authorization"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full h-14 font-bold" onClick={() => setUnlockStep(unlockStep + 1)}>
                {unlockStep === 0 ? "Initialize Session" : "Unlock Portal"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Global Command</h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">Enterprise multi-tenant infrastructure command center.</p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reliability Score</span>
            <span className="text-2xl font-black text-emerald-500">{gradeScore.toFixed(2)}%</span>
          </div>
          <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Network Grade", value: "AAA+", icon: Zap, color: "text-amber-500" },
          { title: "Portfolio Assets", value: portfolioItems?.length ?? "2", icon: Briefcase, color: "text-blue-500" },
          { title: "Newsletters", value: communications?.length ?? "1", icon: Mail, color: "text-primary" },
          { title: "Security Layer", value: diagnostics?.uptime ?? "99.99%", icon: ShieldCheck, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="hover-elevate transition-all border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section id="team" className="space-y-6">
        <div className="flex items-center justify-between border-l-4 border-primary pl-4 py-1">
          <h2 className="text-2xl font-bold tracking-tight">Team Command Center</h2>
          <div className="flex gap-2">
            {["all", "GEM", "Alliance"].map((d) => (
              <Button key={d} variant={filter === d ? "default" : "outline"} size="sm" onClick={() => setFilter(d)} className="rounded-full px-4 capitalize">
                {d === "all" ? "All Units" : d}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.filter(m => filter === "all" || m.division === filter).map((member, i) => (
            <Card key={i} className="group hover-elevate transition-all text-center p-6">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20 rounded-xl border-4 border-primary/10 shadow-xl">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${member.initials}&background=${member.color.replace('bg-', '')}&color=fff&size=128&bold=true`} />
                  <AvatarFallback className={`${member.color} text-white`}>{member.initials}</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{member.role}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(communications) && communications.map((comm: any) => (
              <div key={comm.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">{comm.title}</p>
                  <p className="text-xs text-muted-foreground">{comm.content.substring(0, 60)}...</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
