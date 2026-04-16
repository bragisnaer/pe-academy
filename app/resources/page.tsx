import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import resourcesData from "@/content/resources/resource-list.json"
import { ResourcesClient } from "./resources-client"

export const revalidate = 3600

export const metadata = {
  title: "Resources | PE Academy",
  description: "Curated books, podcasts, annual letters and articles for PE learners.",
}

interface Resource {
  id: string
  title: string
  author: string | null
  type: "book" | "podcast" | "annual-letter" | "article"
  level: "Beginner" | "Intermediate" | "Expert"
  description: string
  url: string | null
}

export default async function ResourcesPage() {
  // Auth check — redirect to login if no session
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const resources = resourcesData as Resource[]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-foreground mb-2">Resources</h1>
      <p className="text-muted-foreground mb-8">Curated reading and listening for every stage of your PE journey.</p>
      <ResourcesClient resources={resources} />
    </div>
  )
}
