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

type Estado = "pendente" | "processo" | "feito";
type ColKey = "xml" | "cadastro" | "rejeitadas";
type RowState = { xml: Estado; cadastro: Estado; rejeitadas: Estado };

const PLANILHA_URL =
  "https://docs.google.com/spreadsheets/d/1goU0joU-JkFbzdKAhmPYqoRnmVUrxDfeTQwbdDQop6E/edit?gid=1928872031#gid=1928872031";
const STORAGE_KEY = "rejeitadas-correcao-estados-v2";

const clientes = clientesData as Cliente[];

const inferirEstado = (status: string): Estado => {
  const s = (status || "").trim().toLowerCase();
  if (s === "ok") return "feito";
  if (s === "em andamento" || s === "em processo") return "processo";
  return "pendente";
};

const proximoEstado = (e: Estado): Estado =>
  e === "pendente" ? "processo" : e === "processo" ? "feito" : "pendente";

const StatusChip = ({ estado }: { estado: Estado }) => {
  if (estado === "feito")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-medium">
        <CheckCircle2 className="h-3 w-3" /> Feito
      </span>
    );
  if (estado === "processo")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
        <Clock className="h-3 w-3" /> Em processo
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
      <AlertCircle className="h-3 w-3" /> Pendente
    </span>
  );
};

const RejeitadasCorrecao = () => {
  const [tecnico, setTecnico] = useState<string>("__all__");
  const [busca, setBusca] = useState("");
  const [estados, setEstados] = useState<Record<string, RowState>>({});

  // initialize from data + persisted overrides
  useEffect(() => {
    let saved: Record<string, RowState> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      /* noop */
    }
    const init: Record<string, RowState> = {};
    clientes.forEach((c) => {
      init[c.cnpj] = saved[c.cnpj] ?? {
        xml: "pendente",
        cadastro: inferirEstado(c.statusCadastro),
        rejeitadas: inferirEstado(c.statusRejeitadas),
      };
    });
    setEstados(init);
  }, []);

  const persist = (next: Record<string, RowState>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  const ciclar = (cnpj: string, col: ColKey) => {
    setEstados((prev) => {
      const atual = prev[cnpj] ?? { xml: "pendente", cadastro: "pendente", rejeitadas: "pendente" };
      const next = { ...prev, [cnpj]: { ...atual, [col]: proximoEstado(atual[col]) } };
      persist(next);
      return next;
    });
  };

  const toggleFeito = (cnpj: string, marcar: boolean) => {
    setEstados((prev) => {
      const atual = prev[cnpj] ?? { xml: "pendente", cadastro: "pendente", rejeitadas: "pendente" };
      const novo: RowState = marcar
        ? { xml: "feito", cadastro: "feito", rejeitadas: "feito" }
        : { xml: "pendente", cadastro: "pendente", rejeitadas: "pendente" };
      const next = { ...prev, [cnpj]: novo };
      persist(next);
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

  const isAllFeito = (st?: RowState) =>
    !!st && st.xml === "feito" && st.cadastro === "feito" && st.rejeitadas === "feito";

  const stats = useMemo(() => {
    const total = filtrados.length;
    const feitosCount = filtrados.filter((c) => isAllFeito(estados[c.cnpj])).length;
    const emProcesso = filtrados.filter((c) => {
      const s = estados[c.cnpj];
      return s && !isAllFeito(s) && (s.xml === "processo" || s.cadastro === "processo" || s.rejeitadas === "processo" || s.xml === "feito" || s.cadastro === "feito" || s.rejeitadas === "feito");
    }).length;
    const pendentes = total - feitosCount - emProcesso;
    return { total, feitosCount, emProcesso, pendentes };
  }, [filtrados, estados]);

  return (
    <div className="space-y-6">
      <div className="py-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">🛠️ Correção de Rejeitadas</h1>
          <p className="text-muted-foreground">
            Clique em cada status para alternar entre Pendente → Em processo → Feito.
            Quando os três estiverem feitos, o toggle "Feito" é ativado automaticamente.
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
            <CheckCircle2 className="h-3.5 w-3.5" /> Concluídos
          </div>
          <div className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
            {stats.feitosCount}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
            <Clock className="h-3.5 w-3.5" /> Em processo
          </div>
          <div className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
            {stats.emProcesso}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
            <AlertCircle className="h-3.5 w-3.5" /> Pendentes
          </div>
          <div className="text-2xl font-bold mt-1 text-muted-foreground">
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
                <TableHead className="w-[24%]">Cliente</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-center">Ocorrências</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>XML Baixado</TableHead>
                <TableHead>Cadastro produtos</TableHead>
                <TableHead>Envio rejeitadas</TableHead>
                <TableHead className="text-center">Feito</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum cliente encontrado para o filtro selecionado.
                  </TableCell>
                </TableRow>
              ) : (
                filtrados.map((c, idx) => {
                  const key = `${c.cnpj}-${idx}`;
                  const st = estados[c.cnpj] ?? {
                    xml: "pendente" as Estado,
                    cadastro: "pendente" as Estado,
                    rejeitadas: "pendente" as Estado,
                  };
                  const allFeito = isAllFeito(st);
                  return (
                    <TableRow key={key} className={allFeito ? "bg-green-500/5" : ""}>
                      <TableCell className="font-medium">{c.cliente}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.cnpj}
                      </TableCell>
                      <TableCell className="text-center">{c.ocorrencias}</TableCell>
                      <TableCell>{c.tecnico || "—"}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => ciclar(c.cnpj, "xml")}
                          className="hover:opacity-80 transition-opacity"
                          title="Clique para alternar"
                        >
                          <StatusChip estado={st.xml} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => ciclar(c.cnpj, "cadastro")}
                          className="hover:opacity-80 transition-opacity"
                          title="Clique para alternar"
                        >
                          <StatusChip estado={st.cadastro} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => ciclar(c.cnpj, "rejeitadas")}
                          className="hover:opacity-80 transition-opacity"
                          title="Clique para alternar"
                        >
                          <StatusChip estado={st.rejeitadas} />
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={allFeito}
                          onCheckedChange={(v) => toggleFeito(c.cnpj, v)}
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
        As marcações são salvas localmente no seu navegador. Após concluir,
        atualize também a planilha original no Google Drive.
      </p>
    </div>
  );
};

export default RejeitadasCorrecao;
