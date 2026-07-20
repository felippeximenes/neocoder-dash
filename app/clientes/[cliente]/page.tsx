import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Scorecard, ScorecardSkeleton } from "@/components/Scorecard";
import { DataTable, TableSkeleton } from "@/components/DataTable";
import {
  Badge,
  PROJETO_PRIORIDADE_BADGE,
  PROJETO_STATUS_BADGE,
  SITUACAO_BADGE,
} from "@/components/Badge";
import { ListChecks, AlertTriangle, Ban } from "lucide-react";
import {
  getProjetoClienteSummary,
  getProjetoItemsByCliente,
  getProjetoTableRows,
  getProjetoTasks,
  getSituacaoAtraso,
} from "@/lib/projetos";
import type { Cliente, ProjetoTask } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const CLIENTE_SLUGS: Record<string, Cliente> = {
  kotai: "KOTAI",
  neocoder: "NEOCODER",
  liberpay: "LIBERPAY",
};

async function Content({ cliente }: { cliente: Cliente }) {
  const items = await getProjetoTasks();
  const grouped = getProjetoItemsByCliente(items);
  const clienteItems = grouped.get(cliente) ?? [];
  const summary = getProjetoClienteSummary(clienteItems);
  const rows = getProjetoTableRows(clienteItems);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Scorecard label="Tarefas em aberto" value={summary.ativos} icon={ListChecks} accent="blue" />
        <Scorecard label="Em atraso" value={summary.emAtraso} icon={AlertTriangle} accent="red" />
        <Scorecard label="Bloqueadas" value={summary.bloqueados} icon={Ban} accent="yellow" />
      </div>
      <DataTable<ProjetoTask>
        rows={rows}
        getRowId={(r) => r.id}
        emptyMessage="Nenhuma tarefa em aberto para este cliente."
        columns={[
          { key: "item", header: "Tarefa", render: (r) => r.item },
          { key: "area", header: "Área", render: (r) => r.area || "—" },
          { key: "responsavel", header: "Responsável", render: (r) => r.responsavel || "—" },
          {
            key: "prioridade",
            header: "Prioridade",
            render: (r) =>
              r.prioridade ? (
                <Badge label={r.prioridade} colorClass={PROJETO_PRIORIDADE_BADGE[r.prioridade]} />
              ) : (
                "—"
              ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <Badge label={r.status} colorClass={PROJETO_STATUS_BADGE[r.status]} />,
          },
          {
            key: "situacao",
            header: "Situação",
            render: (r) => {
              const situacao = getSituacaoAtraso(r);
              return situacao === "—" ? (
                "—"
              ) : (
                <Badge label={situacao} colorClass={SITUACAO_BADGE[situacao]} />
              );
            },
          },
          {
            key: "deadline",
            header: "Prazo",
            render: (r) => (r.deadline ? new Date(r.deadline).toLocaleDateString("pt-BR") : "—"),
          },
        ]}
      />
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ScorecardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}

export default function ClienteProjetoPage({ params }: { params: { cliente: string } }) {
  const cliente = CLIENTE_SLUGS[params.cliente];
  if (!cliente) notFound();

  return (
    <>
      <PageHeader
        title={`Projeto — ${cliente}`}
        description="Tarefas do board de Project Management deste cliente no Notion"
      />
      <Suspense fallback={<ContentSkeleton />}>
        <Content cliente={cliente} />
      </Suspense>
    </>
  );
}
