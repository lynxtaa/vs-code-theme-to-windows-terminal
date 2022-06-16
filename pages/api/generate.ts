import json5 from 'json5'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const colorsSchema = z.object({
	colors: z.object({
		'terminal.ansiBlack': z.string(),
		'terminal.ansiBlue': z.string(),
		'terminal.ansiBrightBlack': z.string(),
		'terminal.ansiBrightBlue': z.string(),
		'terminal.ansiBrightCyan': z.string(),
		'terminal.ansiBrightGreen': z.string(),
		'terminal.ansiBrightMagenta': z.string(),
		'terminal.ansiBrightRed': z.string(),
		'terminal.ansiBrightWhite': z.string(),
		'terminal.ansiBrightYellow': z.string(),
		'terminal.ansiCyan': z.string(),
		'terminal.ansiGreen': z.string(),
		'terminal.ansiMagenta': z.string(),
		'terminal.ansiRed': z.string(),
		'terminal.ansiWhite': z.string(),
		'terminal.ansiYellow': z.string(),
		'terminal.background': z.string(),
		'terminal.foreground': z.string(),
	}),
})

export default async function generate(
	req: NextApiRequest,
	res: NextApiResponse,
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
	})
}
