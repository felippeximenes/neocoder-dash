import { Suspense } from "react";
import { AlertTriangle, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Scorecard, ScorecardSkeleton } from "@/components/Scorecard";
import { StatusPieChart, ChartSkeleton } from "@/components/StatusPieChart";
import { DataTable, TableSkeleton } from "@/components/DataTable";
import { Badge, ESTEIRA_STATUS_BADGE, PRIORIDADE_BADGE } from "@/components/Badge";
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
  "Em andamento": "#4F8EF7",
  Aprovado: "#A78BFA",
  Concluído: "#34D399",
};

async function Scorecards() {
  const items = await getEsteiraItems();
  const counts = getEsteiraScorecards(items);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        { key: "nome", header: "Nome da tarefa", render: (r) => r.nomeTarefa },
        { key: "responsavel", header: "Responsável", render: (r) => r.responsavel || "—" },
        {
          key: "status",
          header: "Status",
          render: (r) => <Badge label={r.status} colorClass={ESTEIRA_STATUS_BADGE[r.status]} />,
        },
        { key: "percentual", header: "% Concluído", render: (r) => `${r.percentualConcluido}%` },
        { key: "retrabalho", header: "Retrabalho (%)", render: (r) => `${r.retrabalho}%` },
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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
