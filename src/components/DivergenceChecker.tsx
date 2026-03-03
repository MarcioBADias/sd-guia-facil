import { useState, useRef } from "react";
import { Upload, Search, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";

type DiferençaTipo = "cupom_sem_saida" | "saida_sem_cupom" | "valor_diferente" | "cupom_sem_valor" | "saida_sem_valor";

interface DiffRow {
  numero: string;
  pdv: string;
  dia: string;
  valorCupom: string;
  valorSaida: string;
  tipo: DiferençaTipo;
}

const tipoLabels: Record<DiferençaTipo, string> = {
  cupom_sem_saida: "Cupom sem Saída",
  saida_sem_cupom: "Saída sem Cupom",
  valor_diferente: "Valor Diferente",
  cupom_sem_valor: "Cupom sem Valor",
  saida_sem_valor: "Saída sem Valor",
};

const tipoBadgeColors: Record<DiferençaTipo, string> = {
  cupom_sem_saida: "bg-destructive/15 text-destructive border-destructive/30",
  saida_sem_cupom: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  valor_diferente: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
  cupom_sem_valor: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  saida_sem_valor: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
};

const DivergenceChecker = () => {
  const [saidasFile, setSaidasFile] = useState<File | null>(null);
  const [cuponsFile, setCuponsFile] = useState<File | null>(null);
  const [results, setResults] = useState<DiffRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saidasRef = useRef<HTMLInputElement>(null);
  const cuponsRef = useRef<HTMLInputElement>(null);

  const parseFile = (file: File): Promise<any[]> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: "array" });
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
          resolve(rows as any[]);
        } catch {
          reject(new Error("Erro ao ler arquivo"));
        }
      };
      reader.readAsArrayBuffer(file);
    });

  const findCol = (headers: string[], keywords: string[]) =>
    headers.find((h) => keywords.some((k) => h.toLowerCase().includes(k.toLowerCase())));

  const parseValor = (v: any): number | null => {
    if (v === "" || v === null || v === undefined || v === "-") return null;
    const s = String(v).replace(/[R$\s]/g, "").replace(",", ".");
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  };

  const formatValor = (v: any): string => {
    const n = parseValor(v);
    if (n === null) return String(v || "-");
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const runDiff = async () => {
    if (!saidasFile || !cuponsFile) return;
    setLoading(true);
    setError(null);

    try {
      const [saidasRows, cuponsRows] = await Promise.all([
        parseFile(saidasFile),
        parseFile(cuponsFile),
      ]);

      if (saidasRows.length === 0 || cuponsRows.length === 0) {
        setError("Uma das planilhas está vazia.");
        setLoading(false);
        return;
      }

      const sH = Object.keys(saidasRows[0]);
      const cH = Object.keys(cuponsRows[0]);

      const sNumCol = findCol(sH, ["número", "numero", "nº", "num", "doc", "documento", "saída", "saida", "cupom"]);
      const cNumCol = findCol(cH, ["cupom", "número", "numero", "nº", "num", "doc", "documento"]);
      const sPdvCol = findCol(sH, ["pdv", "caixa", "terminal"]);
      const cPdvCol = findCol(cH, ["pdv", "caixa", "terminal"]);
      const sDiaCol = findCol(sH, ["data", "dia", "date", "emissão", "emissao"]);
      const cDiaCol = findCol(cH, ["data", "dia", "date", "emissão", "emissao"]);
      const sValCol = findCol(sH, ["valor", "total", "vlr", "value"]);
      const cValCol = findCol(cH, ["valor", "total", "vlr", "value"]);

      if (!sNumCol || !cNumCol) {
        setError(
          `Não foi possível encontrar coluna de número/cupom. Saídas: [${sH.join(", ")}] | Cupons: [${cH.join(", ")}]`
        );
        setLoading(false);
        return;
      }

      // Build maps by numero
      const saidasMap = new Map<string, any>();
      for (const r of saidasRows) {
        const key = String(r[sNumCol]).trim();
        if (key) saidasMap.set(key, r);
      }

      const cuponsMap = new Map<string, any>();
      for (const r of cuponsRows) {
        const key = String(r[cNumCol]).trim();
        if (key) cuponsMap.set(key, r);
      }

      const diffs: DiffRow[] = [];

      // Check each cupom against saídas
      for (const [num, cr] of cuponsMap) {
        const sr = saidasMap.get(num);
        const cVal = cValCol ? cr[cValCol] : undefined;
        const cValNum = parseValor(cVal);

        if (!sr) {
          diffs.push({
            numero: num,
            pdv: cPdvCol ? String(cr[cPdvCol]) : "-",
            dia: cDiaCol ? String(cr[cDiaCol]) : "-",
            valorCupom: formatValor(cVal),
            valorSaida: "-",
            tipo: "cupom_sem_saida",
          });
        } else {
          const sVal = sValCol ? sr[sValCol] : undefined;
          const sValNum = parseValor(sVal);

          if (cValNum === null && sValNum !== null) {
            diffs.push({
              numero: num,
              pdv: cPdvCol ? String(cr[cPdvCol]) : "-",
              dia: cDiaCol ? String(cr[cDiaCol]) : "-",
              valorCupom: "-",
              valorSaida: formatValor(sVal),
              tipo: "cupom_sem_valor",
            });
          } else if (sValNum === null && cValNum !== null) {
            diffs.push({
              numero: num,
              pdv: cPdvCol ? String(cr[cPdvCol]) : "-",
              dia: cDiaCol ? String(cr[cDiaCol]) : "-",
              valorCupom: formatValor(cVal),
              valorSaida: "-",
              tipo: "saida_sem_valor",
            });
          } else if (cValNum !== null && sValNum !== null && Math.abs(cValNum - sValNum) > 0.01) {
            diffs.push({
              numero: num,
              pdv: cPdvCol ? String(cr[cPdvCol]) : "-",
              dia: cDiaCol ? String(cr[cDiaCol]) : "-",
              valorCupom: formatValor(cVal),
              valorSaida: formatValor(sVal),
              tipo: "valor_diferente",
            });
          }
        }
      }

      // Saídas sem cupom
      for (const [num, sr] of saidasMap) {
        if (!cuponsMap.has(num)) {
          const sVal = sValCol ? sr[sValCol] : undefined;
          diffs.push({
            numero: num,
            pdv: sPdvCol ? String(sr[sPdvCol]) : "-",
            dia: sDiaCol ? String(sr[sDiaCol]) : "-",
            valorCupom: "-",
            valorSaida: formatValor(sVal),
            tipo: "saida_sem_cupom",
          });
        }
      }

      setResults(diffs);
    } catch {
      setError("Erro ao processar os arquivos.");
    }
    setLoading(false);
  };

  const countByType = (tipo: DiferençaTipo) => results?.filter((r) => r.tipo === tipo).length || 0;

  return (
    <div className="space-y-4 mt-6 p-5 rounded-lg border border-border bg-muted/20">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
        <FileSpreadsheet className="w-5 h-5 text-primary" />
        Verificador de Divergências (Saídas × Cupons)
      </h3>

      <div className="grid sm:grid-cols-2 gap-3">
        <div
          className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => saidasRef.current?.click()}
        >
          <input ref={saidasRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { setSaidasFile(e.target.files?.[0] || null); setResults(null); }} />
          <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Planilha de Saídas</p>
          <p className="text-xs text-muted-foreground">{saidasFile ? saidasFile.name : "Clique para selecionar"}</p>
        </div>

        <div
          className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => cuponsRef.current?.click()}
        >
          <input ref={cuponsRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { setCuponsFile(e.target.files?.[0] || null); setResults(null); }} />
          <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Planilha de Cupons</p>
          <p className="text-xs text-muted-foreground">{cuponsFile ? cuponsFile.name : "Clique para selecionar"}</p>
        </div>
      </div>

      <Button
        onClick={runDiff}
        disabled={!saidasFile || !cuponsFile || loading}
        variant="default"
        className="w-full sm:w-auto"
      >
        <Search className="w-4 h-4 mr-2" />
        {loading ? "Analisando..." : "Achar Diferença"}
      </Button>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {results !== null && (
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="p-4 rounded-md bg-green-500/10 border border-green-500/30 text-sm text-green-700 dark:text-green-400">
              ✅ Nenhuma divergência encontrada! As planilhas estão iguais.
            </div>
          ) : (
            <>
              {/* Resumo */}
              <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <p className="font-semibold">⚠️ Encontradas {results.length} diferença(s):</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(["cupom_sem_saida", "saida_sem_cupom", "valor_diferente", "cupom_sem_valor", "saida_sem_valor"] as DiferençaTipo[]).map((t) => {
                    const c = countByType(t);
                    if (c === 0) return null;
                    return (
                      <span key={t} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${tipoBadgeColors[t]}`}>
                        {tipoLabels[t]}: {c}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Cupom/Saída</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">PDV</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Dia</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Valor Cupom</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Valor Saída</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-t border-border hover:bg-muted/50">
                        <td className="px-4 py-2 font-mono text-primary">{row.numero}</td>
                        <td className="px-4 py-2 text-foreground">{row.pdv}</td>
                        <td className="px-4 py-2 text-foreground">{row.dia}</td>
                        <td className="px-4 py-2 text-foreground">{row.valorCupom}</td>
                        <td className="px-4 py-2 text-foreground">{row.valorSaida}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${tipoBadgeColors[row.tipo]}`}>
                            {tipoLabels[row.tipo]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DivergenceChecker;
