import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Scorecard, ScorecardSkeleton } from "@/components/Scorecard";
import { DataTable, TableSkeleton } from "@/components/DataTable";
import {
  Badge,
  CLIENTE_BADGE,
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

const CLIENTES_ORDENADOS: Cliente[] = ["LIBERPAY", "NEOCODER", "KOTAI"];

async function ClienteSection({ cliente, items }: { cliente: Cliente; items: ProjetoTask[] }) {
  const summary = getProjetoClienteSummary(items);
  const rows = getProjetoTableRows(items);

  return (
    <div className="flex flex-col gap-4">
      <Badge label={cliente} colorClass={CLIENTE_BADGE[cliente]} className="self-start" />
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

async function Content() {
  const items = await getProjetoTasks();
  const grouped = getProjetoItemsByCliente(items);
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
        description="Tarefas dos boards de Project Management de cada cliente no Notion"
      />
      <Suspense fallback={<ContentSkeleton />}>
        <Content />
      </Suspense>
    </>
  );
}
