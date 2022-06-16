import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Button from '../components/Button'
import FormErrorMessage from '../components/FormErrorMessage'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import Textarea from '../components/Textarea'
import useLocalStorage from '../hooks/useLocalStorage'
import { fetchApi } from '../lib/fetchApi'

type FormValues = {
	themeName: string
	colorTheme: string
}

export default function Home() {
	const [windowsTerminalTheme, setWindowsTerminalTheme] = useState('')

	const [savedValues, setSavedValues] = useLocalStorage<FormValues>('Home/savedValues', {
		themeName: '',
		colorTheme: '',
	})

	const [isCopyedToClipboard, setIsCopyedToClipboard] = useState(false)

	useEffect(() => {
		if (isCopyedToClipboard) {
			const timer = setTimeout(() => setIsCopyedToClipboard(false), 2000)

			return function () {
				clearTimeout(timer)
			}
		}
	}, [isCopyedToClipboard])

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<FormValues>({ defaultValues: savedValues })

	async function onSubmit(values: FormValues) {
		const response = await fetchApi('/generate', {
			method: 'POST',
			body: JSON.stringify(values),
			headers: { 'Content-Type': 'application/json' },
		})
		const json = await response.json()
		setWindowsTerminalTheme(JSON.stringify(json, null, '  '))
		setSavedValues(values)
	}

	return (
		<div className="max-w-[800px] mx-auto p-4">
			<h1 className="text-3xl font-medium text-center pt-4 mb-8">
				VS Code Theme to Windows Terminal
			</h1>
			<div className="flex md:space-x-6 flex-col md:flex-row">
				<form
					className="min-w-[50%]"
					onSubmit={event =>
						handleSubmit(onSubmit)(event).catch(err => {
							setError('colorTheme', {
								message: err instanceof Error ? err.message : String(err),
							})
						})
					}
				>
					<div className="mb-4">
						<label className="block mb-1" htmlFor="themeName">
							Theme Name
						</label>
						<Input
							id="themeName"
							className="w-full py-1 px-2"
							{...register('themeName', { required: 'required field' })}
							isInvalid={Boolean(errors.themeName)}
						/>
						{errors.themeName && (
							<FormErrorMessage>{errors.themeName.message}</FormErrorMessage>
						)}
					</div>
					<div className="mb-4">
						<label className="block mb-1" htmlFor="colorTheme">
							VSCode Color Theme
						</label>
						<Textarea
							spellCheck={false}
							id="colorTheme"
							className="whitespace-pre w-full h-[50vh] min-h-[15rem] font-mono text-sm"
							{...register('colorTheme', { required: 'required field' })}
							isInvalid={Boolean(errors.colorTheme)}
						/>
						{errors.colorTheme && (
							<FormErrorMessage>{errors.colorTheme.message}</FormErrorMessage>
						)}
					</div>
					<div className="flex mb-4 md:mb-0">
						<Button type="submit" className="ml-auto inline-flex items-center">
							{isSubmitting && <Spinner />}
							Generate
						</Button>
					</div>
				</form>
				<div className="w-full flex flex-col">
					<div className="mb-1">Generated Theme</div>
					<code
						aria-label="Generated Theme"
						className="whitespace-pre font-mono border border-whiteAlpha-300 p-3 w-full rounded-md text-sm flex-grow min-h-[30rem] relative"
					>
						{windowsTerminalTheme}
						<Button
							title="Copy to Clipboard"
							className="absolute right-2 top-2 px-1 py-1"
							onClick={() => {
								navigator.clipboard
									.writeText(windowsTerminalTheme)
									.then(() => setIsCopyedToClipboard(true))
									.catch(err => {
										// eslint-disable-next-line no-console
										console.error(err)
									})
							}}
							isDisabled={!windowsTerminalTheme}
						>
							{isCopyedToClipboard ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path
										fillRule="evenodd"
										d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
									/>
									<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
									<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
									<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
								</svg>
							)}
						</Button>
					</code>
				</div>
			</div>
		</div>
	)
}
