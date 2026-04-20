import { GlassCard } from "@/components/ui/glass-card";

export function ReasoningTrace({ trace }: any) {
  if (!trace) return null;

  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <h2 className="font-semibold">🧠 IRAC Reasoning</h2>

        <div className="text-sm text-white/70 space-y-2 mt-3">
          <p><b>Issue:</b> {trace.issue}</p>
          <p><b>Rule:</b> {trace.rule}</p>
          <p><b>Application:</b> {trace.application}</p>
          <p><b>Conclusion:</b> {trace.conclusion}</p>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="font-semibold">⚖️ Precedents</h2>

        <div className="space-y-2 mt-3">
          {trace.precedents?.map((p: any, i: number) => (
            <div key={i} className="p-3 bg-white/5 rounded-xl">
              <p className="font-medium">{p.citation}</p>
              <p className="text-xs text-white/50">
                {p.binding ? "Binding" : "Persuasive"}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}