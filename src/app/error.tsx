"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-cream">
      <div className="text-center">
        <p className="text-7xl mb-6">😕</p>
        <h1 className="font-display text-4xl text-brown-dark mb-3">Something went wrong</h1>
        <p className="text-brown/60 mb-8 max-w-sm mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Try Again</button>
          <a href="/" className="border border-sand px-6 py-2.5 rounded-full text-brown hover:border-terracotta transition-colors text-sm">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
