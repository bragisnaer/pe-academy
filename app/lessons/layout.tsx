import { LessonSidebar } from "@/components/lesson-sidebar"
import { MobileSidebarToggle } from "@/components/mobile-sidebar-toggle"
import { getCompletedLessons } from "@/lib/actions/lessons"
import { getUnlockedLevelIds } from "@/lib/actions/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppNav } from "@/components/app-nav"

export default async function LessonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch completed lesson UUIDs and unlocked level IDs in parallel.
  // This makes the layout dynamic (per-request) so sidebar checkmarks and
  // level lock state are always up to date. Lesson page content remains ISR-static.
  const [completedLessonUuids, unlockedLevelIds] = await Promise.all([
    getCompletedLessons(),
    getUnlockedLevelIds(),
  ])

  return (
    <>
    <AppNav />
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 flex-col bg-sidebar border-r border-border sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
        <LessonSidebar
          completedLessonUuids={completedLessonUuids}
          unlockedLevelIds={unlockedLevelIds}
        />
      </aside>

      {/* Mobile header bar with hamburger */}
      <div className="fixed top-14 left-0 right-0 z-40 flex items-center gap-3 px-4 h-12 bg-sidebar border-b border-border md:hidden">
        <MobileSidebarToggle />
        <span className="text-sm text-muted-foreground">Curriculum</span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 md:pt-0 pt-12">
        <div className="max-w-2xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>
    </div>
    </>
  )
}
