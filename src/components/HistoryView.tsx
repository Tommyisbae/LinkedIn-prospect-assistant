import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";
import type { Report } from "../lib/db";

interface HistoryViewProps {
  onViewReport: (reportId: number) => void;
  onBack: () => void;
}

export function HistoryView({ onViewReport, onBack }: HistoryViewProps) {
  const reports: Report[] | undefined = useLiveQuery(() =>
    db.reports.orderBy("analyzedAt").reverse().toArray()
  );

  return (
    <div className="p-4 h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-300 hover:text-white">
          &larr; Back to Prospects
        </button>
        <h1 className="text-xl font-bold">Analysis History</h1>
        <div className="w-20"></div>
      </header>
      <main className="flex-grow overflow-y-auto pr-2">
        {reports && reports.length > 0 ? (
          <ul className="space-y-3">
            {reports.map((report) => (
              <li
                key={report.id}
                onClick={() => onViewReport(report.id!)}
                className="bg-slate-700 p-3 rounded-lg hover:bg-slate-600 cursor-pointer"
              >
                <p className="font-bold">{report.name}</p>
                <p className="text-sm text-slate-300">
                  {new Date(report.analyzedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-400 mt-10">No reports found.</p>
        )}
      </main>
    </div>
  );
}
