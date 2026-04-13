'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const loginSchema = z.object({
  email: z.string().min(1, 'Enter a valid email address.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginValues) {
    setIsLoading(true)
    setServerError(null)

    const formData = new FormData()
    formData.set('email', values.email)
    formData.set('password', values.password)

    const result = await login(formData)

    if (result?.error) {
      setServerError(result.error)
      setIsLoading(false)
    }
    // On success, server action redirects
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-0 pt-8 px-6">
          <h1 className="text-2xl font-semibold text-white leading-tight">
            Welcome back
          </h1>
        </CardHeader>
        <CardContent className="px-6 pb-8 pt-6">
          {serverError && (
            <Alert className="mb-4 border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-500 text-sm">
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-zinc-300">Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-zinc-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="flex justify-end">
                      <Link
                        href="/reset-password"
                        className="text-xs text-zinc-400 hover:text-white underline underline-offset-4"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] bg-white text-zinc-900 hover:bg-zinc-100 font-medium mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-white underline underline-offset-4 hover:text-zinc-200">
          Get started
        </Link>
      </p>
    </div>
  )
}
