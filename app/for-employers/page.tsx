export default async function ForEmployersPage() {

  return (
    <section className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink mb-8">For Employers</h1>
        
        {/* Links at Top */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <a 
            href="https://github.com/sanjayanasuri" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-lg text-accent hover:text-accent-2 transition-colors font-medium"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
          
          <a 
            href="https://www.wyzant.com/Tutors/tutoringbysanjay" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-lg text-accent hover:text-accent-2 transition-colors font-medium"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Wyzant
          </a>
        </div>
      </div>

      {/* Try Brain Web Section */}
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-ink mb-3">Try Brain Web</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Here is the main project I've been working on. I wanted to build a system that builds on your knowledge 
            and helps you fill gaps while also suggesting future research opportunities in a visual way.
          </p>
        </div>

        {/* Brain Web Preview Block */}
        <div className="relative group">
          <a
            href="https://www.demo.sanjayanasuri.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="glass-panel rounded-2xl overflow-hidden shadow-brain hover:shadow-accent-lg transition-all duration-300 border border-border hover:border-accent">
              {/* Preview Visual - Graph Visualization Representation */}
              <div className="relative h-64 sm:h-80 bg-gradient-to-br from-accent/10 via-accent-2/10 to-accent/5 p-8 overflow-hidden">
                <div className="relative w-full h-full">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-2 shadow-accent flex items-center justify-center z-10">
                    <span className="text-white font-bold text-sm">Brain</span>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    <line x1="50%" y1="50%" x2="30%" y2="25%" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className="text-accent/20" />
                    <line x1="50%" y1="50%" x2="70%" y2="25%" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className="text-accent/20" />
                    <line x1="50%" y1="50%" x2="25%" y2="65%" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className="text-accent/20" />
                    <line x1="50%" y1="50%" x2="75%" y2="65%" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className="text-accent/20" />
                    <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className="text-accent/20" />
                  </svg>
                  
                  {/* Surrounding Nodes */}
                  <div className="absolute top-[25%] left-[30%] w-12 h-12 rounded-full glass-panel border-2 border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-xs font-semibold text-ink">AI</span>
                  </div>
                  <div className="absolute top-[25%] right-[30%] w-12 h-12 rounded-full glass-panel border-2 border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-xs font-semibold text-ink">Graph</span>
                  </div>
                  <div className="absolute top-[65%] left-[25%] w-12 h-12 rounded-full glass-panel border-2 border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-xs font-semibold text-ink">Knowledge</span>
                  </div>
                  <div className="absolute top-[65%] right-[25%] w-12 h-12 rounded-full glass-panel border-2 border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-xs font-semibold text-ink">Research</span>
                  </div>
                  <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full glass-panel border-2 border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-xs font-semibold text-ink">Learning</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 sm:p-8 space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-ink mb-2">Brain Web</h3>
                  <p className="text-muted leading-relaxed">
                    An interactive knowledge graph platform that visualizes and connects concepts through an AI-powered interface. 
                    Build on your existing knowledge, identify gaps, and discover new research opportunities—all in a beautiful, 
                    visual way.
                  </p>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'Neo4j', 'OpenAI', 'AWS', 'Terraform'].map((tech) => (
                    <span key={tech} className="pill">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <span className="btn-gradient inline-block text-center w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white shadow-accent-lg hover:shadow-accent transition-all cursor-pointer">
                    🚀 Try Live Demo
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

    </section>
  );
}
