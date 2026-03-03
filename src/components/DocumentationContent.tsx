import { useState } from "react";
import { Download } from "lucide-react";
import { Play } from "lucide-react";
import StepCard from "./StepCard";
import CodeBlock from "./CodeBlock";
import InfoBox from "./InfoBox";
import DuplicateChecker from "./DuplicateChecker";
import DivergenceChecker from "./DivergenceChecker";

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
                  <CodeBlock title="Comando para abrir gerenciador de usuários">WIN R → digite "netplwiz"</CodeBlock>
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

            <StepCard step={2} title="Criar pasta PDV ">
              <p className="mb-3">Criar uma pasta específica para o sistema:</p>
              <CodeBlock title="Localização da pasta">C:\PDV </CodeBlock>
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
Senha: SD@tec0212!@#
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
A - Abrir caixa (senha:  1 HORA  1 MES  1 ANO)
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
                <CodeBlock title="Teste de conectividade">WIN R → \\ip_do_servidor_win\SDProgs$</CodeBlock>
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

        case "retaguarda-acerto-fiscal":
         return (
           <div className="space-y-6">
             <h1 className="text-3xl font-bold">Instalação e Configuração: Acerto Fiscal</h1>
             
             <InfoBox type="info" title="Visão Geral">
               <p>Neste artigo, você aprenderá a realizar a integração do Acerto Fiscal via API. É fundamental solicitar previamente que a equipe do Acerto Fiscal habilite a integração antes de iniciar.</p>
               <p className="mt-2"><strong>Atenção:</strong> No arquivo <code className="bg-muted px-1 py-0.5 rounded">SDTributário.ini</code>, tenha cuidado para não apagar os símbolos <code className="bg-muted px-1 py-0.5 rounded">;</code>, pois eles são essenciais para evitar erros de execução do SDTributário.</p>
             </InfoBox>
 
             <h2 className="text-xl font-semibold mt-4">Requisitos de Versão Mínima do Sistema</h2>
             <ul className="space-y-1 text-sm text-muted-foreground ml-4 list-disc">
               <li>SDSuper: 2471</li>
               <li>SDSuperx: 482</li>
               <li>SDAtualizador: 12442</li>
               <li>SDTributario: 31</li>
             </ul>
             <InfoBox type="tip">
               Arquivo de referência: <code className="bg-muted px-1 py-0.5 rounded">Versao Acerto Fiscal.zip</code> (07 out. 2025, 02:29 PM).
             </InfoBox>
 
             <StepCard step={1} title="Configuração Inicial da API no SD Super" important>
               <div className="space-y-3">
                 <p>
                   Após atualizar o cliente com as versões mínimas, verifique se os arquivos de instalação estão na pasta <code className="bg-muted px-1 py-0.5 rounded">Programas</code> do servidor ou se o sistema já está atualizado.
                 </p>
                 
                 <p className="font-medium mb-2">1.1 - Acessar Interfaces Externas:</p>
                 <p className="text-sm text-muted-foreground">
                   Vá para o caminho: <code className="bg-muted px-1 py-0.5 rounded">Controle → Computador → Interfaces Externas</code>.
                 </p>
                 
                 <p className="font-medium mb-2">1.2 - Inserir Credenciais e Habilitar API:</p>
                 <p className="text-sm text-muted-foreground">
                   Confirme o **ID e Token do cliente** junto ao Acerto Fiscal e preencha nos campos.
                 </p>
                 <InfoBox type="info">
                   Marque a opção <strong className="font-semibold">Usar Api</strong> e clique em <strong className="font-semibold">Enviar Todos os Produtos</strong>.
                 </InfoBox>
                 <img 
                   src="image_b39ddc.png" 
                   alt="Tela de Alterar Interfaces Externas Filial 1 com a opção 'Usar Api' marcada" 
                   className="max-w-xs border rounded-md shadow-lg"
                 />
                 <p className="text-sm text-muted-foreground">
                   Após esse passo, a correção manual de itens já estará funcional.
                 </p>
               </div>
             </StepCard>
 
             <StepCard step={2} title="Configuração do SDTributario.ini para Correção Automática" important>
               <div className="space-y-3">
                 <p>
                   O arquivo <code className="bg-muted px-1 py-0.5 rounded">SDTributario.ini</code> é necessário para a correção automática de produtos.
                 </p>
                 
                 <p className="font-medium mb-2">2.1 - Verificar configurações essenciais:</p>
                 <ul className="space-y-1 text-sm">
                   <li>• Verifique a <code className="bg-muted px-1 py-0.5 rounded">idFilial</code> padrão.</li>
                   <li>• Verifique o <code className="bg-muted px-1 py-0.5 rounded">Server</code> e <code className="bg-muted px-1 py-0.5 rounded">ipServidorDados</code> (IP e Caminho para o banco).</li>
                   <li>• O CNPJ da filial padrão é definido na chave <code className="bg-muted px-1 py-0.5 rounded">docEmpresa</code>.</li>
                 </ul>
 
                 <InfoBox type="warning" title="Atenção ao Ambiente">
                   No exemplo abaixo, o cliente está no LINUX e a letra do servidor Windows é C. Ajuste o <code className="bg-muted px-1 py-0.5 rounded">letraBanco</code> e <code className="bg-muted px-1 py-0.5 rounded">servidorLinux</code> caso o banco esteja no WINDOWS ou se a letra seja diferente.
                 </InfoBox>
 
                 <img 
                   src="image_b39d7d.png" 
                   alt="Conteúdo do arquivo SDTributario.ini com IPs e configurações de banco" 
                   className="max-w-full border rounded-md shadow-lg"
                 />
                 <img 
                   src="image_b39d9b.png" 
                   alt="Conteúdo do arquivo SDTributario.ini mostrando idFilial e nomeComputador" 
                   className="max-w-full border rounded-md shadow-lg"
                 />
                  <img 
                   src="image_b39d58.png" 
                   alt="Conteúdo do arquivo SDTributario.ini mostrando docEmpresa e outras configurações" 
                   className="max-w-full border rounded-md shadow-lg"
                 />
               </div>
             </StepCard>
             
             <StepCard step={3} title="Executar o SDTributario.exe" important>
               <div className="space-y-3">
                 <p>
                   Crie um atalho do <code className="bg-muted px-1 py-0.5 rounded">SDTributario.exe</code> na área de trabalho e configure-o para <strong className="font-semibold">Executar como Administrador</strong>.
                   Após todas as configurações, basta abrir o SDTributário para iniciar a atualização automática de produtos.
                 </p>
               </div>
             </StepCard>
 
             <StepCard step={4} title="Solução de Problemas Comuns" status="warning">
               <div className="space-y-3">
                 <p className="font-medium mb-2">A - Erro "Failed to load dynlib/dll 'C:\Windows\system32\fbclient.dll'"</p>
                 <p className="text-sm text-muted-foreground">
                   Se este erro ocorrer durante a atualização de produtos, é necessário colocar as DLLs do arquivo <code className="bg-muted px-1 py-0.5 rounded">dllsfirebird64.rar</code> (30 set. 2025, 03:19 PM) na pasta <code className="bg-muted px-1 py-0.5 rounded">System32</code>.
                 </p>
                 <img 
                   src="image_b39a15.png" 
                   alt="Mensagem de erro 'Failed to load dynlib/dll 'C:\\Windows\\system32\\fbclient.dll''" 
                   className="max-w-full border rounded-md shadow-lg"
                 />
 
                 <p className="font-medium mt-4 mb-2">B - Erro "Integração desabilitada via WebService"</p>
                 <p className="text-sm text-muted-foreground">
                   Outro problema comum é a mensagem "Integração desabilitada via WebService. Entre em contato com o administrador". A correção é solicitar a atualização do **TOKEN do cliente** no SD Super.
                 </p>
                  <img 
                   src="image_b399f3.png" 
                   alt="Mensagens de erro 'Integração desabilitada via WebService'" 
                   className="max-w-full border rounded-md shadow-lg"
                 />
               </div>
             </StepCard>
             
             <InfoBox type="warning" title="Alerta Final (Corretor Fiscal Instalado)">
               <p>
                 Se o servidor já possuir o **Corretor Fiscal** instalado, é imprescindível entrar em contato com a equipe do Acerto Fiscal para que eles acessem via AnyDesk e realizem a desinstalação antes de prosseguir com a instalação da API.
               </p>
             </InfoBox>
 
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
                  <CodeBlock title="Comando para abrir o Regedit">WIN R → digite "regedit"</CodeBlock>
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

        case "vnc-error":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Solução: Erro no VNC</h1>
            
            <InfoBox type="warning" title="Atenção">
              Este procedimento irá reinstalar o serviço VNC no computador. É necessário ter privilégios de administrador.
            </InfoBox>

            <StepCard step={1} title="Parar Serviço SDRemoto" important>
              <p className="mb-3">Pare o serviço do SDRemoto para iniciar o procedimento:</p>
              <ul className="space-y-2 text-sm">
                <li>• Abra o Gerenciador de Serviços (<code className="bg-muted px-1 py-0.5 rounded">services.msc</code>).</li>
                <li>• Localize e selecione o serviço chamado <code className="bg-muted px-1 py-0.5 rounded">SDRemoto</code>.</li>
                <li>• Clique em <strong className="font-semibold">Parar</strong> para encerrar o serviço.</li>
              </ul>
            </StepCard>

            <StepCard step={2} title="Reinstalar UVNC Remoto" important>
              <div className="space-y-3">
                <p>Navegue até a pasta do SD Remoto e reinstale o serviço VNC:</p>
                
                <div>
                  <p className="font-medium mb-2">2.1 - Localizar o executável:</p>
                  <CodeBlock title="Caminho do arquivo">
                    C:\windows\SDRemoto\UVNCRemoto.exe
                  </CodeBlock>
                </div>
                
                <div>
                  <p className="font-medium mb-2">2.2 - Desinstalar, Instalar e Iniciar:</p>
                  <p className="text-sm">Com o <code className="bg-muted px-1 py-0.5 rounded">UVNCRemoto.exe</code> em mãos, siga os passos:</p>
                  <ol className="list-decimal list-inside ml-4 space-y-1 text-sm">
                    <li>Clique em <strong className="font-semibold">Uninstall</strong>.</li>
                    <li>Clique em <strong className="font-semibold">Install</strong>.</li>
                    <li>Clique em <strong className="font-semibold">Start</strong> para iniciar o novo serviço.</li>
                  </ol>
                </div>
              </div>
            </StepCard>
            
            <StepCard step={3} title="Teste Final" status="completed">
              <p>O serviço VNC foi reinstalado. Agora, teste a conexão remota:</p>
              <ul className="space-y-2 text-sm">
                <li>• Testar o VNC novamente pelo SD Super.</li>
             </ul>
             <InfoBox type="success">
                Se o acesso funcionar, o problema foi resolvido.
              </InfoBox>
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

      case "acerto-fiscal-gratuito":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-2 text-foreground">Integração Acerto Fiscal Gratuito (NCM/CEST)</h2>
            <p className="text-muted-foreground mb-6">
              Guia completo para configurar a revisão gratuita de NCM e CEST em parceria com o Acerto Fiscal.
            </p>

            <InfoBox type="tip" title="Recurso 100% Gratuito">
              <p>Este recurso permite revisar e corrigir o NCM e CEST dos produtos automaticamente, consultando o código de barras (EAN) na base do Acerto Fiscal. Não requer ativação de chave ou contrato extra.</p>
            </InfoBox>

            <InfoBox type="info" title="Versões Mínimas Necessárias">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>SD Super:</strong> v.2543</li>
                <li><strong>SD SuperX:</strong> v.507</li>
                <li><strong>SD Tributário:</strong> v.1.0.43</li>
              </ul>
            </InfoBox>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">O que o sistema revisa e corrige?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-sm text-primary mb-2">🇧🇷 Produtos Nacionais</h4>
                <p className="text-sm text-muted-foreground">Códigos padrão Brasil (iniciados em 789 e 790).</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-sm text-primary mb-2">🌍 Produtos Importados</h4>
                <p className="text-sm text-muted-foreground">Itens vendidos no Brasil com código de origem internacional (padrão GS1).</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-sm text-primary mb-2">📦 Caixas e Fardos</h4>
                <p className="text-sm text-muted-foreground">Códigos logísticos de 14 dígitos (GTIN-14) para atacado/caixa fechada.</p>
              </div>
            </div>

            <InfoBox type="warning" title="Trava de Segurança — O sistema NÃO altera:">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Códigos Internos (777...):</strong> Produtos cadastrados manualmente pelo SD Super.</li>
                <li><strong>Balança/Pesáveis (2...):</strong> Produtos de padaria/açougue com códigos variáveis.</li>
                <li><strong>Códigos Curtos:</strong> Códigos com menos de 8 dígitos (inválidos para fiscal).</li>
              </ul>
              <p className="mt-2 text-xs">A trava impede que o sistema sobrescreva um cadastro manual específico feito pelo contador.</p>
            </InfoBox>

            <StepCard step={1} title="Ativar a Integração" important>
              <p className="mb-3">Acesse o caminho abaixo no sistema:</p>
              <CodeBlock title="Caminho no sistema">
                {`Controle > Computador > Interface Externa > Acerto Fiscal`}
              </CodeBlock>
              <p className="mt-3 mb-2">Marque as seguintes opções:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-primary rounded bg-primary/20" />
                  <strong>Ativar Integração Gratuita NCM e CEST</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-primary rounded bg-primary/20" />
                  <strong>Usar API</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-primary rounded bg-primary/20" />
                  <strong>Usar HTTPS</strong>
                </li>
              </ul>
              <InfoBox type="info">
                <p>Não é necessário preencher os campos <strong>Id Cliente</strong> e <strong>Token</strong> para a integração gratuita.</p>
              </InfoBox>
            </StepCard>

            <StepCard step={2} title="Ativando botão Acerto Fiscal nos produtos">
              <p className="mb-3">Caso o botão/ícone do Acerto Fiscal não apareça na tela de cadastro de produtos, é necessário ativá-lo nas configurações:</p>
              <CodeBlock title="Caminho no sistema">
                {`Controle > Computador > Configurações > aba Produtos`}
              </CodeBlock>
              <p className="mt-3 mb-2">No campo <strong>Impostos</strong>, selecione a opção:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-primary rounded bg-primary/20" />
                  <strong>Acerto Fiscal</strong>
                </li>
              </ul>
              <InfoBox type="tip">
                <p>Após selecionar "Acerto Fiscal" no campo Impostos, o botão/ícone do Acerto Fiscal passará a ser exibido na tela de cadastro e alteração de produtos.</p>
              </InfoBox>
              <InfoBox type="warning">
                <p>Se mesmo após a configuração o botão não aparecer, feche e reabra o sistema para que a alteração tenha efeito.</p>
              </InfoBox>
            </StepCard>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">Como Utilizar (Dois Caminhos)</h3>

            <StepCard step={3} title="Caminho A — Revisão Individual (Tela de Alterar Produto)">
              <p className="mb-2 text-sm text-muted-foreground">Ideal para cadastrar um item novo ou corrigir uma rejeição de nota específica.</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Acesse o <strong>cadastro do produto</strong>.</li>
                <li>Clique no botão/ícone do <strong>Acerto Fiscal</strong>.</li>
                <li>O sistema busca os dados e preenche <strong>NCM/CEST</strong> na hora.</li>
              </ol>
              <InfoBox type="tip">
                <p>Se o produto for encontrado, os campos são atualizados automaticamente e a data de revisão é registrada.</p>
              </InfoBox>
            </StepCard>

            <StepCard step={4} title="Caminho B — Revisão em Lote (Tela de Manutenção de Produtos)">
              <p className="mb-2 text-sm text-muted-foreground">Ideal para revisão massiva ou revisão periódica.</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Acesse a tela de <strong>Manutenção de Produtos</strong>.</li>
                <li>Selecione um grupo de produtos (ou todos os produtos filtrados).</li>
                <li>Acione a opção do <strong>Acerto Fiscal</strong>.</li>
                <li>O sistema processará a lista sequencialmente.</li>
              </ol>
              <InfoBox type="warning">
                <p><strong>Atenção:</strong> Este procedimento não poderá ser desfeito. Confirme antes de prosseguir.</p>
              </InfoBox>
            </StepCard>

            <StepCard step={5} title="Verificar Histórico de Operações">
              <p className="mb-3">Após a revisão, consulte o <strong>Histórico</strong> do produto para ver o resultado:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 text-sm mb-1">✅ Sucesso</h4>
                  <p className="text-sm text-muted-foreground">O produto recebe a data de revisão e os campos NCM/CEST são atualizados.</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm mb-1">⚠️ Não Encontrado</h4>
                  <p className="text-sm text-muted-foreground">O produto não recebe data de revisão, mas é gerado um registro no Histórico informando "Produto não Classificado/Revisado".</p>
                </div>
              </div>
            </StepCard>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">Perguntas Frequentes</h3>
            <div className="space-y-4 mb-6">
              {[
                { q: "Preciso ligar para o suporte do Acerto Fiscal para ativar?", a: "Não. O recurso já está disponível nativamente na versão indicada. Basta atualizar o sistema, ter conexão com a internet, ativar em Interface Externa e avisar ao cliente que ele já pode usar." },
                { q: "É realmente gratuito?", a: "Sim. A consulta de EAN para NCM/CEST é um benefício gratuito que a SD está oferecendo em parceria com o Acerto Fiscal." },
                { q: "O sistema corrige a Tributação (ICMS/PIS/COFINS) completa?", a: "Não. O foco deste recurso gratuito é o saneamento cadastral base (NCM e CEST). Para tributação estadual completa, consulte as condições comerciais da integração plena." },
                { q: "Funciona para produtos sem código de barras?", a: "Não. A consulta depende de um código de barras (EAN/GTIN) válido para encontrar o produto na base fiscal." },
              ].map((faq, i) => (
                <div key={i} className="bg-card border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-foreground mb-1">{i + 1}. {faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">Boas Práticas</h3>
            <InfoBox type="tip" title="Dicas para o cliente">
              <ul className="list-disc list-inside space-y-2">
                <li>Não tente revisar o cadastro inteiro de uma vez (ex: 50 mil itens) se a internet for instável. Filtre por setor (ex: "Bebidas", depois "Mercearia") na tela de Manutenção.</li>
                <li>Verifique o <strong>Histórico</strong>: Se o NCM não mudou, peça para o cliente olhar a aba Histórico do produto. Lá estará o motivo (ex: "Já está correto" ou "Ignorado por ser código interno").</li>
              </ul>
            </InfoBox>

            <InfoBox type="info" title="Contato Acerto Fiscal">
              <p>Para classificação tributária completa, entre em contato: <strong>(22) 3851-2302</strong></p>
            </InfoBox>
          </div>
        );

      case "biometrico-hamster":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Instalação do Leitor Biométrico Hamster</h1>
            
            <InfoBox type="info" title="Sobre">
              Este guia orienta a instalação do leitor biométrico Hamster DX / Hamster III da Fingertech (NITGEN) para uso com o sistema SD PDV.
            </InfoBox>

            <StepCard step={1} title="Baixar os arquivos de instalação" important>
              <p className="mb-3">Faça o download dos arquivos necessários clicando nos links abaixo:</p>
              <div className="space-y-2">
                <a
                  href="/downloads/Windows-Guia_de_Instalacao_SDK_eNBioBSP.pdf"
                  download
                  className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors text-sm font-medium text-foreground"
                >
                  <Download className="h-4 w-4 text-primary" />
                  Guia de Instalação SDK eNBioBSP (PDF)
                </a>
                <a
                  href="https://drive.usercontent.google.com/download?id=1pZVBALZnmijqZjMpErGno95GDEnEGpQT&export=download&authuser=0"
                  download
                  className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors text-sm font-medium text-foreground"
                >
                  <Download className="h-4 w-4 text-primary" />
                  Arquivos de Instalação Hamster (Download)
                </a>
              </div>
              <InfoBox type="tip">
                <p>O serial de ativação é: <code className="bg-muted px-1 py-0.5 rounded text-xs">010101-BFA9CA29B815101D-D498379F67E452D8</code></p>
              </InfoBox>
            </StepCard>

            <StepCard step={2} title="Instalar o SDK eNBioBSP (setup.exe)" important>
              <p className="mb-3">Execute o instalador do SDK conforme a arquitetura do sistema:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Dentro da pasta de instalação, entre na pasta <strong>x64</strong> (64 bits) ou <strong>x86</strong> (32 bits).</li>
                <li>Execute o arquivo <code className="bg-muted px-1 py-0.5 rounded">setup.exe</code> como <strong>Administrador</strong>.</li>
                <li>Na tela de boas-vindas, clique em <strong>Next</strong>.</li>
                <li>Aceite os termos clicando em <strong>Yes</strong>.</li>
                <li>Preencha os campos:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li><strong>User Name:</strong> nome do usuário</li>
                    <li><strong>Company Name:</strong> nome da empresa</li>
                    <li><strong>Serial Number:</strong> cole o conteúdo do arquivo SERIAL.txt</li>
                  </ul>
                </li>
                <li>Clique em <strong>Next</strong> até finalizar a instalação.</li>
                <li>Se solicitado instalar o <strong>.NET Framework v2.0</strong>, clique em <strong>Sim</strong> e siga Next até o final.</li>
                <li>Clique em <strong>Finish</strong> para concluir.</li>
              </ol>
            </StepCard>

            <StepCard step={3} title="Instalar o Driver do Leitor">
              <p className="mb-3">Instale o driver específico do Hamster DX / Hamster III:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Execute o instalador do <strong>driver do Hamster</strong> como Administrador.</li>
                <li>Siga as instruções do instalador até concluir.</li>
                <li>Conecte o leitor biométrico na porta USB.</li>
              </ol>
              <InfoBox type="warning">
                <p>Certifique-se de que o dispositivo é reconhecido no Gerenciador de Dispositivos do Windows antes de prosseguir.</p>
              </InfoBox>
            </StepCard>

            <StepCard step={4} title="Copiar as DLLs para o sistema">
              <p className="mb-3">Copie os arquivos DLL da terceira pasta para as pastas do sistema:</p>
              <CodeBlock title="Pastas de destino">
{`C:\\Windows\\System32
C:\\Windows\\SysWOW64`}
              </CodeBlock>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Abra a pasta que contém as <strong>DLLs</strong> do leitor.</li>
                <li>Copie <strong>todos os arquivos .dll</strong> da pasta.</li>
                <li>Cole em <code className="bg-muted px-1 py-0.5 rounded">C:\Windows\System32</code></li>
                <li>Cole também em <code className="bg-muted px-1 py-0.5 rounded">C:\Windows\SysWOW64</code></li>
              </ol>
              <InfoBox type="warning">
                <p>É necessário privilégios de <strong>Administrador</strong> para colar arquivos nessas pastas. Confirme a substituição se solicitado.</p>
              </InfoBox>
            </StepCard>

            <StepCard step={5} title="Configurar o SDPdv.xml" important>
              <p className="mb-3">Por fim, edite o arquivo <code className="bg-muted px-1 py-0.5 rounded">SDPdv.xml</code> para habilitar o leitor Hamster:</p>
              <CodeBlock title="Localizar e editar o SDPdv.xml">
{`Abra o arquivo SDPdv.xml na pasta do SDPdv`}
              </CodeBlock>
              <p className="mt-3 mb-2">Localize ou adicione a tag <strong>LeitorBiometrico</strong> com o seguinte conteúdo:</p>
              <CodeBlock title="Configuração XML">
{`<LeitorBiometrico>
    <LBModelo>Hamster</LBModelo>
</LeitorBiometrico>`}
              </CodeBlock>
              <InfoBox type="tip">
                <p>Caso a tag <code className="bg-muted px-1 py-0.5 rounded">&lt;LeitorBiometrico&gt;</code> já exista no XML, apenas altere o valor de <code className="bg-muted px-1 py-0.5 rounded">&lt;LBModelo&gt;</code> para <strong>Hamster</strong>.</p>
              </InfoBox>
            </StepCard>

            <StepCard step={6} title="Testar o Leitor" status="completed">
              <p className="mb-3">Após todas as configurações, teste o funcionamento:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Reinicie o computador.</li>
                <li>Abra o <strong>SD PDV</strong>.</li>
                <li>Verifique se o leitor biométrico é reconhecido na tela de login ou cadastro de digital.</li>
              </ol>
              <InfoBox type="success">
                Se o leitor for reconhecido e capturar a digital corretamente, a instalação foi concluída com sucesso!
              </InfoBox>
            </StepCard>
          </div>
        );

      case "comparativo-fiscal-intro":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Comparativo Fiscal</h1>
            <p className="text-lg text-muted-foreground">
              Padronizar os acertos no comparativo fiscal visando maior eficiência no período de SPED fiscal e dar soluções definitivas.
            </p>

            <InfoBox type="info" title="Objetivo">
              Este guia orienta o passo a passo para corrigir as diferenças no comparativo fiscal. 
              É fundamental seguir a ordem dos passos para evitar retrabalho e garantir que todas as diferenças sejam resolvidas corretamente.
            </InfoBox>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-2 text-foreground">📋 Ordem dos Passos</h3>
                <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Transmitir notas de devolução</li>
                  <li>Acertar rejeitadas e notas em conflito</li>
                  <li>Carregar a tela de Comparativo Fiscal</li>
                  <li>Acertar vendas duplicadas</li>
                  <li>Verificar divergências de itens</li>
                </ol>
              </div>
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <h3 className="font-semibold mb-2 text-primary">⚠️ Importante</h3>
                <p className="text-sm text-muted-foreground">
                  Siga rigorosamente a ordem dos passos. Acertar devoluções e rejeitadas antes de verificar vendas duplicadas 
                  evita confusão nas diferenças positivas do comparativo.
                </p>
              </div>
            </div>
          </div>
        );

      case "comparativo-fiscal-devolucao":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">1 – Transmitir Notas de Devolução</h1>
            <p className="text-muted-foreground">
              Acesse <strong>Fiscal → Saídas → Controle de Importação de XMLs</strong> para gerar as notas de devolução pendentes.
            </p>

            <StepCard step={1} title="Selecionar a crítica correta">
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Selecione a crítica <strong>"Ocorrência de venda Existente na Migrate que não consta no Super"</strong></li>
                <li>Clique em <strong>Detalhar</strong></li>
                <li>Na tela de detalhamento, deixe apenas a opção <strong>"Autorizados"</strong> selecionada</li>
              </ol>
            </StepCard>

            <StepCard step={2} title="Gerar as notas de devolução">
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Marque todas as vendas listadas</li>
                <li>Clique no botão <strong>NF-e</strong> para gerar as notas de devolução</li>
                <li>O sistema pedirá uma <strong>chave de confirmação</strong> — confirme</li>
                <li>Transmita todas as notas pendentes referentes à devolução de NFC-e</li>
              </ol>
            </StepCard>

            <InfoBox type="info" title="Observação sobre o Sentinela">
              O Sentinela gera automaticamente notas de devolução durante o mês para otimizar o tempo de acerto do comparativo. 
              Atualmente ele gera cerca de <strong>80% dos casos</strong>. O restante precisa ser gerado manualmente seguindo este passo.
            </InfoBox>
          </div>
        );

      case "comparativo-fiscal-rejeitadas":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">2 – Acerto de Rejeitadas e Notas em Conflito</h1>

            <StepCard step={1} title="Acertar notas rejeitadas" important>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Acesse o <strong>InvoiCy</strong> e filtre o mês desejado</li>
                <li>Filtre apenas as notas <strong>Rejeitadas</strong></li>
                <li>Exporte as XML's</li>
                <li>Use o <strong>SDXml</strong> para acertar essas XML's</li>
              </ol>
            </StepCard>

            <StepCard step={2} title="Sincronizar vendas rejeitadas">
              <p className="mb-3">Após o acerto e envio, detalhe a crítica <strong>"Vendas rejeitadas na Migrate"</strong> para sincronizar:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Na tela de <strong>Controle de Importação de XMLs</strong>, selecione a crítica "Vendas Rejeitada na Migrate"</li>
                <li>Marque as vendas e clique em <strong>Sincronizar</strong></li>
              </ol>
              <InfoBox type="warning">
                <p>A sincronização é necessária pois as vendas rejeitadas <strong>não vão para a tela de saídas</strong>. 
                Essa sincronização cria a saída, acertando as diferenças no comparativo fiscal.</p>
              </InfoBox>
              <InfoBox type="info" title="Observação">
                Em alguns casos, mesmo após sincronizar, as vendas não saem do detalhamento da crítica. 
                Verifique se a saída foi criada. Caso não encontre, baixe a XML do InvoiCy e anexe na tela de saídas usando o botão <strong>XML</strong>.
              </InfoBox>
            </StepCard>

            <StepCard step={3} title="Notas em conflito">
              <p className="mb-3">As notas em conflito acontecem quando a SEFAZ não comunica corretamente com o InvoiCy.</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>No InvoiCy, filtre por status <strong>"Em conflito"</strong></li>
                <li>Realize o <strong>download</strong> das notas em conflito</li>
                <li>Importe na <strong>tela de saídas</strong> para acerto do comparativo</li>
              </ol>
              <InfoBox type="info">
                <p>As notas em conflito também aparecem na crítica <strong>"Vendas rejeitadas na Migrate"</strong>.</p>
              </InfoBox>
            </StepCard>
          </div>
        );

      case "comparativo-fiscal-tela":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">3 – Carregar a Tela de Comparativo Fiscal</h1>
            <p className="text-muted-foreground">
              Acesse <strong>Fiscal → Relatório → Comparativo Fiscal</strong>
            </p>

            <StepCard step={1} title="Entendendo a tela" important>
              <p className="mb-3">Essa tela é o <strong>ponto chave</strong> do período de SPED. Ela mostra o dia e PDV que estão com diferença, facilitando a conferência.</p>
              
              <div className="overflow-x-auto my-4">
                <table className="w-full text-sm border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-3 py-2 text-left">Coluna</th>
                      <th className="border border-border px-3 py-2 text-left">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-border px-3 py-2 font-medium">Pdv MFD / NFCe</td><td className="border border-border px-3 py-2">Valor total de vendas dos PDVs</td></tr>
                    <tr><td className="border border-border px-3 py-2 font-medium">Substituída</td><td className="border border-border px-3 py-2">Valor total de substituição de NFC-e por NF-e</td></tr>
                    <tr><td className="border border-border px-3 py-2 font-medium">Devolução</td><td className="border border-border px-3 py-2">Valor total de devoluções de NFC-e</td></tr>
                    <tr><td className="border border-border px-3 py-2 font-medium">Saída</td><td className="border border-border px-3 py-2">Valor total das saídas fiscal NFC-e</td></tr>
                    <tr><td className="border border-border px-3 py-2 font-medium">Diferença</td><td className="border border-border px-3 py-2">Pdv - Substituída + Devolvida - Saída</td></tr>
                  </tbody>
                </table>
              </div>
            </StepCard>

            <InfoBox type="warning" title="Importante sobre performance">
              Dependendo do cliente, a tela pode ser <strong>lenta</strong> devido ao volume de dados de vendas e saídas. 
              Por isso ela só deve ser carregada após já ter acertado as devoluções, rejeitadas e notas em conflito (passos 1 e 2).
            </InfoBox>

            <InfoBox type="tip" title="Dica de eficiência">
              Carregar a tela a cada acerto é ineficiente. O recomendado é carregar <strong>1 vez</strong> e ir acertando dia a dia 
              usando a tela de <strong>Controle de Importação de XMLs</strong>. Ao terminar todos os acertos, carregue a tela novamente para conferência final.
            </InfoBox>
          </div>
        );

      case "comparativo-fiscal-duplicadas":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">4 – Vendas Duplicadas</h1>
            
            <InfoBox type="warning" title="Pré-requisito obrigatório">
              É <strong>obrigatório</strong> efetuar todos os acertos dos passos 1 e 2 antes de iniciar o acerto das vendas duplicadas. 
              As rejeitadas e NFC-e em conflito também aparecem como diferença positiva, o que pode causar confusão.
            </InfoBox>

            <p className="text-muted-foreground">
              As vendas duplicadas sempre aparecem como uma <strong>diferença positiva (azul)</strong> no comparativo fiscal.
            </p>

            <StepCard step={1} title="Como identificar – Primeira forma">
              <p className="mb-3">Na tela de <strong>Cadastro de Cupons Fiscais</strong>:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Filtre por data e PDV conforme o dia com diferença no comparativo</li>
                <li>No campo de busca, digite o <strong>valor da diferença</strong></li>
                <li>Se encontrar um cupom com esse valor exato, é a venda duplicada</li>
                <li>Se não encontrar, use a segunda forma</li>
              </ol>
            </StepCard>

            <StepCard step={2} title="Como identificar – Segunda forma (mais assertiva)" important>
              <p className="mb-3">Exporte os cupons para Excel e use o recurso de duplicados:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Na tela de cupons fiscais, filtre o máximo possível (data e PDV)</li>
                <li>Exporte para <strong>Excel</strong></li>
                <li>Selecione a coluna dos <strong>números de cupom</strong></li>
                <li>Use o recurso do Excel: <strong>Página Inicial → Formatação Condicional → Regras de Realce das Células → Valores Duplicados</strong></li>
                <li>Os cupons duplicados serão destacados</li>
              </ol>
              <InfoBox type="tip">
                <p>Pode ser exportado mais dias caso tenha diferenças seguidas de vendas duplicadas.</p>
              </InfoBox>
            </StepCard>

            <StepCard step={3} title="Como efetuar o acerto">
              <p className="mb-3">Para acertar a venda duplicada:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Filtre a tela de <strong>Saídas</strong> e <strong>Cupons Fiscais</strong> pelo mesmo período/PDV</li>
                <li>Faça o questionamento: <strong>"Qual venda não está aparecendo em saídas?"</strong></li>
                <li>Essa é a venda que deve ser <strong>cancelada manualmente</strong> na tela de cupons fiscais</li>
              </ol>
              <InfoBox type="info">
                <p>O valor da venda cancelada pode ser <strong>maior</strong> que o valor da diferença. Após o cancelamento, 
                pode surgir uma diferença de valor negativo — isso é <strong>normal</strong>.</p>
              </InfoBox>
              <InfoBox type="tip" title="Dica de eficiência">
                Após cancelar a venda, <strong>não recarregue</strong> a tela de comparativo fiscal. 
                Vá rolando para a próxima diferença, identifique o motivo, acerte e role novamente. 
                Só recarregue a tela ao chegar no final.
              </InfoBox>
            </StepCard>

            <DuplicateChecker />
          </div>
        );

      case "comparativo-fiscal-divergencias":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">5 – Divergências de Itens</h1>
            <p className="text-muted-foreground">
              O objetivo dessa crítica é analisar se existe uma divergência entre o valor dos itens entre as saídas e vendas.
            </p>

            <StepCard step={1} title="Exemplo 1 – Diferença parcial (NÃO gerar NF-e)">
              <div className="space-y-2 text-sm">
                <p><strong>Cupons Fiscais:</strong> Pdv1 – Número do cupom → R$20,00</p>
                <p><strong>Saídas:</strong> Pdv01 – Número da saída → R$15,00</p>
                <p className="mt-2">Nesse caso, a diferença é de R$5,00. <strong>Não podemos gerar uma NF-e de R$5,00</strong> — o sistema 
                geraria uma devolução do valor total, criando mais diferenças.</p>
              </div>
              <InfoBox type="warning">
                <p>Quando a venda tem valor e a saída tem valor diferente, <strong>não gere NF-e da diferença</strong>. 
                Compare item a item para identificar o motivo da divergência (desconto, frete, outras despesas).</p>
              </InfoBox>
            </StepCard>

            <StepCard step={2} title="Exemplo 2 – Venda zerada na MFD (pode gerar NF-e)">
              <div className="space-y-2 text-sm">
                <p><strong>Cupons Fiscais:</strong> Pdv1 – Número do cupom → R$0,00</p>
                <p><strong>Saídas:</strong> Pdv01 – Número da saída → R$20,00</p>
                <p className="mt-2">Nesse caso, <strong>é possível</strong> marcar a venda e gerar a NF-e e transmitir.</p>
              </div>
            </StepCard>

            <InfoBox type="info" title="Objetivo da crítica">
              Além de gerar NF-e em casos específicos, essa crítica ajuda a identificar possíveis <strong>bugs no SDPdv ou SDSuper</strong>, 
              como o não envio de valor de desconto para a saída, ou valores como frete e outras despesas não sendo considerados. 
              A verificação detalhada de saídas × vendas deve ser feita <strong>pós período de SPED fiscal</strong>.
            </InfoBox>

            <InfoBox type="warning" title="Atualização de PDV obrigatória">
              Sempre que identificar uma versão do PDV muito antiga (abaixo da <strong>270</strong>), agende a atualização dos PDVs 
              para evitar motivos de diferença no comparativo. Pondere a versão a usar — se a última versão liberada tiver algum bug, não a utilize.
            </InfoBox>

            <DivergenceChecker />
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
