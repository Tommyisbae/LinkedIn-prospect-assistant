interface ScrapeReviewProps {
  prospectName: string;
  scrapedData: any;
  onProceed: () => void;
  // Corrected line
  onCancel: () => void;
}

export function ScrapeReview({
  prospectName,
  scrapedData,
  onProceed,
  onCancel,
}: ScrapeReviewProps) {
  return (
    <div className="p-4 h-full flex flex-col">
      <header className="mb-4">
        <h1 className="text-xl font-bold">Review Scraped Data</h1>
        <p className="text-slate-400">For: {prospectName}</p>
      </header>
      <main className="flex-grow bg-slate-900 p-2 rounded-md overflow-y-auto">
        <pre className="text-xs text-white whitespace-pre-wrap">
          {JSON.stringify(scrapedData, null, 2)}
        </pre>
      </main>
      <footer className="mt-4 flex gap-4">
        <button
          onClick={onCancel}
          className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          onClick={onProceed}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Proceed with AI Analysis
        </button>
      </footer>
    </div>
  );
}
