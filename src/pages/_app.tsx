import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { Manrope } from 'next/font/google';

const roboto = Manrope({
  weight: ['200', '400', '700'],
  style: ['normal'],
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
