import assert from 'node:assert/strict'

export function verifyIdentity(identity, pin) {
	assert.equal(
		identity.process.version,
		pin.version,
		'Harness release differs from project pin',
	)
	const asset = pin.assets.find(asset => asset.target === identity.process.target)
	assert.ok(asset, 'No reviewed public asset for this platform')
	assert.equal(
		identity.process.executable_sha256,
		asset.sha256,
		'Executable digest differs',
	)
	assert.equal(
		identity.process.source_sha256,
		pin.source_sha256,
		'Compiled source differs',
	)
	assert.equal(identity.catalog.sha256, pin.catalog_sha256, 'Embedded catalog differs')
	assert.equal(identity.installed_binary.sha256, asset.sha256, 'Installed binary differs')
	assert.equal(identity.installed_binary.matches_process, true, 'Reconnect this client')
}
