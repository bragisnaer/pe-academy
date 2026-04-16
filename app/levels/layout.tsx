import { AppNav } from '@/components/app-nav'

export default function LevelsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      {children}
    </>
  )
}
