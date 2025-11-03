export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto text-center space-y-8">
      <div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 mb-6">About</h1>
        <div className="prose prose-lg prose-zinc mx-auto text-left max-w-2xl">
          <p className="text-lg text-zinc-700 leading-relaxed mb-4">
            Hello! I'm Sanjay. I'm in my final year of undergrad at Purdue University,
            where I'm pursuing a B.S in Data Science.
          </p>
          <p className="text-lg text-zinc-700 leading-relaxed mb-4">
            I'm interested in the intersection between technology and human-centered design. 
            I write about my experiences and learnings.
          </p>
          <p className="text-lg text-zinc-700 leading-relaxed">
            Three words to describe me are: <strong className="text-zinc-900">curious</strong>, <strong className="text-zinc-900">creative</strong>, and <strong className="text-zinc-900">empathetic</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
