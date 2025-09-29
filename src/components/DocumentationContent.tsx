import StepCard from "./StepCard";
import CodeBlock from "./CodeBlock";
import InfoBox from "./InfoBox";

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
                <CodeBlock title="Credenciais Gsurf">
Login: Fernando_Silva
Senha: SD@123!@#
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
                <p>Assim que o Super abrir, configure o módulo fiscal:</p>
                <div>
                  <p className="font-medium mb-2">Caminho:</p>
                  <CodeBlock>FISCAL → NF → CONFIGURAÇÕES</CodeBlock>
                </div>
                <InfoBox type="info">
                  Confirme as instalações solicitadas. O Super pode fechar sozinho após as configurações - isso é normal.
                  Abra novamente após o fechamento.
                </InfoBox>
              </div>
            </StepCard>

            <StepCard step={2} title="Configurar periféricos">
              <div className="space-y-3">
                <p>Configure impressoras e outros periféricos:</p>
                <div>
                  <p className="font-medium mb-2">Caminho:</p>
                  <CodeBlock>CONTROLE → COMPUTADOR → PERIFÉRICOS</CodeBlock>
                </div>
                <p className="text-sm">No último campo "IMPRESSORAS", selecionar "Impressora do Windows".</p>
              </div>
            </StepCard>

            <StepCard step={3} title="Finalizar e testar" important>
              <div className="space-y-3">
                <p>Para finalizar a instalação:</p>
                <div>
                  <p className="font-medium mb-2">Atualização:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Ir em "ATUALIZAR"</li>
                    <li>• Fazer ping para os PDVs</li>
                    <li>• Confirmar comunicação</li>
                  </ul>
                </div>
                <InfoBox type="success" title="Instalação concluída!">
                  Super instalado com sucesso. Teste todas as funcionalidades antes de finalizar.
                </InfoBox>
              </div>
            </StepCard>

            <StepCard step={4} title="Formulário de instalação">
              <div className="space-y-3">
                <p>Para facilitar futuras instalações, mantenha estas informações:</p>
                <CodeBlock title="Dados necessários para instalação">
Nome do cliente:
Número do PDV:
Modelo da impressora:
Modelo do PinPad:
Marca da balança:
CNPJ:
Usuário do Windows é administrador? ( ) Sim ( ) Não

TeamViewer ID:
Senha TeamViewer: SD@info1525
                </CodeBlock>
              </div>
            </StepCard>
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
