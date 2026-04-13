'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function getOrigin(): Promise<string> {
  const headersList = await headers()
  return headersList.get('origin') ?? ''
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const origin = await getOrigin()

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Incorrect email or password. Please try again.' }
  }

  redirect('/lessons')
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string
  const origin = await getOrigin()

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password/confirm`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function resendVerification(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({ type: 'signup', email })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
