import { useState, useRef } from "react";
import { Upload, Search, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";

type DiferençaTipo = "cupom_sem_saida" | "saida_sem_cupom" | "valor_diferente" | "cupom_sem_valor" | "saida_sem_valor";

interface DiffRow {
  numero: string;
  pdv: string;
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

  // normalize string by removing diacritics, stripping non-alphanumerics, and lowercasing
  const normalize = (s: string) => {
    let str = s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9 ]/gi, "")
      .toLowerCase();
    // cleanup common encoding corruption patterns
    str = str.replace(/[\u00c2\u00e2\u00c3\u00e3\u00c7\u00e7\u00d1\u00f1]+/g, "");
    str = str.replace(/\s+/g, " ").trim();
    return str;
  };

// simple Levenshtein distance (we only need small inputs, so performance isn't critical)
const lev = (a: string, b: string) => {
  const dp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
};

// attempt to match each keyword (splitting on spaces) against a normalized header
// if no direct hit, fall back to small-distance fuzzy match (<=1)
const findCol = (headers: string[], keywords: string[]) => {
  for (const h of headers) {
    const nh = normalize(h);
    if (keywords.some((k) => {
      const nk = normalize(k);
      return nk.split(" ").every((w) => nh.includes(w));
    })) {
      return h;
    }
  }

  // fallback: approximate match
  for (const h of headers) {
    const nh = normalize(h).replace(/\s+/g, "");
    for (const k of keywords) {
      const nk = normalize(k).replace(/\s+/g, "");
      if (lev(nh, nk) <= 1) {
        return h;
      }
    }
  }

  return undefined;
};

  const parseValor = (v: any): number | null => {
    if (v === "" || v === null || v === undefined || v === "-") return null;
    const original = String(v).replace(/[R$\s]/g, "");
    const s = original.replace(",", ".");
    let n = parseFloat(s);
    if (isNaN(n)) return null;
    // if original string has no decimal separator and is a positive integer
    if (!original.includes(".") && !original.includes(",") && Number.isInteger(n) && n > 0) {
      // 3-digit values: divide by 10 (décimos de real)
      if (original.length === 3) {
        n = n / 10;
      } else if (original.length >= 4) {
        // 4+ digit values: divide by 100 (centavos)
        n = n / 100;
      }
    }
    return n;
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

      const sNumCol = findCol(sH, ["numero", "num", "cupom"]);
      const cNumCol = findCol(cH, ["cupom", "numero", "num"]);
      const sPdvCol = findCol(sH, ["pdv", "caixa", "terminal"]);
      const cPdvCol = findCol(cH, ["pdv", "caixa", "terminal"]);
      // valor columns (normal and "valor venda" are both checked)
      const sValCol = findCol(sH, ["valor", "valor venda", "total", "vlr", "value"]);
      const cValCol = findCol(cH, ["valor", "valor venda", "total", "vlr", "value"]);

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
              valorCupom: "-",
              valorSaida: formatValor(sVal),
              tipo: "cupom_sem_valor",
            });
          } else if (sValNum === null && cValNum !== null) {
            diffs.push({
              numero: num,
              pdv: cPdvCol ? String(cr[cPdvCol]) : "-",
              valorCupom: formatValor(cVal),
              valorSaida: "-",
              tipo: "saida_sem_valor",
            });
          } else if (cValNum !== null && sValNum !== null && Math.abs(cValNum - sValNum) > 0.01) {
            diffs.push({
              numero: num,
              pdv: cPdvCol ? String(cr[cPdvCol]) : "-",
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
