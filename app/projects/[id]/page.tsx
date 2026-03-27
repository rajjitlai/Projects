import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProjectById, getProjects } from '@/lib/sheets';
import { Terminal } from '@/components/Terminal';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Code } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Project Showcase`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-green-400 font-mono">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_100%)] bg-[length:100%_4px]" />

      <header className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link 
            href="/"
            className="bg-black/80 border border-green-500/30 px-4 py-2 rounded backdrop-blur flex items-center gap-2 hover:border-green-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs">[RETURN_TO_BASE]</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="text-green-500/60 text-xs">
              VECTOR_ID: {project.id}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-green-400">
              <span className="text-green-500">$</span> {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="border-green-500/50 text-green-400 bg-green-900/10"
                >
                  [{tag.toUpperCase()}]
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Image & Details */}
            <div className="lg:col-span-2 space-y-8">
              <Terminal title="visual_output.img">
                <div className="relative aspect-video rounded overflow-hidden border border-green-500/20 bg-black">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 pointer-events-none border border-green-500/10" />
                </div>
              </Terminal>

              <Terminal title="analysis.txt">
                <div className="space-y-4 text-green-300/90 leading-relaxed">
                  <p>{project.description}</p>
                </div>
              </Terminal>
            </div>

            {/* Sidebar / Metadata */}
            <div className="space-y-6">
              <Terminal title="links.sh">
                <div className="flex flex-wrap gap-4 pt-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/50 text-green-400 hover:bg-green-900/50 hover:text-green-300 transition-colors font-mono text-sm"
                >
                  <Globe className="w-4 h-4" />
                  [VISIT_SITE]
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-black border border-green-500/30 text-green-500/70 hover:border-green-500/60 hover:text-green-400 transition-colors font-mono text-sm"
                >
                  <Code className="w-4 h-4" />
                  [SOURCE_CODE]
                </a>
              )}
            </div>
              </Terminal>

              <Terminal title="manifest.json">
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between border-b border-green-900/30 pb-2">
                    <span className="text-green-500/60 font-bold">AUTHOR:</span>
                    <span className="text-green-400">{project.author}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-900/30 pb-2">
                    <span className="text-green-500/60 font-bold">INITIALIZED:</span>
                    <span className="text-green-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-green-900/30 pb-2">
                    <span className="text-green-500/60 font-bold">STATUS:</span>
                    <span className="text-green-400 animate-pulse">OPERATIONAL</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-green-500/40 text-[10px] uppercase mb-2">Technological Stack:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map(t => (
                        <span key={t} className="text-[10px] text-green-500/60"># {t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Terminal>

              <Terminal title="system.log">
                <div className="text-[10px] text-green-700 font-mono space-y-1">
                  <p>[OK] Loading project module...</p>
                  <p>[OK] Establishing secure connection...</p>
                  <p>[OK] Fetching project metadata...</p>
                  <p>[OK] Rendering visual assets...</p>
                  <p className="text-green-500 animate-blink">_</p>
                </div>
              </Terminal>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-green-500/20 py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-green-700 font-mono text-[10px] uppercase tracking-widest">
            Showcase Protocol Initiated // Built on Next.js 16
          </p>
        </div>
      </footer>
    </div>
  );
}
