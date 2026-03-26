import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-cream">
      <div className="text-center">
        <p className="text-7xl mb-6">🧶</p>
        <h1 className="font-display text-4xl text-brown-dark mb-3">Page not found</h1>
        <p className="text-brown/60 mb-8 max-w-sm mx-auto">
          Looks like this thread got tangled. The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/shop" className="border border-sand px-6 py-2.5 rounded-full text-brown hover:border-terracotta transition-colors text-sm">
            Shop All
          </Link>
        </div>
      </div>
    </div>
  );
}
