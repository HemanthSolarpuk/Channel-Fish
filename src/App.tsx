import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ReleaseQueue from "./pages/ReleaseQueue.tsx";
import DocumentDetail from "./pages/DocumentDetail.tsx";
import VmiProgramsPage from "./pages/VmiProgramsPage.tsx";
import VmiProgramDetailPage from "./pages/VmiProgramDetailPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vmi-programs" element={<VmiProgramsPage />} />
          <Route path="/vmi-programs/:programId" element={<VmiProgramDetailPage />} />
          <Route path="/release-queue" element={<ReleaseQueue />} />
          <Route path="/document/:id" element={<DocumentDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

