import { NextSeo } from 'next-seo'
import { AppProps } from 'next/app'

import '../styles/global.css'

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<NextSeo
				title="VS Code Theme To Windows Terminal"
				description="Generates Windows Terminal Theme from VS Code Color Theme"
			/>
			<Component {...pageProps} />
		</>
	)
}
