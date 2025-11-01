interface AnalysisInProgressProps {
  prospectName: string;
  statusMessage: string;
}

export function AnalysisInProgress({
  prospectName,
  statusMessage,
}: AnalysisInProgressProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mb-6"></div>
      <h2 className="text-xl font-bold mb-2">Analyzing {prospectName}...</h2>
      <p className="text-slate-300">{statusMessage}</p>
    </div>
  );
}
