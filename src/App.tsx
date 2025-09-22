import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, TeacherOnlyRoute } from "@/components/auth/ProtectedRoute";
import TeacherLogin from "@/components/auth/TeacherLogin";
import TeacherDashboard from "@/components/TeacherDashboard";
import SecurityTest from "@/components/auth/SecurityTest";
import Index from "./pages/Index";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import * as Sentry from '@sentry/react';

const queryClient = new QueryClient();

const App = () => (
  <Sentry.ErrorBoundary 
    fallback={({ error, resetError }) => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
          <button 
            onClick={resetError}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )}
    beforeCapture={(scope) => {
      scope.setTag('errorBoundary', 'app-root');
    }}
  >
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/teacher/login" element={<TeacherLogin />} />
              
              {/* Protected teacher routes */}
              <Route 
                path="/teacher/dashboard" 
                element={
                  <TeacherOnlyRoute>
                    <TeacherDashboard />
                  </TeacherOnlyRoute>
                } 
              />
              
              <Route path="/security-test" element={<SecurityTest />} />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);

export default App;
