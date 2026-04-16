import { PublicNav } from '@/components/public-nav'
import { MarketingFooter } from '@/components/marketing-footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicNav />
      <main>{children}</main>
      <MarketingFooter />
    </>
  )
}
