import { Suspense } from "react";
import { AlertTriangle, CheckCircle2, Circle, Clock, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Scorecard, ScorecardSkeleton } from "@/components/Scorecard";
import { StatusPieChart, ChartSkeleton } from "@/components/StatusPieChart";
import { DataTable, TableSkeleton } from "@/components/DataTable";
import { Badge, CLIENTE_BADGE, ESTEIRA_STATUS_BADGE, PRIORIDADE_BADGE } from "@/components/Badge";
import {
  getEsteiraItems,
  getEsteiraScorecards,
  getEsteiraStatusDistribution,
  getEsteiraTableRows,
} from "@/lib/esteira";
import type { EsteiraItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const ESTEIRA_COLOR_MAP: Record<string, string> = {
  "Não iniciado": "#8A8FA8",
  "Em andamento": "#6366F1",
  Aprovado: "#A855F7",
  Concluído: "#2EE6C8",
};

async function Scorecards() {
  const items = await getEsteiraItems();
  const counts = getEsteiraScorecards(items);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Scorecard label="Não iniciado" value={counts.naoIniciado} icon={Circle} accent="gray" />
      <Scorecard label="Em andamento" value={counts.emAndamento} icon={Clock} accent="blue" />
      <Scorecard label="Aprovado" value={counts.aprovado} icon={CheckCircle2} accent="purple" />
      <Scorecard label="Concluído" value={counts.concluido} icon={ListChecks} accent="green" />
      <Scorecard label="Em atraso" value={counts.emAtraso} icon={AlertTriangle} accent="red" />
    </div>
  );
}

async function Chart() {
  const items = await getEsteiraItems();
  const data = getEsteiraStatusDistribution(items);
  return <StatusPieChart data={data} colorMap={ESTEIRA_COLOR_MAP} />;
}

async function Table() {
  const items = await getEsteiraItems();
  const rows = getEsteiraTableRows(items);
  return (
    <DataTable<EsteiraItem>
      rows={rows}
      getRowId={(r) => r.id}
      emptyMessage="Nenhuma tarefa em aberto."
      columns={[
        { key: "responsavel", header: "Responsável", render: (r) => r.responsavel || "—" },
        { key: "nome", header: "Nome da esteira", render: (r) => r.nomeTarefa },
        {
          key: "cliente",
          header: "Cliente",
          render: (r) =>
            r.cliente ? <Badge label={r.cliente} colorClass={CLIENTE_BADGE[r.cliente]} /> : "—",
        },
        { key: "recorrencia", header: "Recorrência", render: (r) => r.recorrencia || "—" },
        {
          key: "escopo",
          header: "% do escopo concluído",
          render: (r) => `${r.percentualEscopoConcluido}%`,
        },
        {
          key: "agendado",
          header: "% da esteira agendada",
          render: (r) => `${r.percentualAgendado}%`,
        },
        { key: "retrabalho", header: "% retrabalho", render: (r) => `${r.retrabalho}%` },
        {
          key: "status",
          header: "Status",
          render: (r) => <Badge label={r.status} colorClass={ESTEIRA_STATUS_BADGE[r.status]} />,
        },
        { key: "atraso", header: "Dias de atraso", render: (r) => r.diasAtraso },
        {
          key: "prioridade",
          header: "Prioridade",
          render: (r) => <Badge label={r.prioridade} colorClass={PRIORIDADE_BADGE[r.prioridade]} />,
        },
      ]}
    />
  );
}

function ScorecardsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <ScorecardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function EsteiraPage() {
  return (
    <>
      <PageHeader
        title="Esteira de Conteúdo"
        description="Visão geral das tarefas em produção"
      />
      <div className="flex flex-col gap-8">
        <Suspense fallback={<ScorecardsSkeletonGrid />}>
          <Scorecards />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <Chart />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <Table />
        </Suspense>
      </div>
    </>
  );
}
