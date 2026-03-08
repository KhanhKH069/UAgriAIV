import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../lib/i18n'

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
