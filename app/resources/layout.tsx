import { AppNav } from '@/components/app-nav'

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      {children}
    </>
  )
}
