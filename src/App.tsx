import { Suspense, lazy } from 'react';

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/contexts/LangContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import WaveDivider from "@/components/layout/WaveDivider";

// Lazy-loaded pages
const Index = lazy(() => import('./pages/Index'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[80vh] flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LangProvider>
      <ThemeProvider>
        <SettingsProvider>
          <TooltipProvider>

            <Sonner />
            <BrowserRouter>
              <ErrorBoundary>
                <Navbar />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/certificates" element={<CertificatesPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Footer />
                <ChatWidget />
                {/* Fixed ocean wave at bottom of screen */}
                <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
                  <WaveDivider color="hsl(199 89% 48% / 0.35)" />
                </div>
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </SettingsProvider>
      </ThemeProvider>
    </LangProvider>
  </QueryClientProvider>
);

export default App;
