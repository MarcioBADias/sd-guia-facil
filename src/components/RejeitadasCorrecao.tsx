import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import clientesData from "@/data/rejeicaoClientes.json";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Cliente {
  cliente: string;
  cnpj: string;
  ocorrencias: number | string;
  tecnico: string;
  statusCadastro: string;
  statusRejeitadas: string;
  observacao: string;
}

const PLANILHA_URL =
  "https://docs.google.com/spreadsheets/d/1goU0joU-JkFbzdKAhmPYqoRnmVUrxDfeTQwbdDQop6E/edit?gid=1928872031#gid=1928872031";
const STORAGE_KEY = "rejeitadas-correcao-feito";

const clientes = clientesData as Cliente[];

const statusBadge = (status: string) => {
  const s = (status || "").trim().toLowerCase();
  if (s === "ok") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-medium">
        <CheckCircle2 className="h-3 w-3" /> OK
      </span>
    );
  }
  if (s === "em andamento") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
        <Clock className="h-3 w-3" /> Em andamento
      </span>
    );
  }
  if (!s) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium">
        <AlertCircle className="h-3 w-3" /> Pendente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/15 text-primary text-xs font-medium">
      {status}
    </span>
  );
};

const RejeitadasCorrecao = () => {
  const [tecnico, setTecnico] = useState<string>("__all__");
  const [busca, setBusca] = useState("");
  const [feitos, setFeitos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFeitos(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const setFeito = (cnpj: string, value: boolean) => {
    setFeitos((prev) => {
      const next = { ...prev, [cnpj]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const tecnicos = useMemo(
    () =>
      Array.from(new Set(clientes.map((c) => c.tecnico).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b, "pt-BR"),
      ),
    [],
  );

  const filtrados = useMemo(() => {
    return clientes.filter((c) => {
      if (tecnico !== "__all__" && c.tecnico !== tecnico) return false;
      if (busca.trim()) {
        const q = busca.toLowerCase();
        if (
          !c.cliente?.toLowerCase().includes(q) &&
          !c.cnpj?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [tecnico, busca]);

  const stats = useMemo(() => {
    const total = filtrados.length;
    const ok = filtrados.filter(
      (c) =>
        (c.statusCadastro || "").trim().toLowerCase() === "ok" &&
        (c.statusRejeitadas || "").trim().toLowerCase() === "ok",
    ).length;
    const feitosCount = filtrados.filter((c) => feitos[c.cnpj]).length;
    const pendentes = total - feitosCount;
    return { total, ok, feitosCount, pendentes };
  }, [filtrados, feitos]);

  return (
    <div className="space-y-6">
      <div className="py-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">🛠️ Correção de Rejeitadas</h1>
          <p className="text-muted-foreground">
            Acompanhe os clientes em correção por técnico. Marque como feito e
            atualize a planilha original no Google Drive.
          </p>
        </div>
        <Button asChild>
          <a href={PLANILHA_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Abrir planilha original
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
            <Users className="h-3.5 w-3.5" /> Clientes
          </div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
            <CheckCircle2 className="h-3.5 w-3.5" /> Concluídos (OK)
          </div>
          <div className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
            {stats.ok}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
            <CheckCircle2 className="h-3.5 w-3.5" /> Marcados feito
          </div>
          <div className="text-2xl font-bold mt-1 text-primary">
            {stats.feitosCount}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
            <AlertCircle className="h-3.5 w-3.5" /> Pendentes
          </div>
          <div className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
            {stats.pendentes}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="md:w-72">
          <Select value={tecnico} onValueChange={setTecnico}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por técnico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos os técnicos</SelectItem>
              {tecnicos.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por cliente ou CNPJ..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[28%]">Cliente</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-center">Ocorrências</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Cadastro produtos</TableHead>
                <TableHead>Envio rejeitadas</TableHead>
                <TableHead className="text-center">Feito</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum cliente encontrado para o filtro selecionado.
                  </TableCell>
                </TableRow>
              ) : (
                filtrados.map((c, idx) => {
                  const key = `${c.cnpj}-${idx}`;
                  const isFeito = !!feitos[c.cnpj];
                  return (
                    <TableRow
                      key={key}
                      className={isFeito ? "bg-green-500/5" : ""}
                    >
                      <TableCell className="font-medium">{c.cliente}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.cnpj}
                      </TableCell>
                      <TableCell className="text-center">{c.ocorrencias}</TableCell>
                      <TableCell>{c.tecnico || "—"}</TableCell>
                      <TableCell>{statusBadge(c.statusCadastro)}</TableCell>
                      <TableCell>{statusBadge(c.statusRejeitadas)}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={isFeito}
                          onCheckedChange={(v) => setFeito(c.cnpj, v)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        As marcações "Feito" são salvas localmente no seu navegador. Após
        concluir, atualize também a planilha original no Google Drive.
      </p>
    </div>
  );
};

export default RejeitadasCorrecao;
