import { redirect } from 'next/navigation'

export default function ResetPasswordRoute() {
  redirect('/auth/reset-password')
}
