import json5 from 'json5'
import { z } from 'zod'

const stripAlphaChannel = (color: string) =>
	color.length === 5 // #RGBA
		? color.slice(0, 4)
		: color.length === 9 // #RRGGBBAA
		? color.slice(0, 7)
		: color

const colorString = () =>
	z
		.string()
		.transform(stripAlphaChannel)
		.refine(
			str => /^#[A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?$/.test(str),
			str => ({ message: `"${str}" is not a valid color` }),
		)

const colorsSchema = z.object({
	colors: z.object({
		'editor.background': colorString(),
		'foreground': colorString(),
		'editor.selectionBackground': colorString(),
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
		'terminal.background': colorString().optional(),
		'terminal.foreground': colorString().optional(),
		'terminal.selectionBackground': colorString().optional(),
	}),
})

export type WindowsTerminalTheme = {
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

export async function generateWindowsTerminalTheme(
	name: string,
	vsCodeThemeJson: string,
): Promise<WindowsTerminalTheme> {
	const { colors } = await colorsSchema.parseAsync(json5.parse(vsCodeThemeJson))

	return {
		name,
		background: colors['terminal.background'] ?? colors['editor.background'],
		foreground: colors['terminal.foreground'] ?? colors['foreground'],
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
		selectionBackground:
			colors['terminal.selectionBackground'] ?? colors['editor.selectionBackground'],
	}
}
