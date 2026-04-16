import { AppNav } from '@/components/app-nav'

export default function InterviewPrepLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      {children}
    </>
  )
}
