import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import {
	generateWindowsTerminalTheme,
	WindowsTerminalTheme,
} from '../../lib/generateWindowsTerminalTheme'

export type ApiResult = WindowsTerminalTheme

export default async function generate(
	req: NextApiRequest,
	res: NextApiResponse<ApiResult | { error: string }>,
): Promise<void> {
	if (req.method !== 'POST') {
		res.status(405).end()
		return
	}

	try {
		const body = await z
			.object({ colorTheme: z.string(), themeName: z.string() })
			.parseAsync(req.body)

		const windowsTerminalTheme = await generateWindowsTerminalTheme(
			body.themeName,
			body.colorTheme,
		)

		return res.json(windowsTerminalTheme)
	} catch (err) {
		return res
			.status(400)
			.json({ error: err instanceof Error ? err.message : String(err) })
	}
}
