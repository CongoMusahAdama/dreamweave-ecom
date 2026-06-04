type AdminPanelProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

const AdminPanel = ({ title, children, action }: AdminPanelProps) => (
  <section className="border border-black/10 bg-white">
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-black/10 sm:px-5">
      <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-black">{title}</h2>
      {action}
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </section>
);

export default AdminPanel;
