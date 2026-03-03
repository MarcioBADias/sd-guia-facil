import { useState, useRef } from "react";
import { Upload, Search, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";

interface DuplicateRow {
  pdv: string;
  dia: string;
  cupom: string;
  valor: string;
}

const DuplicateChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setDuplicates(null);
      setError(null);
    }
  };

  const findDuplicates = () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (rows.length === 0) {
          setError("A planilha está vazia.");
          setLoading(false);
          return;
        }

        // Find columns by common names (case-insensitive)
        const headers = Object.keys(rows[0]);
        const findCol = (keywords: string[]) =>
          headers.find((h) =>
            keywords.some((k) => h.toLowerCase().includes(k.toLowerCase()))
          );

        const cupomCol = findCol(["cupom", "número", "numero", "nº", "num", "doc", "documento"]);
        const pdvCol = findCol(["pdv", "caixa", "terminal"]);
        const diaCol = findCol(["data", "dia", "date", "emissão", "emissao"]);
        const valorCol = findCol(["valor", "total", "vlr", "value"]);

        if (!cupomCol) {
          setError(
            `Não foi possível encontrar a coluna de cupom/número. Colunas encontradas: ${headers.join(", ")}`
          );
          setLoading(false);
          return;
        }

        // Count occurrences of each cupom number
        const cupomCount = new Map<string, number>();
        rows.forEach((row) => {
          const val = String(row[cupomCol]).trim();
          if (val) cupomCount.set(val, (cupomCount.get(val) || 0) + 1);
        });

        // Filter duplicates
        const duplicateRows: DuplicateRow[] = rows
          .filter((row) => {
            const val = String(row[cupomCol]).trim();
            return cupomCount.get(val)! > 1;
          })
          .map((row) => ({
            pdv: pdvCol ? String(row[pdvCol]) : "-",
            dia: diaCol ? String(row[diaCol]) : "-",
            cupom: String(row[cupomCol]),
            valor: valorCol ? String(row[valorCol]) : "-",
          }));

        setDuplicates(duplicateRows);
      } catch {
        setError("Erro ao processar o arquivo. Verifique se é um Excel válido.");
      }
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-4 mt-6 p-5 rounded-lg border border-border bg-muted/20">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
        <FileSpreadsheet className="w-5 h-5 text-primary" />
        Verificador de Cupons Duplicados
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {file ? file.name : "Clique para selecionar o Excel de cupons"}
          </p>
        </div>

        <Button
          onClick={findDuplicates}
          disabled={!file || loading}
          className="sm:self-center"
        >
          <Search className="w-4 h-4 mr-2" />
          {loading ? "Analisando..." : "Verificar Duplicadas"}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {duplicates !== null && (
        <div className="space-y-3">
          {duplicates.length === 0 ? (
            <div className="p-4 rounded-md bg-green-500/10 border border-green-500/30 text-sm text-green-700 dark:text-green-400">
              ✅ Nenhum cupom duplicado encontrado!
            </div>
          ) : (
            <>
              <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-700 dark:text-yellow-400">
                ⚠️ Encontrados <strong>{duplicates.length}</strong> registros duplicados
              </div>
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Nº PDV</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Dia</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Cupom</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicates.map((row, i) => (
                      <tr key={i} className="border-t border-border hover:bg-muted/50">
                        <td className="px-4 py-2 text-foreground">{row.pdv}</td>
                        <td className="px-4 py-2 text-foreground">{row.dia}</td>
                        <td className="px-4 py-2 font-mono text-primary">{row.cupom}</td>
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

export default DuplicateChecker;
