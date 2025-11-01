import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";
// This import line now correctly includes getGradeColor
import { scoreToGrade, getGradeColor } from "../lib/scoring";

interface AnalysisReportProps {
  reportId: number;
  onBack: () => void;
}

export function AnalysisReport({ reportId, onBack }: AnalysisReportProps) {
  const report = useLiveQuery(() => db.reports.get(reportId), [reportId]);

  if (!report) {
    return <div className="p-4">Loading report...</div>;
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(report.connectionMessage);
    alert("Message copied to clipboard!");
  };

  // Here we use the imported functions
  const grade = scoreToGrade(report.score);
  const color = getGradeColor(grade);

  return (
    <div className="p-4 h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-300 hover:text-white">
          &larr; Back to History
        </button>
      </header>
      <main className="flex-grow space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{report.name}</h1>
            <p className="text-slate-400">{report.headline}</p>
          </div>
          <div
            className={`flex-shrink-0 text-white text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center ${color}`}
          >
            {grade}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-1">AI Justification:</h3>
          <p className="bg-slate-700 p-3 rounded-md text-slate-300 italic">
            "{report.justification}"
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Suggested Connection Message:</h3>
          <textarea
            readOnly
            value={report.connectionMessage}
            rows={5}
            className="w-full bg-slate-700 p-3 rounded-md text-white border-slate-600 focus:ring-0 focus:outline-none"
          />
        </div>
      </main>
      <footer className="mt-4">
        <button
          onClick={handleCopyMessage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Copy Message
        </button>
      </footer>
    </div>
  );
}
