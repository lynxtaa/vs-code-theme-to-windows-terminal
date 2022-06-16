import json5 from 'json5'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const colorString = () =>
	z
		.string()
		// Remove transparency
		.transform(str =>
			str.length === 5 // #RGBA
				? str.slice(0, 4)
				: str.length === 9 // #RRGGBBAA
				? str.slice(0, 7)
				: str,
		)
		.refine(
			str => /^#[A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?$/.test(str),
			str => ({ message: `"${str}" is not a valid color` }),
		)

const colorsSchema = z.object({
	colors: z.object({
		'editorCursor.foreground': colorString(),
		'terminal.ansiBlack': colorString(),
		'terminal.ansiBlue': colorString(),
		'terminal.ansiBrightBlack': colorString(),
		'terminal.ansiBrightBlue': colorString(),
		'terminal.ansiBrightCyan': colorString(),
		'terminal.ansiBrightGreen': colorString(),
		'terminal.ansiBrightMagenta': colorString(),
		'terminal.ansiBrightRed': colorString(),
		'terminal.ansiBrightWhite': colorString(),
		'terminal.ansiBrightYellow': colorString(),
		'terminal.ansiCyan': colorString(),
		'terminal.ansiGreen': colorString(),
		'terminal.ansiMagenta': colorString(),
		'terminal.ansiRed': colorString(),
		'terminal.ansiWhite': colorString(),
		'terminal.ansiYellow': colorString(),
		'terminal.background': colorString(),
		'terminal.foreground': colorString(),
		'terminal.selectionBackground': colorString(),
	}),
})

export type ApiResult = {
	name: string
	background: string
	foreground: string
	black: string
	blue: string
	brightBlack: string
	brightBlue: string
	brightCyan: string
	brightGreen: string
	brightPurple: string
	brightRed: string
	brightWhite: string
	brightYellow: string
	cyan: string
	green: string
	purple: string
	red: string
	white: string
	yellow: string
	cursorColor: string
	selectionBackground: string
}

export default async function generate(
	req: NextApiRequest,
	res: NextApiResponse<ApiResult | { error: string }>,
): Promise<void> {
	if (req.method !== 'POST') {
		res.status(405).end()
		return
	}

	let themeName: string
	let colors: z.infer<typeof colorsSchema>['colors']

	try {
		const body = await z
			.object({ colorTheme: z.string(), themeName: z.string() })
			.parseAsync(req.body)

		themeName = body.themeName
		colors = (await colorsSchema.parseAsync(json5.parse(body.colorTheme))).colors
	} catch (err) {
		return res
			.status(400)
			.json({ error: err instanceof Error ? err.message : String(err) })
	}

	res.json({
		name: themeName,
		background: colors['terminal.background'],
		foreground: colors['terminal.foreground'],
		black: colors['terminal.ansiBlack'],
		blue: colors['terminal.ansiBlue'],
		brightBlack: colors['terminal.ansiBrightBlack'],
		brightBlue: colors['terminal.ansiBrightBlue'],
		brightCyan: colors['terminal.ansiBrightCyan'],
		brightGreen: colors['terminal.ansiBrightGreen'],
		brightPurple: colors['terminal.ansiBrightMagenta'],
		brightRed: colors['terminal.ansiBrightRed'],
		brightWhite: colors['terminal.ansiBrightWhite'],
		brightYellow: colors['terminal.ansiBrightYellow'],
		cyan: colors['terminal.ansiCyan'],
		green: colors['terminal.ansiGreen'],
		purple: colors['terminal.ansiMagenta'],
		red: colors['terminal.ansiRed'],
		white: colors['terminal.ansiWhite'],
		yellow: colors['terminal.ansiYellow'],
		cursorColor: colors['editorCursor.foreground'],
		selectionBackground: colors['terminal.selectionBackground'],
	})
}
