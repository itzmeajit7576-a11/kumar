import React, { useState } from "react";
import {
  History,
  Search,
  Trash2,
  Eye,
  Mail,
  MessageSquareWarning,
  ScanLine,
} from "lucide-react";
import { HistoryRecord } from "../types/security";

interface HistoryViewProps {
  history: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectRecord,
  onDeleteRecord,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "Email" | "Message" | "Screenshot">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = history.filter((item) => {
    const matchesCat = categoryFilter === "ALL" || item.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.classification.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: HistoryRecord["category"]) => {
    if (cat === "Email") return <Mail className="w-4 h-4 text-cyan-400" />;
    if (cat === "Message") return <MessageSquareWarning className="w-4 h-4 text-amber-400" />;
    return <ScanLine className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <History className="w-4 h-4" />
            <span>USER-SCOPED FIRESTORE ANALYSIS LOGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Threat Analysis History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete user-isolated record of Email, Scam Message, and Screenshot OCR inspections.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-white/10 w-fit">
          {(["ALL", "Email", "Message", "Screenshot"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat === "ALL" ? `All Scans (${history.length})` : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by subject, sender, or threat type..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* History Data Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/65 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <History className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-medium text-white">No matching analysis records</div>
            <p className="text-xs text-slate-400">
              Run a scan in the Email Analyzer, Scam Message Detector, or Screenshot Scanner to
              populate history.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono text-slate-400 bg-slate-950/60">
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-4">Target / Subject</th>
                  <th className="py-3.5 px-4">Threat Type</th>
                  <th className="py-3.5 px-4 text-right">Risk Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Date / Time</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map((item) => {
                  const isHigh = item.riskScore >= 65;
                  const isMed = !isHigh && item.riskScore >= 35;
                  const scoreColor = isHigh
                    ? "text-red-400"
                    : isMed
                    ? "text-amber-400"
                    : "text-emerald-400";

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectRecord(item)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
                          {getCategoryIcon(item.category)}
                          <span>{item.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-medium text-white truncate">{item.title}</div>
                        <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
                      </td>
                      <td className={`py-3.5 px-4 font-mono text-xs font-semibold ${scoreColor}`}>
                        {item.classification}
                      </td>
                      <td
                        className={`py-3.5 px-4 font-mono text-sm font-bold text-right tabular-nums ${scoreColor}`}
                      >
                        {item.riskScore}/100
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                        {item.status}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400 text-right tabular-nums whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td
                        className="py-3.5 px-6 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectRecord(item)}
                            className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Open</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRecord(item.id)}
                            className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
