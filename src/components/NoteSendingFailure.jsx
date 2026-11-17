import { useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfoBox from "./InfoBox";
import StepCard from "./StepCard";
import { benefitTable, findBenefits, benefitPeriod } from "@/lib/beneficioCst";
import original from "@/assets/manuals/beneficio-cst.asset.json";

const formatDate = (date) => date ? date.split("-").reverse().join("/") : "—";

export default function NoteSendingFailure() {
  const [cst, setCst] = useState("");
  const [query, setQuery] = useState("");
  const rows = cst ? findBenefits(cst, query) : [];
  return <div className="space-y-6 min-w-0">
    <header className="space-y-3">
      <h2 className="text-3xl font-bold text-foreground">Falha no envio de nota</h2>
      <p className="text-muted-foreground">Código de benefício fiscal (cBenef) × CST do produto — Rio de Janeiro.</p>
      <Button asChild variant="outline"><a href={original.url} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4 mr-2" />Abrir tabela original</a></Button>
    </header>
    <InfoBox type="warning" title="Referência histórica — atualizada em 07/04/2022">
      Esta tabela é do <strong>RJ</strong> e não comprova a legislação vigente. O CST pode permitir vários benefícios: confirme a descrição, o enquadramento da operação e a vigência com o responsável fiscal antes de alterar o produto. Não escolha um código apenas para eliminar a rejeição.
    </InfoBox>
    <StepCard step={1} title="Identificar a rejeição e o produto">
      <p>Confira o retorno da nota no InvoiCy/SDXml. Se a falha estiver relacionada ao <strong>cBenef</strong>, localize o item indicado e confira o <strong>CST de ICMS</strong> no cadastro do produto. O cBenef não é o código interno do produto, o NCM ou o CEST.</p>
    </StepCard>
    <StepCard step={2} title="Conferir o código de benefício">
      <p>Consulte abaixo os códigos marcados como <strong>SIM</strong> para o CST na planilha. Compare a descrição legal com a situação do produto; códigos sem correspondência de CST na tabela não são apresentados como opções.</p>
    </StepCard>
    <section className="space-y-4" aria-label="Consulta de benefício por CST">
      <h3 className="text-xl font-semibold">Consultar código por CST</h3>
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <div className="space-y-2">
          <label id="cst-label" className="text-sm font-medium">CST do produto</label>
          <Select value={cst} onValueChange={setCst}><SelectTrigger aria-labelledby="cst-label"><SelectValue placeholder="Selecionar CST" /></SelectTrigger><SelectContent>{benefitTable.csts.map((value) => <SelectItem key={value} value={value}>CST {value}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="benefit-search" className="text-sm font-medium">Código ou descrição do benefício</label>
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="benefit-search" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="RJ801001, isenção, convênio…" /></div>
        </div>
      </div>
      {!cst ? <p className="text-muted-foreground">Nenhum CST selecionado.</p> : <>
        <p role="status" className="text-sm text-muted-foreground">{rows.length} correspondência(s) para CST {cst} na tabela de 2022.</p>
        {rows.length === 0 ? <InfoBox title="Sem correspondência">Nenhuma opção encontrada para este filtro. Isso não autoriza usar um código de outro CST; valide com o responsável fiscal.</InfoBox> :
          <div className="overflow-x-auto border border-border rounded-md">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-muted text-muted-foreground"><tr>{["Código cBenef", "Descrição / fundamento", "Início", "Fim", "Vigência na fonte"].map((h) => <th key={h} className="text-left p-3 font-medium">{h}</th>)}</tr></thead>
              <tbody>{rows.map((row) => <tr key={row.sourceRow} className="border-t border-border">
                <td className="p-3 align-top font-mono text-primary whitespace-nowrap">{row.code || "Não preencher"}</td>
                <td className="p-3 align-top"><p>{row.description}</p>{row.note && <p className="mt-1 text-muted-foreground">{row.note}</p>}</td>
                <td className="p-3 align-top whitespace-nowrap">{formatDate(row.start)}</td>
                <td className="p-3 align-top whitespace-nowrap">{formatDate(row.end)}</td>
                <td className="p-3 align-top text-muted-foreground">{benefitPeriod(row)}</td>
              </tr>)}</tbody>
            </table>
          </div>}
      </>}
    </section>
    <InfoBox title="“SEM cBenef” não é uma associação automática por CST">A planilha possui essa linha especial para item sem benefício quando a UF exige cBenef, mas não marca nenhum CST para ela. A observação da fonte exige letras maiúsculas. Confirme com o responsável fiscal e as regras atuais da UF antes de utilizar essa indicação.</InfoBox>
    <StepCard step={3} title="Ajustar o cadastro e validar o reenvio" important>
      <ol className="list-decimal pl-5 space-y-2"><li>Após a validação fiscal, informe no cadastro do produto o <strong>código de benefício fiscal (cBenef)</strong> correspondente, ou mantenha o campo sem preenchimento quando aplicável.</li><li>Salve a alteração e, se necessário, envie carga ao PDV para atualizar os dados do produto.</li><li>Siga o procedimento de correção/reenvio da nota rejeitada e confira a autorização no InvoiCy. Antes de reenviar, verifique se a nota já foi autorizada para evitar duplicidade.</li><li>Se continuar rejeitada, confira a mensagem retornada e encaminhe a situação ao responsável fiscal; não substitua o benefício por tentativa.</li></ol>
    </StepCard>
  </div>;
}