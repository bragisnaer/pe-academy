'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { resendVerification } from '@/lib/actions/auth'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleResend() {
    if (!email || resendState === 'sending') return
    setResendState('sending')
    const result = await resendVerification(email)
    if (result?.error) {
      setResendState('error')
    } else {
      setResendState('sent')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-0 pt-8 px-6">
          <h1 className="text-2xl font-semibold text-white leading-tight">
            Verify your email
          </h1>
        </CardHeader>
        <CardContent className="px-6 pb-8 pt-4 flex flex-col gap-4">
          <p className="text-base text-zinc-400 leading-relaxed">
            We&apos;ve sent a verification link to {email || 'your email address'}. Click the link in your email to activate your account.
          </p>

          <p className="text-sm text-zinc-500">
            Didn&apos;t receive it?{' '}
            {resendState === 'sent' ? (
              <span className="text-zinc-400">Verification email resent.</span>
            ) : resendState === 'error' ? (
              <span className="text-red-500">Something went wrong. Try again.</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendState === 'sending'}
                className="text-white underline underline-offset-4 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendState === 'sending' ? 'Sending...' : 'Resend verification email'}
              </button>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-0 pt-8 px-6">
            <h1 className="text-2xl font-semibold text-white leading-tight">
              Verify your email
            </h1>
          </CardHeader>
          <CardContent className="px-6 pb-8 pt-4">
            <p className="text-base text-zinc-400">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
