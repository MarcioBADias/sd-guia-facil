import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index"; // O conteúdo protegido (Documentação)
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import { LoginPage } from "./pages/Login"; // Importa a nova página de Login

const queryClient = new QueryClient();

// Função para verificar o status de autenticação no localStorage
const checkAuthStatus = () => {
  return localStorage.getItem("sd_docs_authenticated") === "true";
};

const App = () => {
  // Inicializa o estado de autenticação verificando o localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthStatus());

  // Garante que o estado é atualizado ao recarregar
  useEffect(() => {
    setIsAuthenticated(checkAuthStatus());
  }, []);

  // Callback chamado pela LoginPage em caso de sucesso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Nota: O navigate já foi resolvido dentro da LoginPage
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="sd-docs-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    // Se autenticado, exibe o conteúdo principal da documentação
                    <Index />
                  ) : (
                    // Se não autenticado, exibe a página de login
                    <LoginPage onLoginSuccess={handleLoginSuccess} />
                  )
                }
              />
              {/* Rotas de 404 e outras */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;