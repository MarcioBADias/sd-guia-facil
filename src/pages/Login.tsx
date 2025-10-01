import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoSD from "@/assets/logo-sd.png";
import { useToast } from "@/hooks/use-toast";

// A senha de acesso solicitada pelo usuário.
const ACCESS_PASSWORD = "SD@2022!@#";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de delay para autenticação
    setTimeout(() => {
      if (password === ACCESS_PASSWORD) {
        // Define o flag de autenticação no armazenamento local
        localStorage.setItem("sd_docs_authenticated", "true");
        onLoginSuccess();
        // A navegação para a rota principal será tratada pelo App.tsx
      } else {
        toast({
          title: "Erro de Acesso",
          description: "Senha incorreta. Tente novamente.",
          variant: "destructive",
        });
        setPassword("");
      }
      setIsLoading(false);
    }, 500); // Pequeno delay para feedback visual
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted dark:bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center space-y-4">
          <img src={logoSD} alt="SD Informática" className="h-16 w-auto mb-2" />
          <CardTitle className="text-xl font-semibold text-center text-card-foreground">
            Insira a senha de acesso à página
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Senha de Acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10"
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verificando..." : "Acessar Documentação"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};