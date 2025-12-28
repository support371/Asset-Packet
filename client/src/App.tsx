import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/portfolio" component={Dashboard} />
      <Route path="/investments" component={Dashboard} />
      <Route path="/grants" component={Dashboard} />
      <Route path="/portal" component={Dashboard} />
      <Route path="/admin/diagnostics" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full bg-background overflow-hidden">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex h-14 items-center gap-4 border-b bg-card/50 backdrop-blur-md px-6 z-10">
                <SidebarTrigger />
                <div className="flex-1" />
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Enterprise</span>
                    <span className="text-[10px] text-muted-foreground">v1.0.0-stable</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/50 border border-primary/20" />
                </div>
              </header>
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                  <Router />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
