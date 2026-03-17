
export const SidebarHeader = ({ title }: { title: string }) => {
  return (
    <div className="mb-1 flex items-center gap-2 px-2">
      <img src="/icon.svg" className="size-10 text-gray-500" alt="Gitlab MR Linker Options" />

      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
  );
};
