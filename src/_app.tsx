// src/pages/_app.tsx (or just _app.tsx in your project's pages directory)
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import { createClient } from '@/lib/supabase-client';

const supabase = createClient();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN') {
        router.replace('/dashboard');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
