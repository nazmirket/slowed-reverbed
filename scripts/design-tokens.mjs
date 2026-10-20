import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const call = args =>
	JSON.parse(execFileSync('mirket', [...args, '--json'], { encoding: 'utf8' }))
const status = call(['package', 'status'])
const design = status.checks.find(item => item.id === 'design' && item.ok)
if (!design)
	throw new Error('Set up the optional Mirket design package before compiling tokens')
const workspace = design.installation.workspace
const source = 'slowed-reverbed/tokens.json'
mkdirSync(join(workspace, 'slowed-reverbed'), { recursive: true })
copyFileSync('design/tokens.json', join(workspace, source))
const response = call([
	'package',
	'call',
	'design',
	'tokens_compile',
	'--arguments',
	JSON.stringify({ source }),
])
const result = response.structuredContent ?? response.result?.structuredContent
if (!result?.outputs?.['tokens.css'])
	throw new Error(`Token compilation failed: ${JSON.stringify(response)}`)
const output = join(workspace, result.outputs['tokens.css'])
if (process.argv.includes('--check')) {
	if (readFileSync(output, 'utf8') !== readFileSync('assets/css/tokens.css', 'utf8'))
		throw new Error('Run pnpm design:tokens and review the generated CSS')
} else {
	copyFileSync(output, 'assets/css/tokens.css')
}
