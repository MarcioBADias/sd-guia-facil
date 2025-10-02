import { useState } from "react";
import { Play } from "lucide-react";
import StepCard from "./StepCard";
import CodeBlock from "./CodeBlock";
import InfoBox from "./InfoBox";

interface VideoCardProps {
  title: string;
  videoId: string;
  description?: string;
}

const VideoCard = ({ title, videoId, description }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-background rounded-lg overflow-hidden border border-border hover:border-sd-primary transition-all duration-300 hover:shadow-lg hover:shadow-sd-primary/20">
      {!isPlaying ? (
        <div className="relative aspect-video bg-muted cursor-pointer group" onClick={() => setIsPlaying(true)}>
          <img 
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 bg-sd-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};

interface DocumentationContentProps {
  section: string;
}

const DocumentationContent = ({ section }: DocumentationContentProps) => {
  const renderContent = () => {
    switch (section) {
      case "introduction":
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                Documentação SD Informática
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Guia completo para instalação e configuração dos sistemas PDV e Retaguarda da SD Informática
              </p>
            </div>

            <InfoBox type="info" title="Sobre este guia">
              Esta documentação foi criada para facilitar o processo de instalação dos sistemas da SD Informática.
              Siga os passos cuidadosamente para garantir uma instalação bem-sucedida.
            </InfoBox>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-primary/20 bg-gradient-subtle">
                <h3 className="text-lg font-semibold mb-3 text-primary">Sistema PDV</h3>
                <p className="text-muted-foreground">
                  Sistema de Ponto de Venda para operações comerciais com interface intuitiva 
                  e recursos completos para gestão de vendas.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-secondary/20 bg-gradient-subtle">
                <h3 className="text-lg font-semibold mb-3 text-secondary">Sistema Retaguarda</h3>
                <p className="text-muted-foreground">
                  Sistema de gestão empresarial para controle de estoque, fiscal, 
                  relatórios e administração geral da empresa.
                </p>
              </div>
            </div>
          </div>
        );

      case "requirements":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Requisitos do Sistema</h1>
            
            <InfoBox type="warning" title="Importante">
              O sistema <strong>NÃO</strong> funciona em Windows Home. É necessário Windows Professional ou superior.
            </InfoBox>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Requisitos Mínimos</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Windows 10/11 Professional ou superior</li>
                  <li>• 4GB RAM (8GB recomendado)</li>
                  <li>• 50GB espaço em disco</li>
                  <li>• Conexão de rede estável</li>
                  <li>• Usuário com privilégios de administrador</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Software Necessário</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• TeamViewer (para suporte remoto)</li>
                  <li>• Impressora fiscal configurada</li>
                  <li>• PinPad (se usar TEF)</li>
                  <li>• Balança (se necessário)</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "pdv-preparation":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Preparação do Sistema PDV</h1>
            
            <StepCard step={1} title="Ativando usuário Administrador" important>
              <p className="mb-3">Primeiro, precisamos ativar e configurar o usuário Administrador do Windows:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium mb-2">1.1 - Abrir configurações de usuário:</p>
                  <CodeBlock title="Comando para abrir gerenciador de usuários">WIN+R → digite "netplwiz"</CodeBlock>
                </div>
                <div>
                  <p className="font-medium mb-2">1.2 - Ativar usuário administrador:</p>
                  <p className="text-sm text-muted-foreground">
                    Ir em: <code className="bg-muted px-1 py-0.5 rounded">Avançado → Avançado → Pasta usuários → Selecionar Administrador → Propriedades → Ativar usuário administrador</code>
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">1.3 - Fazer logoff e login:</p>
                  <p className="text-sm text-muted-foreground">
                    Fazer logoff do usuário atual, entrar com administrador e excluir qualquer outro usuário
                  </p>
                </div>
              </div>
            </StepCard>

            <StepCard step={2} title="Criar pasta PDV+">
              <p className="mb-3">Criar uma pasta específica para o sistema:</p>
              <CodeBlock title="Localização da pasta">C:\PDV+</CodeBlock>
              <InfoBox type="tip">
                Esta pasta será usada para armazenar arquivos temporários e configurações do sistema.
              </InfoBox>
            </StepCard>

            <StepCard step={3} title="Instalar e configurar TeamViewer" important>
              <div className="space-y-3">
                <p>Configure o TeamViewer para suporte remoto:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Marcar: "TeamViewer inicia com Windows"</li>
                  <li>• Marcar: "Aceitar conexões de LAN"</li>
                  <li>• Definir senha fixa</li>
                </ul>
                <CodeBlock title="Senha padrão TeamViewer">SD@info1525</CodeBlock>
              </div>
            </StepCard>

            <StepCard step={4} title="Renomear o computador">
              <p className="mb-3">Alterar o nome da máquina para identificação do PDV:</p>
              <CodeBlock title="Comando CMD (executar como administrador)">
WMIC computersystem where name="%computername%" call rename name="SDPdv01"
              </CodeBlock>
              <InfoBox type="info">
                Substitua "SDPdv01" pelo nome desejado para o PDV (ex: SDPdv02, SDPdv03, etc.)
              </InfoBox>
            </StepCard>
          </div>
        );

      case "pdv-install":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Instalação do Sistema PDV</h1>

            <StepCard step={5} title="Executar SDPDV.install 3" important>
              <div className="space-y-3">
                <p>Configure as seguintes opções do sistema:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Alterar configurações de controle de conta para <strong>MÍNIMO</strong></li>
                  <li>• Desmarcar todas as mensagens de segurança</li>
                  <li>• Opções de desempenho: "Ajustar para obter melhor desempenho"</li>
                  <li>• Energia: Desligar vídeo = <strong>Nunca</strong></li>
                  <li>• Energia: Desligar disco rígido = <strong>Nunca</strong></li>
                  <li>• Configurações USB = <strong>Desabilitado</strong></li>
                </ul>
              </div>
            </StepCard>

            <StepCard step={6} title="Configurar IP Fixo">
              <div className="space-y-3">
                <p>Configure a rede para comunicação com o servidor:</p>
                <div>
                  <p className="font-medium mb-2">6.1 - Verificar IP no servidor:</p>
                  <p className="text-sm text-muted-foreground">Anotar o IP configurado para este PDV no servidor</p>
                </div>
                <div>
                  <p className="font-medium mb-2">6.2 - Conferir gateway:</p>
                  <p className="text-sm text-muted-foreground">Verificar gateway no próprio PDV</p>
                </div>
                <div>
                  <p className="font-medium mb-2">6.3 - Configurar compartilhamento:</p>
                  <p className="text-sm text-muted-foreground">
                    Central de rede → Alterar configurações de compartilhamento avançadas → Todas as redes → 
                    Ativar compartilhamento → Desativar compartilhamento por senha
                  </p>
                </div>
              </div>
            </StepCard>

            <StepCard step={7} title="Copiar arquivos necessários">
              <p className="mb-3">Copiar 4 arquivos importantes de um PDV já em funcionamento:</p>
              <ul className="space-y-2 text-sm">
                <li>• <code className="bg-muted px-1 py-0.5 rounded">SDPDVXML</code></li>
                <li>• <code className="bg-muted px-1 py-0.5 rounded">SD.AVI</code> (pasta Windows)</li>
                <li>• <code className="bg-muted px-1 py-0.5 rounded">Clisitef.ini</code> (pasta syswow64/system32)</li>
                <li>• <code className="bg-muted px-1 py-0.5 rounded">DLL.pdv.dll</code> (pasta syswow64/system32)</li>
              </ul>
            </StepCard>

            <StepCard step={8} title="Instalar versão do PDV" important>
              <div className="space-y-3">
                <p>Verificar a versão dos PDVs existentes e executar o instalador:</p>
                <InfoBox type="warning" title="IMPORTANTE">
                  <strong>DESMARCAR</strong> a opção "SD ATIVADOR" durante a instalação!
                </InfoBox>
                <ul className="space-y-2 text-sm">
                  <li>• Executar instalador como <strong>ADMINISTRADOR</strong></li>
                  <li>• Conferir configuração da impressora</li>
                  <li>• Conferir número do PDV</li>
                  <li>• Manter opção <strong>CARGA SEMPRE SEGURA</strong></li>
                </ul>
              </div>
            </StepCard>
          </div>
        );

      case "pdv-config":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Configuração do PDV</h1>

            <InfoBox type="tip" title="PULO DO GATO!">
              Para facilitar a instalação, você pode usar as credenciais da SD Informática:
              <br />
              <strong>CNPJ:</strong> 04260756/0001-20
              <br />
              <strong>Chave:</strong> 322685
            </InfoBox>

            <StepCard step={1} title="Configurar XML de referência">
              <div className="space-y-3">
                <p>Se houver XML de referência, alterar as informações do caixa respectivo:</p>
                <p className="font-medium">Tags importantes para verificar:</p>
                <ul className="space-y-1 text-sm">
                  <li>• <code className="bg-muted px-1 py-0.5 rounded">versão PDV</code></li>
                  <li>• <code className="bg-muted px-1 py-0.5 rounded">GPdvPadrao</code></li>
                  <li>• <code className="bg-muted px-1 py-0.5 rounded">CTNUMEROPDV</code></li>
                  <li>• <code className="bg-muted px-1 py-0.5 rounded">TefPdv</code> → alterar para número do PDV</li>
                  <li>• <code className="bg-muted px-1 py-0.5 rounded">NFCE SERIE</code> → pegar série do retaguarda</li>
                  <li>• <code className="bg-muted px-1 py-0.5 rounded">NFCE ULTIMO</code> → apagar conteúdo</li>
                </ul>
                <CodeBlock title="Exemplo de configuração TEF">
&lt;TefPdv&gt;SE000002&lt;/TefPdv&gt;
                </CodeBlock>
                <InfoBox type="info">
                  A série NFCe deve ser obtida no retaguarda: Fiscal → NFCe
                </InfoBox>
              </div>
            </StepCard>
          </div>
        );

      case "pdv-test":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Testes do Sistema PDV</h1>

            <StepCard step={1} title="Rodar atualizador">
              <div className="space-y-3">
                <p>Execute o processo de atualização:</p>
                <div>
                  <p className="font-medium mb-2">9.1 - Primeira execução:</p>
                  <p className="text-sm text-muted-foreground">
                    Abrir SDPDV → ele dará erro de carga → <strong>FECHAR RAPIDAMENTE</strong> para não desligar
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">9.2 - Segunda execução:</p>
                  <p className="text-sm text-muted-foreground">
                    Abrir novamente → assim que abrir, fechar → ir na pasta do SDPdv → 
                    buscar XML do GNE → inserir na tag NNF o último documento emitido no invoice
                  </p>
                </div>
              </div>
            </StepCard>

            <StepCard step={2} title="Configurar GNE.XML">
              <div className="space-y-3">
                <p>Configurar as tags do arquivo GNE.XML:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Tag <strong>NNF</strong>: último documento emitido no invoice</li>
                  <li>• Tag <strong>SERIE</strong>: série do PDV</li>
                </ul>
                <InfoBox type="info">
                  Para ver a série do PDV: Fiscal → NFC-E → Configurações → Escolher filial → Exibir
                </InfoBox>
              </div>
            </StepCard>

            <StepCard step={3} title="Instalação Gsurf (se necessário)">
              <div className="space-y-3">
                <p>Se o cliente usar Gsurf, configure o sistema:</p>
                <CodeBlock title="Portal Gsurf">
                  https://cdp.gsurfnet.com/
                </CodeBlock>
                <CodeBlock title="Credenciais Gsurf">
Login: Fernando_Silva
Senha: SD@2025!@#
                </CodeBlock>
                <div>
                  <p className="text-sm">Processo:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Acessar site Gsurf com CNPJ do cliente</li>
                    <li>• Selecionar PDV e clicar em "Reinstalar"</li>
                    <li>• Anotar código OTP gerado</li>
                    <li>• Instalar GsurfRSA Listener</li>
                    <li>• Configurar serviço: sitef</li>
                  </ul>
                </div>
              </div>
            </StepCard>

            <StepCard step={4} title="Teste de venda" important>
              <div className="space-y-3">
                <p>Realizar teste completo de venda:</p>
                <CodeBlock title="Comandos do PDV">
A - Abrir caixa (senha: +1 HORA +1 MES +1 ANO)
M - Ativar caixa
F1 - Abrir venda
J - Fechar venda
K - Crédito
D - Dinheiro
U - Cancelar venda
F - Fechar caixa
                </CodeBlock>
                <InfoBox type="success">
                  Após o teste, verifique a última venda no sistema Invoice para confirmar que tudo está funcionando.
                </InfoBox>
              </div>
            </StepCard>
          </div>
        );

      case "retaguarda-install":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Instalação do Sistema Retaguarda</h1>

            <StepCard step={1} title="Preparação da instalação" important>
              <div className="space-y-3">
                <p>Antes de iniciar, anote as informações do servidor:</p>
                <InfoBox type="info" title="Informações necessárias">
                  Acesse o REGEDIT do servidor: <br />
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    HKEY_LOCAL_MACHINE → SOFTWARE → WOW6432NODE → SDInformatica → SDSuper
                  </code>
                </InfoBox>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>APIP</strong>: IP do servidor Windows</li>
                  <li>• <strong>BDIP</strong>: IP do Linux (banco de dados)</li>
                  <li>• <strong>Número de filial</strong></li>
                </ul>
              </div>
            </StepCard>

            <StepCard step={2} title="Verificar conectividade do servidor">
              <div className="space-y-3">
                <p>Confirmar se o servidor Windows está acessível:</p>
                <CodeBlock title="Teste de conectividade">WIN+R → \\ip_do_servidor_win\SDProgs$</CodeBlock>
                <InfoBox type="warning" title="Se não abrir">
                  Configure as credenciais pelo Gerenciador de Credenciais:
                  <br />• IP: ip_do_servidor
                  <br />• Usuário: administrador
                  <br />• Senha: SD@super0212
                </InfoBox>
              </div>
            </StepCard>

            <StepCard step={3} title="Executar instalador" important>
              <div className="space-y-3">
                <p>Copiar e executar o instalador do SD Super:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Marcar: "Esse computador não será Servidor"</li>
                  <li>• Marcar: "Relatórios"</li>
                  <li>• Inserir APIP no campo de acesso</li>
                </ul>
                <InfoBox type="tip" title="PULO DO GATO!">
                  <strong>CNPJ:</strong> 04260756/0001-20<br />
                  <strong>Chave:</strong> 322685
                </InfoBox>
                <p className="text-sm">Seguir a instalação confirmando Filial e aceitando os próximos passos.</p>
              </div>
            </StepCard>
          </div>
        );

      case "retaguarda-config":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Configuração do Retaguarda</h1>

            <StepCard step={1} title="Primeira abertura do sistema" important>
              <div className="space-y-3">
                <p>Configure o atalho e execute pela primeira vez:</p>
                <div>
                  <p className="font-medium mb-2">Configurar atalho:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Botão direito no atalho do Super</li>
                    <li>• Propriedades → Avançados → "Executar como administrador"</li>
                    <li>• Aba Compatibilidade → "Executar programa como administrador"</li>
                  </ul>
                </div>
              </div>
            </StepCard>

            <StepCard step={2} title="Configurar formato de moeda">
              <div className="space-y-3">
                <p>Na primeira execução:</p>
                <InfoBox type="warning">
                  O sistema irá reclamar do formato de moedas. Vá em "Avançados" e altere o formato da moeda.
                </InfoBox>
              </div>
            </StepCard>

            <StepCard step={3} title="Configurar Regedit">
              <div className="space-y-3">
                <p>Limpar e configurar os campos no Regedit:</p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>APIP</strong>: IP do servidor Windows</li>
                  <li>• <strong>Ativador</strong>: mesmo IP do APIP</li>
                  <li>• <strong>BDIP</strong>: IP do banco de dados Linux</li>
                  <li>• <strong>Filial</strong>: número da filial</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Após configurar, abrir o Super que ele atualizará e funcionará normalmente.
                </p>
              </div>
            </StepCard>
          </div>
        );

      case "retaguarda-final":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Configurações Finais</h1>

            <StepCard step={1} title="Configurações Fiscais" important>
              <div className="space-y-3">
                <p>Abra o Super como Administrador e siga os passos abaixo:</p>
                 <ul className="space-y-1 text-sm">
                  <li>• <code className="bg-muted px-1 py-0.5 rounded">Fiscal → NF-e → Configurações</code></li>
                  <li>• Deixa efetuar os carregamentos até que ele feche o Super e então pode reabrir.</li>
                </ul>
                 </div>
            </StepCard>
            <StepCard step={2} title="Configurando Impressora" important>
              <div className="space-y-3">
                <p>Abra o Super como Administrador e siga os passos abaixo:</p>
                 <ul className="space-y-1 text-sm">
                  <li>• <code className="bg-muted px-1 py-0.5 rounded">Controle → Computador → Periféricos</code></li>
                  <li>• Selecione a opção <strong>IMPRESSORA DO WINDOWS</strong> em <strong>ETIQUETAS</strong></li>
                </ul>
                 </div>
            </StepCard>
          </div>
        );

      case "pdv-slowness":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Solução de Lentidão no PDV</h1>
            
            <InfoBox type="warning" title="Importante">
              Execute estes procedimentos quando o PDV estiver apresentando lentidão.
              Os comandos devem ser executados com privilégios de administrador.
            </InfoBox>

            <StepCard step={1} title="Remover aplicativos nativos do Windows" important>
              <div className="space-y-4">
                <p className="mb-3">
                  O comando abaixo elimina por completo todos os aplicativos que você não usa no Windows 10, 
                  são eles aplicativos nativos do sistema como por exemplo: Bing, Filmes e TV, Cortana e outros. 
                  Juntando todos dá quase 40 aplicativos.
                </p>
                
                <div>
                  <p className="font-medium mb-2">1.1 - Abrir Windows PowerShell como administrador:</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clique com botão direito no menu Iniciar → Windows PowerShell (Admin)
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-2">1.2 - Remover TODOS os aplicativos nativos:</p>
                  <CodeBlock title="Comando PowerShell - Remove todos os apps">
Get-AppxPackage | Remove-AppxPackage
                  </CodeBlock>
                </div>

                <div className="mt-4">
                  <p className="font-medium mb-2">1.3 - Ou remover mantendo apenas a Microsoft Store:</p>
                  <CodeBlock title="Comando PowerShell - Mantém Store">
{`Get-AppxPackage | where-object {$_.name -notlike "*store*"} | Remove-AppxPackage`}
                  </CodeBlock>
                  <InfoBox type="tip">
                    Use este segundo comando se precisar manter a Microsoft Store instalada.
                  </InfoBox>
                </div>
              </div>
            </StepCard>

            <StepCard step={2} title="Desabilitar serviço de agendamento de tarefas" important>
              <div className="space-y-4">
                <p className="mb-3">
                  Alterar a inicialização do serviço Schedule do Windows para melhorar o desempenho:
                </p>
                
                <div>
                  <p className="font-medium mb-2">2.1 - Abrir o Editor de Registro:</p>
                  <CodeBlock title="Comando para abrir o Regedit">WIN+R → digite "regedit"</CodeBlock>
                </div>

                <div>
                  <p className="font-medium mb-2">2.2 - Navegar até o caminho:</p>
                  <CodeBlock title="Caminho no Registro">
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Schedule
                  </CodeBlock>
                </div>

                <div>
                  <p className="font-medium mb-2">2.3 - Alterar o valor:</p>
                  <ul className="space-y-2 text-sm">
                    <li>• Localizar a chave <code className="bg-muted px-1 py-0.5 rounded">start</code></li>
                    <li>• Duplo clique em <code className="bg-muted px-1 py-0.5 rounded">start</code></li>
                    <li>• Alterar o valor de <strong>2</strong> para <strong>4</strong></li>
                    <li>• Clicar em OK</li>
                  </ul>
                </div>

                <InfoBox type="info">
                  O valor 4 significa "Desabilitado". Isso impedirá que o serviço de agendamento 
                  consuma recursos desnecessários do sistema.
                </InfoBox>

                <InfoBox type="warning">
                  Após fazer estas alterações, reinicie o computador para que as mudanças tenham efeito.
                </InfoBox>
              </div>
            </StepCard>
          </div>
        );

      case 'video-tutorials':
        return (
          <div>
            <h1 className="text-4xl font-bold mb-6 text-sd-primary">Nave do Conhecimento</h1>
            <InfoBox type="info">
              <p>Aprenda a utilizar o sistema SD através de nossas videoaulas práticas e objetivas.</p>
            </InfoBox>

            <div className="space-y-12 mt-8">
              {/* Cadastros Básicos */}
              <section className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-sd-primary flex items-center gap-2">
                  <span className="text-3xl">📚</span> Cadastros Básicos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VideoCard 
                    title="Cadastro de Clientes"
                    videoId="8w4rEFLtx6w"
                    description="Aprenda a cadastrar clientes no sistema"
                  />
                  <VideoCard 
                    title="Cadastro de Grupo de Cliente"
                    videoId="8w4rEFLtx6w"
                    description="Organize seus clientes em grupos"
                  />
                  <VideoCard 
                    title="Cadastro de Fornecedores"
                    videoId="aemZe4o0Yyg"
                    description="Gerencie seus fornecedores"
                  />
                </div>
              </section>

              {/* Cadastro de Produtos */}
              <section className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-sd-primary flex items-center gap-2">
                  <span className="text-3xl">🏷️</span> Cadastro de Produtos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <VideoCard 
                    title="Produtos – Nível 1"
                    videoId="rX2yr1qaNN8"
                    description="Conceitos básicos"
                  />
                  <VideoCard 
                    title="Produtos – Nível 2"
                    videoId="LhLsUVFstHg"
                    description="Recursos intermediários"
                  />
                  <VideoCard 
                    title="Produtos – Nível 3"
                    videoId="u8XcoaKGC2g"
                    description="Recursos avançados"
                  />
                </div>
              </section>

              {/* Recebimento de Mercadorias */}
              <section className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-sd-primary flex items-center gap-2">
                  <span className="text-3xl">📦</span> Recebimento de Mercadorias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VideoCard title="Manifesto Fiscal" videoId="F0DI4dLVd9o" />
                  <VideoCard title="Cadastro de Fornecedores" videoId="Asc09p170s8" />
                  <VideoCard title="Recebimento de Mercadorias" videoId="P2GPc4I2Gic" />
                  <VideoCard title="Recebimento Manual – Produtor Rural" videoId="Hy578IMufYs" />
                  <VideoCard title="Devolução de Mercadorias" videoId="OgAa98J8L0M" />
                  <VideoCard title="Nota de Bonificação" videoId="6dV1HvEC7aM" />
                  <VideoCard title="Nota MEI (Pessoa Física)" videoId="DGnL0dlV458" />
                  <VideoCard title="Recebimento – Corte de Carnes" videoId="ve66hBrgjUw" />
                </div>
              </section>

              {/* Transferência de Mercadorias */}
              <section className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-sd-primary flex items-center gap-2">
                  <span className="text-3xl">🔄</span> Transferência de Mercadorias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VideoCard title="Transferência entre Filiais" videoId="2ExRrG58xzE" />
                  <VideoCard title="Transferência via SDApp" videoId="5oVtE5T_3U8" />
                </div>
              </section>

              {/* Curso Financeiro */}
              <section className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-sd-primary flex items-center gap-2">
                  <span className="text-3xl">💰</span> Curso Financeiro – Nível Básico
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VideoCard title="Verbas e Centros de Custo" videoId="sjPS1KKGxpI" />
                  <VideoCard title="Importação de Contas a Pagar" videoId="YX0r1bQwd-8" />
                  <VideoCard title="Gestão de Contas a Pagar" videoId="FzDzalUF2RI" />
                  <VideoCard title="Manutenção de Títulos" videoId="uylZ94Dr98c" />
                  <VideoCard title="Lançamento de Despesas" videoId="TMK3AYbUSAc" />
                </div>
              </section>

              {/* Módulo Fiscal */}
              <section className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-sd-primary flex items-center gap-2">
                  <span className="text-3xl">📋</span> Curso Módulo Fiscal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VideoCard title="Preparação do Ambiente" videoId="PsypLno1dTg" />
                  <VideoCard title="Manifesto do Destinatário" videoId="0s58NtxD5iI" />
                  <VideoCard title="Entradas Fiscais" videoId="XKag-1tOc9s" />
                  <VideoCard title="Conferência de Entradas" videoId="4j6uCKVL_sk" />
                  <VideoCard title="Emissão e Manutenção de Notas" videoId="wAT_XL8t1-4" />
                  <VideoCard title="Escrituração Fiscal" videoId="gclAYezEGVg" />
                </div>
              </section>

              {/* Gestão de Estoque */}
              <section className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-sd-primary flex items-center gap-2">
                  <span className="text-3xl">📊</span> Gestão de Estoque – Nível Básico
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VideoCard title="Perda e Consumo" videoId="9FfAMeZNiy4" />
                  <VideoCard title="Movimentações via SDApp" videoId="wC_W0VGWa3c" />
                  <VideoCard title="Inventário via SDSuper" videoId="jZj_2yfmg3o" />
                  <VideoCard title="Inventário via SDApp" videoId="jZj_2yfmg3o" />
                  <VideoCard title="Kits e Cestas Básicas" videoId="irJIbjSti8M" />
                  <VideoCard title="Receitas e Produção" videoId="_xYbma1rmEc" />
                </div>
              </section>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4">Seção não encontrada</h2>
            <p className="text-muted-foreground">A seção solicitada não está disponível.</p>
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>;
};

export default DocumentationContent;
