import { Section } from "@shared/schema";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Table as TableIcon, AlignLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SectionCardProps {
  section: Section;
  index: number;
}

export function SectionCard({ section, index }: SectionCardProps) {
  const getIcon = () => {
    switch (section.type) {
      case 'summary': return <FileText className="w-5 h-5 text-amber-400" />;
      case 'gallery': return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case 'table': return <TableIcon className="w-5 h-5 text-blue-400" />;
      default: return <AlignLeft className="w-5 h-5 text-green-400" />;
    }
  };

  const getTypeLabel = () => {
    switch (section.type) {
      case 'summary': return "Summary";
      case 'gallery': return "Image Gallery";
      case 'table': return "Data Table";
      default: return "Text Content";
    }
  };

  const renderContent = () => {
    switch (section.type) {
      case 'summary':
        return (
          <div className="prose prose-invert max-w-none">
            <div className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl">
              <p className="text-lg leading-relaxed text-amber-50/90 font-medium">
                {section.content}
              </p>
            </div>
          </div>
        );

      case 'gallery':
        const images = (section.data as any)?.images || [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img: string, idx: number) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="relative aspect-video rounded-lg overflow-hidden border border-border/50 bg-black/20 group"
              >
                {/* HTML comment for Unsplash fallback if URL fails */}
                {/* Image placeholder */}
                <img 
                  src={img} 
                  alt={`Gallery item ${idx + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-medium">Image {idx + 1}</span>
                </div>
              </motion.div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full h-32 flex items-center justify-center bg-white/5 rounded-lg border border-dashed border-white/10 text-muted-foreground">
                No images available
              </div>
            )}
          </div>
        );

      case 'table':
        const headers = (section.data as any)?.headers || [];
        const rows = (section.data as any)?.rows || [];
        
        return (
          <div className="rounded-lg border border-border/50 overflow-hidden bg-black/20">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-border/50">
                  {headers.map((h: string, idx: number) => (
                    <TableHead key={idx} className="text-xs uppercase tracking-wider font-semibold text-primary/80 h-10">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row: string[], rowIdx: number) => (
                  <TableRow key={rowIdx} className="hover:bg-white/5 border-border/50 transition-colors">
                    {row.map((cell: string, cellIdx: number) => (
                      <TableCell key={cellIdx} className="font-mono text-sm py-3">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case 'text':
      default:
        return (
          <div className="prose prose-invert max-w-none text-muted-foreground/90 leading-relaxed">
            {/* Simple markdown-like rendering could go here, for now raw text */}
            <div className="whitespace-pre-wrap">{section.content}</div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      id={`section-${section.id}`}
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg overflow-hidden group hover:border-border/80 transition-all duration-300">
        <CardHeader className="border-b border-border/50 bg-white/[0.02] flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-background border border-border/50 shadow-inner">
              {getIcon()}
            </div>
            <div>
              <CardTitle className="text-lg font-bold font-display tracking-tight group-hover:text-primary transition-colors">
                {section.title}
              </CardTitle>
            </div>
          </div>
          <Badge variant="outline" className="bg-background/50 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {getTypeLabel()}
          </Badge>
        </CardHeader>
        <CardContent className="p-6">
          {renderContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
}
