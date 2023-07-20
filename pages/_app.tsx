import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter, Roboto, Open_Sans } from 'next/font/google'

const font = Open_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font',
})


export default function App({ Component, pageProps }: AppProps) {
  return <div className={`${font.variable}`} >
    <Component {...pageProps} />
  </div>
}
