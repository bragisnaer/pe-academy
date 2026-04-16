import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { GlossaryClient } from "./glossary-client"
import termsData from "@/content/glossary/terms.json"

interface TermEntry {
  term: string
  definition: string
  full_definition: string
  related_topic_tags: string[]
}

export const metadata = {
  title: "Glossary | PE Academy",
  description: "Key private equity concepts and definitions from the PE Academy curriculum.",
}

export default async function GlossaryPage() {
  // Auth check — redirect to login if no session
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Sort terms alphabetically
  const terms = (termsData as TermEntry[]).slice().sort((a, b) =>
    a.term.toLowerCase().localeCompare(b.term.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-foreground mb-2">Glossary</h1>
      <p className="text-muted-foreground mb-8">
        Key concepts from the PE Academy curriculum.
      </p>

      <GlossaryClient terms={terms} />
    </div>
  )
}
