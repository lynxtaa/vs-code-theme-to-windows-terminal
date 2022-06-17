import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Button from '../components/Button'
import FormErrorMessage from '../components/FormErrorMessage'
import Input from '../components/Input'
import { ClipboardCheckIcon, ClipboardIcon, SpinnerIcon } from '../components/icons'
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
			const timer = setTimeout(() => setIsCopyedToClipboard(false), 500)

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
		reset,
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
		reset(values)
	}

	return (
		<div className="max-w-[800px] mx-auto p-4">
			<h1 className="text-3xl font-medium text-center pt-4 mb-6">
				VS Code Theme to Windows Terminal
			</h1>
			<details className="mx-auto max-w-lg mb-6 cursor-default">
				<summary className="mb-2">How?</summary>
				<ol className="opacity-90 list-decimal mx-auto pl-4">
					<li>
						In VSCode hit <kbd>Ctrl-Shift-P</kbd> and type <i>Generate</i>, then select
						and run <i>Generate Color Theme From Current Settings</i> and paste resulting
						json below
					</li>
					<li>
						Click <i>Generate</i>
					</li>
					<li>
						Insert generated color scheme to the <i>schemes</i> section of Windows
						Terminal&apos;s <i>profiles.json</i>
					</li>
				</ol>
			</details>
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
							isInvalid={Boolean(errors.themeName)}
							{...register('themeName', { required: 'required field' })}
						/>
						{errors.themeName && (
							<FormErrorMessage>{errors.themeName.message}</FormErrorMessage>
						)}
					</div>
					<div className="mb-4">
						<label className="block mb-1" htmlFor="colorTheme">
							VSCode Color Theme
						</label>
						<Input
							type="textarea"
							spellCheck={false}
							id="colorTheme"
							className="whitespace-pre w-full min-h-[22rem] font-mono text-sm mb-1"
							isInvalid={Boolean(errors.colorTheme)}
							{...register('colorTheme', { required: 'required field' })}
						/>
						{errors.colorTheme && (
							<FormErrorMessage>{errors.colorTheme.message}</FormErrorMessage>
						)}
					</div>
					<div className="flex mb-4 md:mb-0">
						<Button type="submit" className="ml-auto inline-flex items-center">
							{isSubmitting && <SpinnerIcon />}
							Generate
						</Button>
					</div>
				</form>
				<div className="w-full flex flex-col min-w-[40%]">
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
							{isCopyedToClipboard ? <ClipboardCheckIcon /> : <ClipboardIcon />}
						</Button>
					</code>
				</div>
			</div>
		</div>
	)
}
