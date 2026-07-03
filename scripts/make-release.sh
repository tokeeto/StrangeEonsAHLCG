#!/usr/bin/env bash
#
# make-release.sh — publish the Arkham Horror LCG Strange Eons plugin to GitHub Releases.
#
# The built plugin bundle (ArkhamHorrorLCG/ArkhamHorrorLCG.seext) is NOT tracked in git.
# Build it first in Strange Eons (open the plugin folder as a project, then
# "Make Bundle"), then run this script to attach it to a versioned GitHub Release.
#
# Usage:
#   scripts/make-release.sh <version>
#
# Examples:
#   scripts/make-release.sh 1.2.3
#   scripts/make-release.sh v1.2.3      # a leading "v" is accepted and normalised
#
# Requirements: the GitHub CLI (https://cli.github.com/), authenticated once via
# `gh auth login`.

set -euo pipefail

# --- Config ----------------------------------------------------------------
# Release title prefix. The tag (e.g. "v1.2.3") is appended to form the title,
# e.g. "Strange Eons Arkham Horror LCG plugin v1.2.3".
TITLE_PREFIX="Strange Eons Arkham Horror LCG plugin"

# Path to the built bundle, relative to the repository root.
SEEXT_RELPATH="ArkhamHorrorLCG/ArkhamHorrorLCG.seext"

# --- Parse arguments -------------------------------------------------------
if [[ $# -ne 1 ]]; then
  echo "Usage: $(basename "$0") <version>   e.g. $(basename "$0") 1.2.3" >&2
  exit 1
fi

# Normalise: strip a leading "v", then build the tag as vX.Y.Z.
version="${1#v}"
if [[ -z "$version" ]]; then
  echo "Error: version must not be empty." >&2
  exit 1
fi
tag="v${version}"
title="${TITLE_PREFIX} ${tag}"

# --- Locate the bundle at the repository root ------------------------------
repo_root="$(git rev-parse --show-toplevel)"
seext_path="${repo_root}/${SEEXT_RELPATH}"

if [[ ! -f "$seext_path" ]]; then
  echo "Error: bundle not found at ${seext_path}" >&2
  echo "Build it in Strange Eons first (open the plugin folder as a project, then \"Make Bundle\")." >&2
  exit 1
fi

# --- Preflight -------------------------------------------------------------
if ! command -v gh >/dev/null 2>&1; then
  echo "Error: the GitHub CLI (gh) is not installed. See https://cli.github.com/" >&2
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "Error: not authenticated with GitHub. Run: gh auth login" >&2
  exit 1
fi

# Repository slug (owner/name) for the confirmation message — derived so the
# script keeps working on forks.
repo_slug="$(gh repo view --json nameWithOwner --jq .nameWithOwner 2>/dev/null || echo "tokeeto/StrangeEonsAHLCG")"

# --- Boilerplate release notes ---------------------------------------------
notes="$(cat <<EOF
Strange Eons extension for **Arkham Horror: The Card Game**.

### Install
1. Download \`ArkhamHorrorLCG.seext\` from the **Assets** below.
2. Open Strange Eons and drag the file into the window to install it.

See the [README](https://github.com/${repo_slug}#readme) for full usage and contribution details.
EOF
)"

# --- Create (or update) the release ----------------------------------------
if gh release view "$tag" >/dev/null 2>&1; then
  echo "Release ${tag} already exists on ${repo_slug} — replacing its bundle asset…"
  gh release upload "$tag" "$seext_path" --clobber
else
  echo "Creating release ${tag} on ${repo_slug}…"
  gh release create "$tag" "$seext_path" \
    --title "$title" \
    --notes "$notes" \
    --latest
fi

echo "Done: ${title}"
echo "Latest download URL: https://github.com/${repo_slug}/releases/latest/download/ArkhamHorrorLCG.seext"
