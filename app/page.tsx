import ScrollSequence from "@/components/ScrollSequence";

const SECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Home() {
  return (
    <>
      <ScrollSequence />

      <main className="relative z-10">
        {SECTIONS.map((section) => (
          <section
            key={section}
            className="flex min-h-[100svh] items-center justify-center px-6 py-24"
          >
            <div
              data-reveal
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/60 px-8 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Sección {section}
              </p>
              <span className="mx-auto mt-5 block h-px w-12 bg-gradient-to-r from-[#3b82f6] to-[#ff5a2b]" />
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
