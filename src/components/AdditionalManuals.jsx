import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepCard from "./StepCard";
import InfoBox from "./InfoBox";
import CodeBlock from "./CodeBlock";
import mei from "@/assets/manuals/mei.asset.json";
import administradora from "@/assets/manuals/administradora.asset.json";
import ramuza from "@/assets/manuals/ramuza.asset.json";
import sync from "@/assets/manuals/sdsync.asset.json";

const manualInfo = {
  "manual-contra-nota-mei": { title: "Contra Nota MEI", description: "Emissão da contra nota, exportação do XML e recebimento da compra.", asset: mei },
  "manual-administradora-cartao": { title: "Cadastro de Administradora de Cartão", description: "Cadastro de cartões, geração de bandeira e conciliação no SDSuper.", asset: administradora },
  "ramuza-carga": { title: "Carga de Balança Ramuza — Atena II", description: "Correção de preços divergentes entre o SDSuper, o Atena II e as balanças.", asset: ramuza },
  "sdsync-instalacao-validacao": { title: "SDSync — Instalação e Validação de Carga", description: "Implantação, configuração de filiais e diagnóstico de falhas na sincronização.", asset: sync },
};

function MeiManual() {
  return <>
    <InfoBox title="Antes da emissão">Quando a operação exigir contra nota para a compra de fornecedor MEI, emita para o CNPJ da própria loja. Confira o tipo <strong>Entrada</strong> e a natureza <strong>Compra</strong>, em vez de Saída/Venda. Valide o enquadramento fiscal do fornecedor com o responsável fiscal: MEI não é sinônimo de pessoa física.</InfoBox>
    <StepCard step={1} title="Manifesto — Gerar a contra nota">
      <ol className="list-decimal pl-5 space-y-2"><li>Abra o Manifesto e procure a nota do fornecedor MEI. A pesquisa pode ser feita pela chave da nota.</li><li>Clique em <strong>Contra Nota</strong>.</li><li>Selecione os produtos e clique em <strong>OK</strong>, caso já estejam associados.</li></ol>
    </StepCard>
    <StepCard step={2} title="Emissão — Transmitir e exportar o XML">
      <ol className="list-decimal pl-5 space-y-2"><li>Na tela de Emissão, filtre pela data e marque a contra nota gerada no Manifesto.</li><li>Transmita a contra nota.</li><li>Clique em <strong>Exportar</strong> e escolha uma pasta para salvar o XML.</li></ol>
    </StepCard>
    <StepCard step={3} title="Compras → Recebimento — Importar o XML">
      <ol className="list-decimal pl-5 space-y-2"><li>Acesse <strong>Compras → Recebimento</strong>.</li><li>Clique em <strong>Incluir</strong> para importar o XML.</li><li>Localize o arquivo exportado na etapa anterior.</li></ol>
    </StepCard>
    <InfoBox type="tip" title="Sequência do processo">Gerar a contra nota → transmitir → exportar o XML → incluir no Recebimento.</InfoBox>
  </>;
}

function CardAdministratorManual() {
  return <>
    <StepCard step={1} title="Cadastrar o cartão no SDSuper">
      <ol className="list-decimal pl-5 space-y-2"><li>Acesse <strong>Financeiro → Cartões → PdvS</strong>.</li><li>Na tela de Cadastro de Cartões PdvS, clique em <strong>Incluir</strong>.</li><li>Informe o nome do cartão e o tipo: <strong>Crédito</strong> ou <strong>Débito</strong>. Confirme o cadastro.</li></ol>
    </StepCard>
    <StepCard step={2} title="Gerar a bandeira pelo SDCarga">
      <p>Após o cadastro, o cartão pode estar sem bandeira. Abra o <strong>SDCarga</strong> e feche-o em seguida: nessa etapa, basta abrir o programa para obter a bandeira.</p>
    </StepCard>
    <StepCard step={3} title="Consultar a bandeira gerada">
      <p>Volte a <strong>Financeiro → Cartões → PdvS</strong>, localize o cartão cadastrado e confira o número da <strong>Bandeira</strong>. Utilize esse mesmo número no cadastro da administradora.</p>
    </StepCard>
    <StepCard step={4} title="Cadastrar a administradora" important>
      <ol className="list-decimal pl-5 space-y-2"><li>Em Financeiro → Cartões, abra o cadastro de <strong>Administradoras</strong> e clique em <strong>Incluir</strong>.</li><li>Preencha os dados da administradora, incluindo nome, tipo e a bandeira gerada anteriormente.</li><li>Selecione a <strong>Operadora</strong> que realmente transaciona as vendas desse cartão na loja.</li><li>Confira o campo <strong>Sitef Sem Bin</strong>: ele deve corresponder ao cartão cadastrado.</li><li>Confirme o cadastro para permitir a conciliação das vendas desse cartão.</li></ol>
      <InfoBox type="warning" title="Conferência da conciliação">CIELO é apenas o exemplo do manual. A operadora varia por loja; confira Operadora, Sitef Sem Bin e Bandeira antes de salvar.</InfoBox>
    </StepCard>
  </>;
}

function RamuzaManual() {
  return <>
    <InfoBox type="warning" title="Sintoma">O SDSuper atualiza o TxItens.txt, mas o Atena II e as balanças continuam com preços antigos. O caminho pode estar apontando somente para a pasta, sem o nome do arquivo, ou a importação ainda não foi executada.</InfoBox>
    <StepCard step={1} title="Configurar o arquivo de carga">
      <ol className="list-decimal pl-5 space-y-2"><li>Abra o <strong>Atena II</strong>.</li><li>No painel à direita, acesse <strong>Customizar arquivo</strong>.</li><li>Em <strong>Nome do arquivo</strong>, informe o caminho completo, incluindo <strong>TxItens.txt</strong>, ou selecione o arquivo pelo botão <strong>…</strong>.</li><li>Confira o formato do arquivo gerado pelo ERP, por exemplo <strong>MGV5(Windows-1252)</strong>.</li></ol>
      <CodeBlock title="Exemplo de caminho — ajuste à rede do cliente">{String.raw`\\192.168.2.149\carga balanca\TxItens.txt`}</CodeBlock>
    </StepCard>
    <StepCard step={2} title="Revisar os parâmetros">
      <ul className="list-disc pl-5 space-y-2"><li><strong>Deletar arquivo depois de ler:</strong> pode permanecer marcado se o ERP recria o arquivo periodicamente. Desmarque para manter o TXT disponível para conferência contínua.</li><li>Mantenha marcado <strong>Usando banco de dados e software de atualização</strong>.</li></ul>
    </StepCard>
    <StepCard step={3} title="Importar e conferir os preços">
      <ol className="list-decimal pl-5 space-y-2"><li>Clique em <strong>Customizar arquivo</strong> (ícone T no painel esquerdo), ou abra a tela de PLUs e clique em <strong>Importar/Exportar tudo</strong>.</li><li>Confira na lista de produtos se os preços do TXT foram importados para o banco do Atena II.</li></ol>
      <InfoBox title="Exemplo do atendimento">O item 50 estava a R$ 33,99 no Atena II e a R$ 36,99 no TXT. Após importar, o Atena II deve refletir R$ 36,99. Os valores e o endereço de rede são exemplos do manual.</InfoBox>
    </StepCard>
    <StepCard step={4} title="Enviar a carga às balanças" important>
      <ol className="list-decimal pl-5 space-y-2"><li>Na aba principal do Atena II, selecione as balanças ativas pelos respectivos IPs.</li><li>Clique em <strong>Download (para balança)</strong> para enviar a carga atualizada pela rede.</li><li>Confirme que os preços estão iguais no SDSuper, no Atena II e nas balanças.</li></ol>
    </StepCard>
  </>;
}

function SyncManual() {
  return <>
    <InfoBox title="Versão do manual: 26 (1.0.26)">O SDSync coleta dados dos PDVs e envia cargas do servidor, com HTTPS e autenticação JWT. A partir da <strong>1.0.25</strong>, a primeira execução exige configuração manual das filiais.</InfoBox>
    <StepCard step={1} title="Conferir o local de instalação">
      <p>Coloque o executável na mesma rede dos PDVs e, preferencialmente, no mesmo servidor do SDSentinel.</p>
      <CodeBlock title="Windows">{String.raw`[DISCO]:\SDSuper\Programas\SDSync.exe
[DISCO]:\SDSuper\Programas\SDConfiguracoes.exe`}</CodeBlock>
      <CodeBlock title="Linux" language="bash">{`/SDSuper/Programas/sdsync
/SDSuper/Programas/SDConfiguracoes`}</CodeBlock>
      <p>O <strong>SDConfigurações</strong> precisa estar na mesma pasta do executável do SDSync.</p>
    </StepCard>
    <StepCard step={2} title="Conferir configuração e filiais">
      <p>Os arquivos <strong>config.json</strong> e <strong>config_help.txt</strong> ficam em pasta própria, não junto ao executável.</p>
      <CodeBlock title="Pasta de configuração">{String.raw`Windows: [DISCO]:\SDSuper\SDSync\
Linux: /SDSuper/SDSync/`}</CodeBlock>
      <CodeBlock title="Criar a pasta no Linux" language="bash">sudo mkdir -p /SDSuper/SDSync</CodeBlock>
      <p>Confirme que a filial está <strong>cadastrada e habilitada</strong> na tabela <strong>SentinelasFiliais</strong> para o ID do Sentinel em execução.</p>
      <InfoBox type="warning">Execute apenas <strong>uma instância do SDSync por servidor</strong>. O serviço gerencia várias filiais de forma nativa.</InfoBox>
    </StepCard>
    <StepCard step={3} title="Primeira execução no Windows (1.0.25+)" important>
      <p>Abra o <strong>PowerShell como Administrador</strong> e execute (ajuste o disco se necessário):</p>
      <CodeBlock title="Vincular filiais" language="powershell">{String.raw`cd C:\SDSuper\Programas
.\SDSync.exe -c`}</CodeBlock>
      <p>Selecione os IDs das filiais separados por vírgula, ou digite <strong>0</strong> para todas. O assistente fecha sozinho; em seguida, abra o SDSync normalmente e confira o serviço.</p>
    </StepCard>
    <StepCard step={4} title="Primeira execução no Linux (1.0.25+)">
      <CodeBlock title="Vincular filiais" language="bash">{`cd /SDSuper/Programas
sudo ./sdsync -c`}</CodeBlock>
      <p>Selecione as filiais ou digite <strong>0</strong> para todas. Depois, inicie o serviço e confira o status:</p>
      <CodeBlock title="Iniciar e validar" language="bash">{`sudo systemctl start sdsync
sudo systemctl status sdsync`}</CodeBlock>
    </StepCard>
    <StepCard step={5} title="Validar o SDApp e enviar a carga">
      <p>Nas versões atuais do SDApp, os modos Assíncrono/Pull são ativados automaticamente. Se precisar configurar manualmente:</p>
      <ol className="list-decimal pl-5 space-y-2"><li>Ative o <strong>Modo Assíncrono</strong> no SDApp.</li><li>Envie uma carga inicial.</li><li>Após qualquer alteração no banco, ative o <strong>Modo Pull</strong>.</li><li>Dispare uma nova carga aos PDVs.</li></ol>
    </StepCard>
    <StepCard step={6} title="Diagnosticar problemas na carga" important>
      <ol className="list-decimal pl-5 space-y-2"><li>Confira a rede dos PDVs, os caminhos do executável e do SDConfigurações e se há somente uma instância em execução.</li><li>Confira a habilitação da filial em SentinelasFiliais e a seleção realizada pelo assistente <strong>-c</strong>.</li><li>Verifique o serviço e consulte o log para identificar erros de conexão, autenticação ou envio.</li><li>No <strong>config.json</strong>, revise <strong>CONTROLLE_CARGA</strong>: PAUSA_GLOBAL deve estar false para permitir cargas; FILIAIS_IGNORADAS e PDVS_IGNORADOS não devem bloquear os destinos desejados.</li><li>Revise também CONTROLLE_PULL caso a coleta esteja parada. Confira os modos do SDApp e envie uma nova carga após corrigir a causa.</li><li>Valide o resultado da carga no PDV e acompanhe os novos eventos no log.</li></ol>
      <CodeBlock title="Logs do sistema">{String.raw`Windows: [DISCO]:\SDSuper\SDSync\logs\sdsync.log
Linux: /SDSuper/SDSync/logs/sdsync.log`}</CodeBlock>
      <CodeBlock title="Versão e monitoramento no Linux" language="bash">{`cd /SDSuper/Programas
./sdsync -v
tail -f /SDSuper/SDSync/logs/sdsync.log`}</CodeBlock>
      <InfoBox type="warning" title="Nomes das configurações">O PDF apresenta diferenças entre os nomes da tabela técnica e os do template (por exemplo, CONTROLLE_CARGA e IMPORTAR_XML_REJEITADOS). Confira o config_help.txt da versão instalada antes de alterar parâmetros; não substitua o arquivo de produção sem backup.</InfoBox>
    </StepCard>
    <StepCard step={7} title="Atualizar o SDSync no Linux">
      <p>Na pasta do executável, pare o serviço, faça backup e substitua o arquivo pelo novo antes de reiniciar:</p>
      <CodeBlock title="Parar e preservar a versão anterior" language="bash">{`cd /SDSuper/Programas
sudo systemctl stop sdsync
mv sdsync sdsyncVERSAO_BKP`}</CodeBlock>
      <p>Substitua o executável e aplique as permissões conforme a política do ambiente.</p>
      <InfoBox type="warning">O manual usa chmod 777, que permite escrita por qualquer usuário. Valide as permissões com o administrador antes de aplicar esse comando em produção.</InfoBox>
      <CodeBlock title="Reiniciar e verificar" language="bash">{`sudo systemctl start sdsync
sudo systemctl status sdsync`}</CodeBlock>
      <p>Confira a nova versão e os logs. A referência completa de parâmetros e o template de config.json estão no manual original.</p>
    </StepCard>
  </>;
}

export const isAdditionalManual = (section) => Object.hasOwn(manualInfo, section);

export default function AdditionalManuals({ section }) {
  const manual = manualInfo[section];
  if (!manual) return null;
  return <div className="space-y-6 min-w-0">
    <header className="space-y-3">
      <h2 className="text-3xl font-bold text-foreground break-words">{manual.title}</h2>
      <p className="text-muted-foreground">{manual.description}</p>
      <Button asChild variant="outline"><a href={manual.asset.url} target="_blank" rel="noopener noreferrer"><Download className="mr-2 h-4 w-4" />Abrir manual original</a></Button>
    </header>
    {section === "manual-contra-nota-mei" && <MeiManual />}
    {section === "manual-administradora-cartao" && <CardAdministratorManual />}
    {section === "ramuza-carga" && <RamuzaManual />}
    {section === "sdsync-instalacao-validacao" && <SyncManual />}
  </div>;
}