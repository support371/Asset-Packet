import { usePacket, usePackets } from "@/hooks/use-packets";
import { Sidebar } from "@/components/Sidebar";
import { SectionCard } from "@/components/SectionCard";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, FileText, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function PacketView() {
  const [, params] = useRoute("/packet/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: packet, isLoading: isPacketLoading } = usePacket(id);
  // Fetch list for sidebar
  const { data: allPackets, isLoading: isListLoading } = usePackets();

  if (isPacketLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground font-body">
        <Sidebar packets={allPackets} isLoading={isListLoading} />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Loading packet data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!packet) {
    return (
      <div className="flex min-h-screen bg-background text-foreground font-body">
        <Sidebar packets={allPackets} isLoading={isListLoading} />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">Packet Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested packet could not be found or you don't have access.</p>
            <Link href="/">
              <Button variant="secondary" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Sort sections by order
  const sortedSections = [...(packet.sections || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body overflow-hidden">
      <Sidebar packets={allPackets} isLoading={isListLoading} />
      
      <main className="flex-1 ml-64 h-screen flex flex-col">
        {/* Header Area */}
        <header className="px-8 py-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/5 gap-2">
                <Share2 className="w-4 h-4" /> Share
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/5 gap-2">
                <Printer className="w-4 h-4" /> Print
              </Button>
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                  {packet.title}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                  Active
                </span>
              </div>
              <p className="text-muted-foreground max-w-3xl leading-relaxed">
                {packet.description}
              </p>
            </motion.div>
            
            <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground/70 font-mono">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {packet.createdAt ? format(new Date(packet.createdAt), "MMM d, yyyy") : "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{packet.sections?.length || 0} Sections</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <ScrollArea className="flex-1 p-8">
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
              {sortedSections.length > 0 ? (
                sortedSections.map((section, idx) => (
                  <SectionCard key={section.id} section={section} index={idx} />
                ))
              ) : (
                <div className="text-center py-20 border border-dashed border-border/50 rounded-xl bg-white/5">
                  <p className="text-muted-foreground">This packet has no content sections yet.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Table of Contents (Right Side) */}
          <div className="w-64 border-l border-border/50 bg-card/20 p-6 hidden xl:block">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 font-display">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {sortedSections.map((section) => (
                <a 
                  key={section.id} 
                  href={`#section-${section.id}`}
                  className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors truncate"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
