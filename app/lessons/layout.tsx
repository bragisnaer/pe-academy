import { LessonSidebar } from "@/components/lesson-sidebar"
import { MobileSidebarToggle } from "@/components/mobile-sidebar-toggle"

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 flex-col bg-zinc-900 border-r border-white/10 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
        <LessonSidebar />
      </aside>

      {/* Mobile header bar with hamburger */}
      <div className="fixed top-14 left-0 right-0 z-40 flex items-center gap-3 px-4 h-12 bg-zinc-900 border-b border-white/10 md:hidden">
        <MobileSidebarToggle />
        <span className="text-sm text-zinc-400">Curriculum</span>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 md:pt-0 pt-12">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>
    </div>
  )
}
