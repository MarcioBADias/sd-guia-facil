import { useState, useRef } from "react";
import { Upload, Search, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";

interface DivergenceRow {
  numero: string;
  pdv: string;
  dia: string;
  valor: string;
  tipo: "sem_saida" | "sem_cupom";
}

const DivergenceChecker = () => {
  const [saidasFile, setSaidasFile] = useState<File | null>(null);
  const [cuponsFile, setCuponsFile] = useState<File | null>(null);
  const [results, setResults] = useState<DivergenceRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"sem_saida" | "sem_cupom">("sem_saida");
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

  const runComparison = async (searchMode: "sem_saida" | "sem_cupom") => {
    if (!saidasFile || !cuponsFile) return;
    setLoading(true);
    setError(null);
    setMode(searchMode);

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

      const sHeaders = Object.keys(saidasRows[0]);
      const cHeaders = Object.keys(cuponsRows[0]);

      const sNumCol = findCol(sHeaders, ["número", "numero", "nº", "num", "doc", "documento", "saída", "saida", "cupom"]);
      const cNumCol = findCol(cHeaders, ["cupom", "número", "numero", "nº", "num", "doc", "documento"]);
      const sPdvCol = findCol(sHeaders, ["pdv", "caixa", "terminal"]);
      const cPdvCol = findCol(cHeaders, ["pdv", "caixa", "terminal"]);
      const sDiaCol = findCol(sHeaders, ["data", "dia", "date", "emissão", "emissao"]);
      const cDiaCol = findCol(cHeaders, ["data", "dia", "date", "emissão", "emissao"]);
      const sValCol = findCol(sHeaders, ["valor", "total", "vlr", "value"]);
      const cValCol = findCol(cHeaders, ["valor", "total", "vlr", "value"]);

      if (!sNumCol || !cNumCol) {
        setError(
          `Não foi possível encontrar coluna de número/cupom. Saídas: [${sHeaders.join(", ")}] | Cupons: [${cHeaders.join(", ")}]`
        );
        setLoading(false);
        return;
      }

      if (searchMode === "sem_saida") {
        // Cupons que não têm saída correspondente
        const saidasSet = new Set(saidasRows.map((r) => String(r[sNumCol]).trim()));
        const missing = cuponsRows
          .filter((r) => !saidasSet.has(String(r[cNumCol]).trim()))
          .map((r) => ({
            numero: String(r[cNumCol]),
            pdv: cPdvCol ? String(r[cPdvCol]) : "-",
            dia: cDiaCol ? String(r[cDiaCol]) : "-",
            valor: cValCol ? String(r[cValCol]) : "-",
            tipo: "sem_saida" as const,
          }));
        setResults(missing);
      } else {
        // Saídas que não têm cupom correspondente
        const cuponsSet = new Set(cuponsRows.map((r) => String(r[cNumCol]).trim()));
        const missing = saidasRows
          .filter((r) => !cuponsSet.has(String(r[sNumCol]).trim()))
          .map((r) => ({
            numero: String(r[sNumCol]),
            pdv: sPdvCol ? String(r[sPdvCol]) : "-",
            dia: sDiaCol ? String(r[sDiaCol]) : "-",
            valor: sValCol ? String(r[sValCol]) : "-",
            tipo: "sem_cupom" as const,
          }));
        setResults(missing);
      }
    } catch {
      setError("Erro ao processar os arquivos.");
    }
    setLoading(false);
  };

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

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={() => runComparison("sem_saida")}
          disabled={!saidasFile || !cuponsFile || loading}
          variant="default"
        >
          <Search className="w-4 h-4 mr-2" />
          {loading && mode === "sem_saida" ? "Analisando..." : "Encontrar Cupons sem Saída"}
        </Button>
        <Button
          onClick={() => runComparison("sem_cupom")}
          disabled={!saidasFile || !cuponsFile || loading}
          variant="secondary"
        >
          <Search className="w-4 h-4 mr-2" />
          {loading && mode === "sem_cupom" ? "Analisando..." : "Encontrar Saídas sem Cupom"}
        </Button>
      </div>

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
              ✅ Nenhuma divergência encontrada! Todos os registros possuem correspondência.
            </div>
          ) : (
            <>
              <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-700 dark:text-yellow-400">
                ⚠️ Encontrados <strong>{results.length}</strong>{" "}
                {mode === "sem_saida" ? "cupons sem saída correspondente" : "saídas sem cupom correspondente"}
              </div>
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        {mode === "sem_saida" ? "Cupom" : "Saída"}
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">PDV</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Dia</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-t border-border hover:bg-muted/50">
                        <td className="px-4 py-2 font-mono text-primary">{row.numero}</td>
                        <td className="px-4 py-2 text-foreground">{row.pdv}</td>
                        <td className="px-4 py-2 text-foreground">{row.dia}</td>
                        <td className="px-4 py-2 text-foreground">{row.valor}</td>
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
