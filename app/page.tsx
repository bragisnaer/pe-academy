import { redirect } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-6 py-16">
      <div className="w-full max-w-[480px] flex flex-col items-center text-center gap-6">
        <h1 className="text-[40px] font-semibold text-white leading-tight">
          PE Academy
        </h1>
        <p className="text-base text-zinc-400 leading-relaxed">
          The structured path from PE novice to industry-ready.
        </p>
        <div className="flex flex-col items-center gap-3 w-full">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'w-full sm:w-auto min-h-[44px] bg-white text-zinc-900 hover:bg-zinc-100 font-medium px-8'
            )}
          >
            Get started
          </Link>
          <p className="text-base text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-white underline underline-offset-4 hover:text-zinc-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
