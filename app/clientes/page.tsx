import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Scorecard, ScorecardSkeleton } from "@/components/Scorecard";
import { DataTable, TableSkeleton } from "@/components/DataTable";
import { Badge, CLIENTE_BADGE, RISCO_BADGE, SITUACAO_BADGE } from "@/components/Badge";
import { ListChecks, Percent, AlertTriangle, Clock } from "lucide-react";
import {
  getDesignClienteSummary,
  getDesignItems,
  getDesignItemsByCliente,
  getDesignTableRows,
  getSituacaoPrazo,
} from "@/lib/design";
import type { DesignCliente, DesignItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const CLIENTES_ORDENADOS: DesignCliente[] = ["LIBERPAY", "NEOCODER", "KOTAI"];

async function ClienteSection({ cliente, items }: { cliente: DesignCliente; items: DesignItem[] }) {
  const summary = getDesignClienteSummary(items);
  const rows = getDesignTableRows(items);

  return (
    <div className="flex flex-col gap-4">
      <Badge label={cliente} colorClass={CLIENTE_BADGE[cliente]} className="self-start" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Scorecard label="Jobs em andamento" value={summary.ativos} icon={ListChecks} accent="blue" />
        <Scorecard
          label="% conclusão média"
          value={summary.concluidoMedio}
          icon={Percent}
          accent="purple"
        />
        <Scorecard label="Em atraso" value={summary.emAtraso} icon={Clock} accent="red" />
        <Scorecard
          label="Risco alto"
          value={summary.riscoAlto}
          icon={AlertTriangle}
          accent="yellow"
        />
      </div>
      <DataTable<DesignItem>
        rows={rows}
        getRowId={(r) => r.id}
        emptyMessage="Nenhum job em aberto para este cliente."
        columns={[
          { key: "job", header: "Tarefa", render: (r) => r.job },
          { key: "conclusao", header: "% de conclusão", render: (r) => `${r.percentualConclusao}%` },
          {
            key: "risco",
            header: "Risco",
            render: (r) =>
              r.risco ? <Badge label={r.risco} colorClass={RISCO_BADGE[r.risco]} /> : "—",
          },
          {
            key: "situacao",
            header: "Situação",
            render: (r) => {
              const situacao = getSituacaoPrazo(r);
              return situacao === "—" ? (
                "—"
              ) : (
                <Badge label={situacao} colorClass={SITUACAO_BADGE[situacao]} />
              );
            },
          },
          {
            key: "prazo",
            header: "Próxima entrega",
            render: (r) => (r.prazo ? new Date(r.prazo).toLocaleDateString("pt-BR") : "—"),
          },
        ]}
      />
    </div>
  );
}

async function Content() {
  const items = await getDesignItems();
  const grouped = getDesignItemsByCliente(items);
  return (
    <div className="flex flex-col gap-10">
      {CLIENTES_ORDENADOS.map((cliente) => (
        <ClienteSection key={cliente} cliente={cliente} items={grouped.get(cliente) ?? []} />
      ))}
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ScorecardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}

export default function ClientesPage() {
  return (
    <>
      <PageHeader
        title="Projeto por Cliente"
        description="Jobs de design agrupados por cliente, com risco e prazo"
      />
      <Suspense fallback={<ContentSkeleton />}>
        <Content />
      </Suspense>
    </>
  );
}
