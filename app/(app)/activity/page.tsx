"use client";

import { useEffect, useState } from "react";
import { Activity, FileUp, Play, LogIn, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getActivity, type ActivityEntry } from "@/lib/activity";

const ICONS: Record<ActivityEntry["type"], React.ReactNode> = {
  upload: <FileUp className="h-4 w-4 text-blue-400" />,
  analysis: <Play className="h-4 w-4 text-green-400" />,
  login: <LogIn className="h-4 w-4 text-gold-400" />,
  logout: <LogOut className="h-4 w-4 text-muted-foreground" />,
};

export default function ActivityPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    setEntries(getActivity());
  }, []);

  return (
    <div className="space-y-8 animate-in max-w-2xl">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">
          Audit
        </p>
        <h1 className="font-serif text-3xl font-bold text-white">
          Activity Log
        </h1>
        <p className="text-muted-foreground mt-1">
          A client-side log of recent actions in this session.
        </p>
      </div>

      <Card>
        {entries.length === 0 ? (
          <CardContent className="flex flex-col items-center py-14 text-center">
            <Activity className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No activity recorded yet.
            </p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {entries.map((entry) => (
                <li key={entry.id} className="flex items-start gap-4 px-5 py-3.5">
                  <div className="mt-0.5 p-1.5 rounded-md bg-muted shrink-0">
                    {ICONS[entry.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{entry.message}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
