# QuickConnectionToggle

A [Vencord](https://github.com/Vendicated/Vencord) plugin that lets you toggle "Display as status" for your connected accounts directly from the account panel right-click menu — no more digging through Settings → Connections.

## Features

- Toggle any connection's "Show as status" from the account panel context menu
- Supports all Discord-supported platforms (Spotify, PlayStation, Steam, Twitch, etc.)
- Optimistic UI updates — the menu reflects changes immediately on next open

## Installation

This is a user plugin and must be installed in a custom Vencord build.

1. Clone or copy `index.tsx` into your Vencord `src/userplugins/quickConnectionToggle/` directory
2. Build Vencord: `pnpm build`
3. Enable **QuickConnectionToggle** in Vencord settings

> **Requires** the `AccountPanelServerProfile` plugin to be enabled (it provides the account panel right-click menu).

## Usage

Right-click your account panel (bottom-left) → the "Show as Status" section lists all your connected accounts as toggleable checkboxes.

## Roadmap

- **Filter by status support** — only show connections that actually support "Display as status" in the menu. Some platforms (e.g. GitHub) only offer "Display on profile" and currently appear in the list despite the toggle having no effect.
- **Settings panel** — a plugin settings screen with options including:
  - *Trigger* — choose between right-clicking the account panel (current default) or showing toggles directly in the profile bar without a context menu
  - *Hide unsupported connections* — toggle whether connections without status support are shown or hidden
  - *Show connection icons* — display platform icons next to connection names in the menu

## License

[GPL-3.0-or-later](LICENSE)
