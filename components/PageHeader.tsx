interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-2xl font-bold text-text-primary">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
    </div>
  );
}
