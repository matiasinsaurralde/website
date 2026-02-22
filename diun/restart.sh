#!/bin/sh
set -eu

TARGET_IMAGE="ghcr.io/matiasinsaurralde/website:latest"

if [ "${DIUN_ENTRY_STATUS:-}" != "update" ] && [ "${DIUN_ENTRY_STATUS:-}" != "new" ]; then
  exit 0
fi

if [ "${DIUN_ENTRY_IMAGE:-}" != "$TARGET_IMAGE" ]; then
  exit 0
fi

if command -v docker >/dev/null 2>&1; then
  docker compose pull website
  docker compose up -d --no-deps website
  exit 0
fi

echo "docker CLI not available in diun container" >&2
exit 1
