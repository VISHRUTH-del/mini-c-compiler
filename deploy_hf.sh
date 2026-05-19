#!/usr/bin/env bash
set -euo pipefail

current_branch="$(git branch --show-current)"
current_ref="$(git rev-parse HEAD)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit them before deploying." >&2
  git status --short
  exit 1
fi

cleanup() {
  git switch "$current_branch" >/dev/null
  git branch -D hf-deploy >/dev/null 2>&1 || true
}
trap cleanup EXIT

git switch --orphan hf-deploy
git rm -r --cached . >/dev/null 2>&1 || true
git restore --source "$current_ref" -- Dockerfile README.md LICENSE .gitignore web_server.py web src examples

git add Dockerfile README.md LICENSE .gitignore web_server.py web src examples
git commit -m "Deploy web-only compiler"
git push hf hf-deploy:main --force

echo "Deployed to Hugging Face Spaces."
