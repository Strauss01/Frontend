import { ReasoningTrace } from "@/components/analysis/reasoning-trace";
import { ArgumentSimulator } from "@/components/analysis/argument-simulator";

export default function DocumentPage() {
  return (
    <div className="p-6 space-y-6">

      <GlassCard className="p-5">
        <h1 className="text-xl font-semibold">
          Legal Analysis Workspace
        </h1>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4">

        <GlassCard className="p-5">
          <h2>🧠 Reasoning Engine</h2>
          <ReasoningTrace trace={analysis?.decision_trace} />
        </GlassCard>

        <GlassCard className="p-5">
          <h2>⚔️ Litigation Simulation</h2>
          <ArgumentSimulator simulation={analysis?.simulation} />
        </GlassCard>

      </div>

    </div>
  );
}