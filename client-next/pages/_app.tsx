import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NearProvider } from '../context/near'

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
