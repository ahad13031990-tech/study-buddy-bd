import { redirect } from 'next/navigation'

export default function ForgotPasswordRoute() {
  redirect('/auth/forgot-password')
}
