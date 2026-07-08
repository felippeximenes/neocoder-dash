import { Suspense } from "react";
import { Calendar, CircleDashed, Clock, Eye } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Scorecard, ScorecardSkeleton } from "@/components/Scorecard";
import { StatusPieChart, ChartSkeleton } from "@/components/StatusPieChart";
import { BarRows } from "@/components/WorkloadBarChart";
import { Card } from "@/components/Card";
import { DataTable, TableSkeleton } from "@/components/DataTable";
import { Badge, PlatformBadge, SMM_STATUS_BADGE } from "@/components/Badge";
import {
  getSmmItems,
  getSmmPlatformVolume,
  getSmmProximosVencimentos,
  getSmmScorecards,
  getSmmStatusDistribution,
  getSmmTableRows,
} from "@/lib/smm";
import type { SmmItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const SMM_COLOR_MAP: Record<string, string> = {
  "Não iniciada": "#8A8FA8",
  "Em andamento": "#6366F1",
  "Em revisão": "#A855F7",
  "Em agendamento": "#FBBF24",
  "Em standby": "#8A8FA8",
};

async function Scorecards() {
  const items = await getSmmItems();
  const counts = getSmmScorecards(items);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Scorecard label="Em andamento" value={counts.emAndamento} icon={Clock} accent="blue" />
      <Scorecard
        label="Não iniciada"
        value={counts.naoIniciada}
        icon={CircleDashed}
        accent="gray"
      />
      <Scorecard
        label="Em agendamento"
        value={counts.emAgendamento}
        icon={Calendar}
        accent="yellow"
      />
      <Scorecard label="Em revisão" value={counts.emRevisao} icon={Eye} accent="purple" />
    </div>
  );
}

async function Charts() {
  const items = await getSmmItems();
  const distribution = getSmmStatusDistribution(items).filter((d) => d.name !== "Concluído");
  const volume = getSmmPlatformVolume(items);
  const proximos = getSmmProximosVencimentos(items);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <StatusPieChart data={distribution} colorMap={SMM_COLOR_MAP} centerLabel="POSTS" />
      <Card className="flex flex-col gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Volume por plataforma
          </span>
          <div className="mt-4">
            <BarRows data={volume} />
          </div>
        </div>
        {proximos.length > 0 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Próximos vencimentos
            </span>
            <div className="mt-3 flex flex-col gap-2.5">
              {proximos.map((p) => (
                <div key={p.nome} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-text-secondary">{p.nome}</span>
                  <span className="font-display flex-none font-semibold text-text-primary">
                    {p.data ? new Date(p.data).toLocaleDateString("pt-BR") : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

async function Table() {
  const items = await getSmmItems();
  const rows = getSmmTableRows(items);
  return (
    <DataTable<SmmItem>
      rows={rows}
      getRowId={(r) => r.id}
      emptyMessage="Nenhum conteúdo agendado."
      columns={[
        { key: "name", header: "Name", render: (r) => r.name },
        { key: "assign", header: "Assign", render: (r) => r.assign || "—" },
        {
          key: "plataforma",
          header: "Plataforma",
          render: (r) => <PlatformBadge platform={r.plataforma} />,
        },
        {
          key: "status",
          header: "Status 1",
          render: (r) => <Badge label={r.status} colorClass={SMM_STATUS_BADGE[r.status]} />,
        },
        {
          key: "start",
          header: "Start Data",
          render: (r) => (r.startData ? new Date(r.startData).toLocaleDateString("pt-BR") : "—"),
        },
        {
          key: "final",
          header: "Final Data",
          render: (r) => (r.finalData ? new Date(r.finalData).toLocaleDateString("pt-BR") : "—"),
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

export default function SmmPage() {
  return (
    <>
      <PageHeader title="SMM Social Media" description="Calendário de conteúdo das redes sociais" />
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
