import Image from "next/image";
import { headers } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { listProjects } from "@/lib/notion";
import { mapProject } from "@/lib/mapNotion";

// Project type definition
type Project = {
  id: string;
  name: string;
  repoUrl?: string;
  demoUrl?: string;
  screenshot?: string;
  video?: string;
  description?: string;
  order?: number;
  tags?: string[];
};

// Force dynamic rendering to always fetch from Notion (not static)
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always fetch fresh data
export const runtime = 'nodejs'; // Use Node.js runtime
export const fetchCache = 'force-no-store'; // Never cache fetches
export const dynamicParams = true; // Allow dynamic params

export default async function ForEmployersPage() {
  // Force dynamic rendering and prevent caching
  noStore(); // Prevent static generation and caching
  const headersList = headers(); // This makes the route dynamic
  
  // Fetch projects from Notion
  let projects: Project[] = [];
  try {
    // Check if env var is set
    if (!process.env.NOTION_PROJECTS_DB_ID) {
      console.error("[ForEmployersPage] NOTION_PROJECTS_DB_ID is not set!");
      console.error("[ForEmployersPage] Make sure to add it to Vercel environment variables");
    }
    
    const raw = await listProjects({ limit: 100 });
    
    // Enhanced debugging - log what we get from Notion
    console.log(`[ForEmployersPage] Fetched ${raw.length} raw projects from Notion`);
    if (raw.length > 0) {
      console.log(`[ForEmployersPage] First project properties:`, Object.keys(raw[0]?.properties || {}));
      console.log(`[ForEmployersPage] First project sample:`, {
        id: raw[0]?.id,
        properties: raw[0]?.properties ? Object.keys(raw[0].properties).reduce((acc: any, key: string) => {
          const prop = raw[0].properties[key];
          if (prop?.type === 'title' || prop?.type === 'rich_text') {
            acc[key] = prop?.title?.[0]?.plain_text || prop?.rich_text?.[0]?.plain_text || 'empty';
          } else if (prop?.type === 'url') {
            acc[key] = prop?.url || 'empty';
          }
          return acc;
        }, {}) : 'no properties'
      });
    }
    
    const mapped = raw.map(mapProject);
    console.log(`[ForEmployersPage] Mapped ${mapped.length} projects`);
    console.log(`[ForEmployersPage] Mapped projects:`, mapped.map(p => ({ 
      name: p.name, 
      repoUrl: p.repoUrl, 
      hasScreenshot: !!p.screenshot 
    })));
    
    projects = mapped.filter((p): p is Project & { repoUrl: string } => !!p.repoUrl);
    console.log(`[ForEmployersPage] After filtering (with repoUrl): ${projects.length} projects`);
    
    if (raw.length > 0 && projects.length === 0) {
      console.warn(`[ForEmployersPage] WARNING: Fetched ${raw.length} projects but none have repoUrl!`);
      console.warn(`[ForEmployersPage] Check property names - looking for: Repository, Repo, GitHub, URL, or Link`);
    }
  } catch (error: any) {
    console.error("[ForEmployersPage] Error fetching projects:", {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
    // Continue with empty projects array
  }

  return (
    <section className="max-w-3xl mx-auto text-center space-y-8">
      <div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 mb-6">For Employers</h1>
        <div className="prose prose-lg prose-zinc mx-auto text-left max-w-2xl">
          <p className="text-lg text-zinc-700 leading-relaxed mb-4">
            Don't be snoopy if you're not a recruiter ... but here's my list of projects. 
            I'm interested in agent-to-agent frameworks and their application to automating tedious tasks. 
            I believe in a future where agents can not just collaborate but autonomously self-heal and adapt.
          </p>      
          
          {/* GitHub Link */}
          <div className="mb-8">
            <a 
              href="https://github.com/sanjayanasuri" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg text-zinc-700 hover:text-zinc-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View my GitHub
            </a>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Projects</h2>
            {projects.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-4">
                  {projects.map((project) => (
                    <a
                      key={project.id}
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center w-16 h-16 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors border border-zinc-300 hover:border-zinc-400 overflow-hidden"
                      title={project.name}
                    >
                      {/* Screenshot image - shown if available */}
                      {project.screenshot && (
                        <div className="absolute inset-0">
                          <Image
                            src={project.screenshot}
                            alt={project.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="64px"
                            loading="lazy"
                            onError={(e) => {
                              // Hide image and show fallback icon if image fails
                              const target = e.target as HTMLElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.parentElement?.querySelector('.github-icon-fallback');
                              if (fallback) {
                                (fallback as HTMLElement).classList.remove('hidden');
                                (fallback as HTMLElement).classList.add('block');
                              }
                            }}
                          />
                        </div>
                      )}
                      {/* Fallback GitHub icon - shown when no screenshot or image fails */}
                      <div className={`github-icon-fallback ${project.screenshot ? 'hidden' : 'block'} absolute inset-0 flex items-center justify-center`}>
                        <svg 
                          className="w-8 h-8 text-zinc-600 group-hover:text-zinc-900 transition-colors" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
                <p className="text-sm text-zinc-500 mt-3 italic">
                  Click on any project icon to view the repository. {projects.some(p => p.demoUrl) ? "Some projects have live demos!" : "Live demos coming soon!"}
                </p>
              </>
            ) : (
              <p className="text-sm text-zinc-500 italic">
                No projects found. Add projects to your Notion database to see them here.
              </p>
            )}
          </div>

          {/* Wyzant Tutor Profile Link */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            <p className="text-lg text-zinc-700 leading-relaxed mb-3">
              Here's a bit of proof of my work ethic:{" "}
              <a 
                href="https://www.wyzant.com/match/tutor/88912220" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-900 hover:text-zinc-600 underline transition-colors"
              >
                View my Wyzant tutor profile
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
