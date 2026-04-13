'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { updatePassword } from '@/lib/actions/auth'
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

const confirmSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Passwords do not match.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type ConfirmValues = z.infer<typeof confirmSchema>

export default function ResetPasswordConfirmPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<ConfirmValues>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: ConfirmValues) {
    setIsLoading(true)
    setServerError(null)

    const formData = new FormData()
    formData.set('password', values.password)

    const result = await updatePassword(formData)

    if (result?.error) {
      setServerError(result.error)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-0 pt-8 px-6">
          <h1 className="text-2xl font-semibold text-white leading-tight">
            Set a new password
          </h1>
        </CardHeader>
        <CardContent className="px-6 pb-8 pt-6">
          {success ? (
            <p className="text-base text-zinc-400 leading-relaxed">
              Password updated. Redirecting you to sign in&hellip;
            </p>
          ) : (
            <>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-zinc-300">New password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="At least 8 characters"
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-zinc-300">Confirm new password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Repeat your password"
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                        Updating...
                      </>
                    ) : (
                      'Update password'
                    )}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
