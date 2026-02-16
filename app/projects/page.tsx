export default async function ProjectsPage() {
  return (
    <section className="max-w-3xl mx-auto space-y-12 py-12 animate-reveal">
      <div className="space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Projects</h1>

        {/* Simplified Links */}
        <div className="flex gap-8 text-sm font-medium">
          <a href="https://github.com/sanjayanasuri" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent transition-colors">GitHub</a>
          <a href="https://www.wyzant.com/Tutors/tutoringbysanjay" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent transition-colors">Wyzant</a>
        </div>
      </div>

      {/* Minimal Brain Web Visualization */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border/30" />
          <span className="text-xs font-bold text-ink/20 tracking-widest uppercase">Brain Web</span>
          <div className="h-px flex-1 bg-border/30" />
        </div>

        <a
          href="https://www.demo.sanjayanasuri.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block group relative"
        >
          <div className="glass-panel rounded-2xl overflow-hidden border border-border/40 hover:border-accent/40 transition-all duration-300">
            {/* Small Minimal Diagram */}
            <div className="relative h-48 bg-gradient-to-br from-accent/5 via-transparent to-transparent p-6 overflow-hidden">
              <div className="relative w-full h-full">
                {/* Central Node */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center z-10 group-hover:bg-accent/30 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 1 }}>
                  <line x1="50%" y1="50%" x2="35%" y2="30%" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="50%" y1="50%" x2="65%" y2="30%" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="50%" y1="50%" x2="30%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                </svg>

                {/* Surrounding Nodes */}
                <div className="absolute top-[30%] left-[35%] w-4 h-4 rounded-full border border-border/60" />
                <div className="absolute top-[30%] right-[35%] w-4 h-4 rounded-full border border-border/60" />
                <div className="absolute bottom-[30%] left-[30%] w-4 h-4 rounded-full border border-border/60" />
                <div className="absolute bottom-[30%] right-[30%] w-4 h-4 rounded-full border border-border/60" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-accent/5 backdrop-blur-[2px]">
                <span className="text-xs font-semibold text-accent tracking-widest uppercase">Launch Demo</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
