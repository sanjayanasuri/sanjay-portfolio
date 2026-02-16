export default function ContactPage() {
  const contactMethods = [
    {
      name: "Email",
      url: "mailto:sanjay.anasuri@gmail.com",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-accent",
      bg: "bg-accent/5"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/sanjayanasuri",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
        </svg>
      ),
      color: "text-blue-500",
      bg: "bg-blue-500/5"
    },
    {
      name: "GitHub",
      url: "https://github.com/sanjayanasuri",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-emerald-500",
      bg: "bg-emerald-500/5"
    },
    {
      name: "Wyzant",
      url: "https://www.wyzant.com/Tutors/tutoringbysanjay",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "text-orange-500",
      bg: "bg-orange-500/5"
    },
    {
      name: "Schedule",
      url: "https://calendar.app.google/YUQ4StWmxN94DaoN7",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-rose-500",
      bg: "bg-rose-500/5"
    }
  ];

  return (
    <section className="max-w-4xl mx-auto space-y-12 py-12 animate-reveal">
      <div className="relative text-center space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink relative">Contact</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed relative">
          Get in touch or connect with me on these platforms.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {contactMethods.map((method) => (
          <a
            key={method.name}
            href={method.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative glass-panel rounded-2xl px-6 py-4 flex items-center gap-4 border-border/40 hover:border-accent/40 transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute inset-0 ${method.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className={`relative w-10 h-10 rounded-xl ${method.bg} ${method.color} flex items-center justify-center transition-colors`}>
              {method.icon}
            </div>
            <div className="relative">
              <span className="text-sm font-semibold text-ink uppercase tracking-wider">{method.name}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="pt-12 text-center">
        <p className="text-muted text-sm italic opacity-40">Thanks for stopping by.</p>
      </div>
    </section>
  );
}
