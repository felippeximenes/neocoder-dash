import { Suspense } from "react";
import { CheckCircle2, Clock, Hourglass, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Scorecard, ScorecardSkeleton } from "@/components/Scorecard";
import { StatusPieChart, ChartSkeleton } from "@/components/StatusPieChart";
import { WorkloadBarChart } from "@/components/WorkloadBarChart";
import { DataTable, TableSkeleton } from "@/components/DataTable";
import { Badge, CLIENTE_BADGE, DESIGN_STATUS_BADGE } from "@/components/Badge";
import {
  getDesignItems,
  getDesignScorecards,
  getDesignStatusDistribution,
  getDesignTableRows,
  getDesignWorkloadByResponsible,
} from "@/lib/design";
import type { DesignItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const DESIGN_COLOR_MAP: Record<string, string> = {
  "Em andamento": "#4F8EF7",
  Aprovado: "#34D399",
  "Aguardando aprovação": "#FBBF24",
  "Em Ajuste": "#F87171",
};

async function Scorecards() {
  const items = await getDesignItems();
  const counts = getDesignScorecards(items);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Scorecard label="Em andamento" value={counts.emAndamento} icon={Clock} accent="blue" />
      <Scorecard
        label="Aguardando aprovação"
        value={counts.aguardandoAprovacao}
        icon={Hourglass}
        accent="yellow"
      />
      <Scorecard label="Aprovado" value={counts.aprovado} icon={CheckCircle2} accent="green" />
      <Scorecard
        label="Alto retrabalho"
        value={counts.altoRetrabalho}
        icon={RefreshCw}
        accent="red"
      />
    </div>
  );
}

async function Charts() {
  const items = await getDesignItems();
  const distribution = getDesignStatusDistribution(items);
  const workload = getDesignWorkloadByResponsible(items);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <StatusPieChart data={distribution} colorMap={DESIGN_COLOR_MAP} />
      <WorkloadBarChart data={workload} />
    </div>
  );
}

async function Table() {
  const items = await getDesignItems();
  const rows = getDesignTableRows(items);
  return (
    <DataTable<DesignItem>
      rows={rows}
      getRowId={(r) => r.id}
      emptyMessage="Nenhum job em aberto."
      columns={[
        { key: "job", header: "Job", render: (r) => r.job },
        {
          key: "cliente",
          header: "Cliente",
          render: (r) => <Badge label={r.cliente} colorClass={CLIENTE_BADGE[r.cliente]} />,
        },
        { key: "responsavel", header: "Responsável", render: (r) => r.responsavelExterno || "—" },
        {
          key: "status",
          header: "Status",
          render: (r) => <Badge label={r.status} colorClass={DESIGN_STATUS_BADGE[r.status]} />,
        },
        { key: "conclusao", header: "% Conclusão", render: (r) => `${r.percentualConclusao}%` },
        { key: "alteracoes", header: "Alterações", render: (r) => r.alteracoes },
        { key: "complexidade", header: "Complexidade", render: (r) => r.complexidade },
        {
          key: "prazo",
          header: "Prazo",
          render: (r) => (r.prazo ? new Date(r.prazo).toLocaleDateString("pt-BR") : "—"),
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

function ChartsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  );
}

export default function DesignPage() {
  return (
    <>
      <PageHeader title="Design" description="Acompanhamento dos jobs de design" />
      <div className="flex flex-col gap-8">
        <Suspense fallback={<ScorecardsSkeletonGrid />}>
          <Scorecards />
        </Suspense>
        <Suspense fallback={<ChartsSkeletonGrid />}>
          <Charts />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <Table />
        </Suspense>
      </div>
    </>
  );
}
