import fs from 'node:fs/promises'
import * as prettier from 'prettier'
import { fileURLToPath } from 'node:url'

// Resolve the path to wrangler.json
const wranglerPath = fileURLToPath(new URL('../wrangler.json', import.meta.url))

// Read the current content of wrangler.json
const wranglerContent = await fs.readFile(wranglerPath, 'utf-8')
const wranglerConfig = JSON.parse(wranglerContent)

// Get the current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0]

// Update the compatibility_date
wranglerConfig.compatibility_date = currentDate

// Write the updated content back to wrangler.json
await writeJson(wranglerPath, wranglerConfig)

console.log(`Updated compatibility_date to ${currentDate}`)

async function writeJson(filepath, data) {
	const config = await prettier.resolveConfig(filepath)
	let code = JSON.stringify(data, null, 2)
	code = await prettier.format(code, {
		filepath,
		...config,
	})
	await fs.writeFile(filepath, code, 'utf-8')
}
