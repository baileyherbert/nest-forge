#!/usr/bin/env bash
set -euo pipefail

: "${RELEASE_VERSION:?RELEASE_VERSION is required (e.g. 1.2.3)}"

VERSION="${RELEASE_VERSION}"
ACCESS_FLAG="${NPM_ACCESS_FLAG:-}"

unset NODE_AUTH_TOKEN

mapfile -t PKGS < <(node scripts/list-workspaces.mjs)

for NAME in "${PKGS[@]}"; do
	echo "==> ${NAME}@${VERSION}"

	# Skip if already published
	if npm view "${NAME}@${VERSION}" version >/dev/null 2>&1; then
		echo "Already published, skipping..."
		continue
	fi

	# If the package doesn't exist at all, OIDC publish will fail unless it's bootstrapped.
	if npm view "${NAME}" version >/dev/null 2>&1; then
		echo "Publishing with OIDC..."
		unset NODE_AUTH_TOKEN
		npm publish --workspace "${NAME}" --provenance ${ACCESS_FLAG}
	else
		echo "ERROR: ${NAME} is not on npm yet."
		echo "Run a one-time bootstrap publish and then configure trusted publishing for ${NAME}."
		echo "Once finished, you can safely re-run this script to resume publishing."
		exit 1
	fi
done

echo "Finished publishing packages"
exit 0
