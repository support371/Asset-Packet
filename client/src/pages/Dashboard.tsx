import { usePackets } from "@/hooks/use-packets";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowRight, Clock, Box } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: packets, isLoading } = usePackets();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-card animate-pulse border border-white/5" />
          ))}
        </div>
      );
    }

    if (!packets || packets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
            <Box className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold font-display mb-2">No Packets Found</h3>
          <p className="text-muted-foreground max-w-md">
            There are no data packets available in the system. Create a new packet or wait for synchronization.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packets.map((packet, index) => (
          <motion.div
            key={packet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/packet/${packet.id}`}>
              <Card className="h-full bg-card hover:bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <FileText className="w-5 h-5" />
                    </div>
                    {packet.createdAt && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(packet.createdAt), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                  <CardTitle className="font-display text-xl group-hover:text-primary transition-colors line-clamp-1">
                    {packet.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {packet.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      <Sidebar packets={packets} isLoading={isLoading} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Dashboard Overview
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Welcome to the Enterprise View dashboard. Select a packet below to view detailed sections, analytics, and reports.
            </p>
          </motion.div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
