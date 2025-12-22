import { Link, useLocation } from "wouter";
import { FileText, LayoutDashboard, Settings, LogOut, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Packet } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SidebarProps {
  packets?: Packet[];
  isLoading?: boolean;
}

export function Sidebar({ packets, isLoading }: SidebarProps) {
  const [location] = useLocation();
  const [search, setSearch] = useState("");

  const filteredPackets = packets?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <aside className="w-64 h-screen border-r border-border bg-card/30 flex flex-col fixed left-0 top-0 backdrop-blur-sm z-30">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Enterprise<span className="text-primary">View</span></span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search packets..." 
            className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              location === "/" 
                ? "bg-primary/10 text-primary shadow-sm border border-primary/10" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Home
          </Link>
          
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
            Documents
          </div>

          {isLoading ? (
            <div className="space-y-2 px-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-full bg-white/5 animate-pulse rounded-md" />
              ))}
            </div>
          ) : filteredPackets.length > 0 ? (
            filteredPackets.map((packet) => (
              <Link 
                key={packet.id} 
                href={`/packet/${packet.id}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  location === `/packet/${packet.id}`
                    ? "bg-primary/10 text-primary shadow-sm border border-primary/10" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="truncate">{packet.title}</span>
                {location === `/packet/${packet.id}` && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                )}
              </Link>
            ))
          ) : (
             <div className="px-3 py-4 text-sm text-muted-foreground text-center italic">
               No packets found
             </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-400/5 rounded-md transition-colors mt-1">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
