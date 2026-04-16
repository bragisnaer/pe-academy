export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
      <div className="w-full max-w-[400px]">{children}</div>
    </div>
  )
}
