type AdminPageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const AdminPageHeader = ({ title, description, children }: AdminPageHeaderProps) => (
  <header className="mb-4 pb-4 border-b border-black/10 sm:mb-6 sm:pb-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-sm sm:text-base font-bold tracking-[0.12em] uppercase text-black">
          {title}
        </h1>
        {description && (
          <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase text-black/45 mt-2 leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  </header>
);

export default AdminPageHeader;
