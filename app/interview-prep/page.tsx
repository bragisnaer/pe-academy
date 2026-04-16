import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import InterviewPrepClient from "./interview-prep-client"
import questionsData from "@/content/interview-prep/questions.json"

export const revalidate = 3600

export const metadata = {
  title: "Interview Prep | PE Academy",
  description: "Practice PE interview questions organised by topic.",
}

interface Question {
  id: string
  topicTag: string
  category: "technical" | "conceptual" | "behavioral"
  question: string
  answer: string
}

const topicLabels: Record<string, string> = {
  "pe-fundamentals": "PE Fundamentals",
  "fund-structure": "Fund Structure",
  "deal-concepts": "Deal Concepts",
  "return-metrics": "Return Metrics",
}

const topicOrder = ["pe-fundamentals", "fund-structure", "deal-concepts", "return-metrics"]

export default async function InterviewPrepPage() {
  // Auth guard — redirect to login if no session
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Group questions by topicTag preserving defined display order
  const questions = questionsData as Question[]
  const grouped: Record<string, Question[]> = {}

  for (const tag of topicOrder) {
    const matching = questions.filter((q) => q.topicTag === tag)
    if (matching.length > 0) {
      grouped[tag] = matching
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Interview Prep</h1>
        <p className="text-muted-foreground mb-8">Practice PE interview questions organised by topic area.</p>
        <InterviewPrepClient grouped={grouped} topicLabels={topicLabels} />
      </div>
    </div>
  )
}
