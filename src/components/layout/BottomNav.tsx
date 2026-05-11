import { BottomNavProps } from "@/types/props";

export function BottomNav({ items, activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95">
      <div className="mx-auto grid max-w-md text-sm" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => (
          <button key={item.id} className={`flex flex-col items-center justify-center gap-1 py-2 ${activeTab === item.id ? "text-sky-300" : "text-slate-400"}`} onClick={() => onChange(item.id)}>
            <span className="block text-center text-xl">{item.icon}</span>
            <span className="text-xs leading-none">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}