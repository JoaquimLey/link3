import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

const NearProvider= dynamic(() => import('../context/near') as any, { ssr: false })

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <NearProvider>
                <Component {...pageProps} />
            </NearProvider>
        </>
    )
}

export default MyApp
