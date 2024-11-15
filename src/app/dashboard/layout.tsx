'use client'

import { useAuth } from '../providers'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // You can either redirect here or show an error message
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg">Please sign in to access the dashboard</p>
      </div>
    )
  }

  return <div className="min-h-screen">{children}</div>
}