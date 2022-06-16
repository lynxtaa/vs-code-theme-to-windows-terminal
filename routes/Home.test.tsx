/**
 * @jest-environment jsdom
 */

import { readFileSync } from 'fs'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { rest, server } from '../jest/server'

import Home from './Home'

const theme = readFileSync('./jest/fixtures/vscode-theme.json', 'utf-8')

it('generates color theme', async () => {
	server.use(
		rest.post('/api/generate', (req, res, ctx) => {
			expect(req.body).toEqual({
				themeName: 'Tokyo Night',
				colorTheme: theme,
			})

			return res(
				ctx.json({
					name: 'Tokyo Night',
					background: '#16161e',
					foreground: '#787c99',
					black: '#363b54',
					blue: '#7aa2f7',
					brightBlack: '#363b54',
					brightBlue: '#7aa2f7',
					brightCyan: '#7dcfff',
					brightGreen: '#41a6b5',
					brightPurple: '#bb9af7',
					brightRed: '#f7768e',
					brightWhite: '#acb0d0',
					brightYellow: '#e0af68',
					cyan: '#7dcfff',
					green: '#41a6b5',
					purple: '#bb9af7',
					red: '#f7768e',
					white: '#787c99',
					yellow: '#e0af68',
				}),
			)
		}),
	)

	render(<Home />)

	await userEvent.type(screen.getByRole('textbox', { name: 'Theme Name' }), 'Tokyo Night')

	fireEvent.change(screen.getByRole('textbox', { name: 'VSCode Color Theme' }), {
		target: { value: theme },
	})

	await userEvent.click(screen.getByRole('button', { name: 'Generate' }))

	await waitFor(() => {
		expect(screen.getByLabelText('Generated Theme')).toHaveTextContent(
			/"name": "Tokyo Night"/,
		)
	})
}, 15000)
