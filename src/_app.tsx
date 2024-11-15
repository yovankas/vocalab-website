import { useRouter } from 'next/router'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import type { Subscription } from '@supabase/supabase-js'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const authListener = {
      subscription: {} as Subscription,
      unsubscribe: () => {}
    }

    // Your auth listener setup code here...

    return () => {
      if (typeof authListener?.unsubscribe === 'function') {
        authListener.unsubscribe()
      }
    }
  }, [router])

  return <Component {...pageProps} />
}