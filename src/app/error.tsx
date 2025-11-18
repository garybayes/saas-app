"use client";
export default function GlobalError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-semibold text-red-500">Something went wrong</h1>
      <pre className="text-sm text-muted">{error.message}</pre>
      <button onClick={() => window.location.reload()} className="btn-primary">
        Reload
      </button>
    </div>
  );
}
