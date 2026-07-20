# QuickConnectionToggle

A [Vencord](https://github.com/Vendicated/Vencord) plugin that lets you toggle "Display as status" for your connected accounts directly from the account panel — no more digging through Settings → Connections.

## Features

- Toggle connections from a right-click menu on the account panel, or via a dedicated button in the profile bar — configurable in plugin settings
- Automatically filters out connections that don't support "Display as status" (e.g. GitHub), so the list only shows actionable items
- Supports all platforms that Discord supports for activity status (Spotify, PlayStation, Steam, Twitch, Xbox, etc.)
- Optimistic UI updates — the menu reflects changes immediately on next open

## Settings

| Setting | Description |
|---|---|
| **Trigger** | Right-click account panel (requires AccountPanelServerProfile) or button in profile bar |
| **Hide unsupported** | Only show connections that have a "Display as status" toggle — hides platforms like GitHub that only offer "Display on profile" |

## Installation

This is a user plugin and must be installed in a custom Vencord build.

1. Clone or copy `index.tsx` into your Vencord `src/userplugins/quickConnectionToggle/` directory
2. Build Vencord: `pnpm build`
3. Enable **QuickConnectionToggle** in Vencord settings

> For **right-click mode**, also enable the `AccountPanelServerProfile` plugin (it provides the account panel context menu).

## Usage

**Right-click mode:** Right-click your account panel (bottom-left) → "Show as Status" section with toggleable checkboxes.

**Profile bar mode:** A link icon appears next to the mute/deafen buttons — click it to open the connection toggles.

## Roadmap

- **Connection icons** — display platform icons next to connection names in the menu

## License

[GPL-3.0-or-later](LICENSE)
