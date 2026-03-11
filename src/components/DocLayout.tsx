import { useState } from "react";
import { Menu, X, Book, Monitor, Settings, ChevronRight, Wrench, GraduationCap, FileCheck, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggle from "@/components/ThemeToggle";
import logoSD from "@/assets/logo-sd.png";

interface DocLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const DocLayout = ({ children, currentSection, onSectionChange }: DocLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    {
      id: "overview",
      title: "Visão Geral",
      icon: Book,
      items: [
        { id: "introduction", title: "Introdução" },
        { id: "requirements", title: "Requisitos do Sistema" }
      ]
    },
    {
      id: "pdv",
      title: "Instalação PDV",
      icon: Monitor,
      items: [
        { id: "pdv-preparation", title: "Preparação do Sistema" },
        { id: "pdv-install", title: "Instalação" },
        { id: "pdv-config", title: "Configuração" },
        { id: "pdv-test", title: "Testes" }
      ]
    },
    {
      id: "retaguarda",
      title: "Instalação Retaguarda",
      icon: Settings,
      items: [
        { id: "retaguarda-install", title: "Instalação" },
        { id: "retaguarda-config", title: "Configuração" },
        { id: "retaguarda-final", title: "Configurações Finais" },
        { id: "retaguarda-acerto-fiscal", title: "Acerto Fiscal" }
      ]
    },
    {
      id: "fiscal",
      title: "Acerto Fiscal Gratuito",
      icon: FileCheck,
      items: [
        { id: "acerto-fiscal-gratuito", title: "Integração NCM/CEST" }
      ]
    },
    {
      id: "comparativo-fiscal",
      title: "Comparativo Fiscal",
      icon: FileCheck,
      items: [
        { id: "comparativo-fiscal-intro", title: "Visão Geral" },
        { id: "comparativo-fiscal-devolucao", title: "Notas de Devolução" },
        { id: "comparativo-fiscal-rejeitadas", title: "Rejeitadas e Conflito" },
        { id: "comparativo-fiscal-tela", title: "Tela Comparativo" },
        { id: "comparativo-fiscal-duplicadas", title: "Vendas Duplicadas" },
        { id: "comparativo-fiscal-divergencias", title: "Divergências de Itens" }
      ]
    },
    {
      id: "troubleshooting",
      title: "Solução de Problemas",
      icon: Wrench,
      items: [
        { id: "pdv-slowness", title: "Lentidão no PDV" },
        { id: "vnc-error", title: "Erro no VNC" },
        { id: "biometrico-hamster", title: "Leitor Biométrico Hamster" }
      ]
    },
    {
      id: "training",
      title: "Nave do Conhecimento",
      icon: GraduationCap,
      items: [
        { id: "video-tutorials", title: "Videoaulas" }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-background lg:h-screen lg:overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static lg:flex lg:flex-col inset-y-0 left-0 z-50 w-80 bg-card border-r transform transition-transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:h-screen lg:overflow-hidden
      `}>
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={logoSD} alt="SD Informática" className="h-10 w-auto" />
            <div>
              <h2 className="font-semibold text-card-foreground">SD Documentação</h2>
              <p className="text-sm text-muted-foreground">Guia de Instalação</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-2 p-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="space-y-1">
                  <div 
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors
                      ${currentSection.startsWith(section.id) 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }
                    `}
                    onClick={() => onSectionChange(section.items[0].id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{section.title}</span>
                    <ChevronRight className="h-3 w-3 ml-auto" />
                  </div>
                  
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      className={`
                        w-full text-left px-6 py-2 text-sm rounded-md transition-colors
                        ${currentSection === item.id
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                      onClick={() => onSectionChange(item.id)}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 p-4 border-b bg-card flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-card-foreground">
              Documentação SD Informática
            </h1>
            <p className="text-sm text-muted-foreground">
              Guia completo de instalação dos sistemas PDV e Retaguarda
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden lg:overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocLayout;
