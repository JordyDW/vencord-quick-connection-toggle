#!/usr/bin/env bash
set -e

VENCORD_DIR="$HOME/vencord"
VESKTOP_DIR="$HOME/.config/vesktop/sessionData/vencordFiles"

echo "Building..."
(cd "$VENCORD_DIR" && pnpm build)

echo "Deploying to Vesktop..."
cp "$VENCORD_DIR/dist/vencordDesktop"* "$VESKTOP_DIR/"

echo "Done. Restart Vesktop to apply changes."
