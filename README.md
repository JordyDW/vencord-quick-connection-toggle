# QuickConnectionToggle

A [Vencord](https://github.com/Vendicated/Vencord) plugin that lets you toggle "Display as status" for your connected accounts directly from the account panel — no more digging through Settings → Connections.

## Features

- Toggle connection statuses from a button in the profile bar or a right-click menu on the account panel — configurable in plugin settings
- Platform icons and linked account names shown in the menu (e.g. Spotify · jordy123)
- Enable All / Disable All to toggle every connection at once
- Button glows red when no connection status is active
- Automatically filters out connections that don't support "Display as status" (e.g. GitHub, Steam)
- Checkboxes update instantly — no need to close and reopen
- "Manage Connections" shortcut to jump directly to Settings → Connections
- Error toast if a toggle fails

## Settings

| Setting | Description |
|---|---|
| **Trigger** | Profile bar button (default) or right-click account panel (requires AccountPanelServerProfile) |
| **Show account name** | Show the linked account name alongside the platform name in the menu |

## Installation

This is a user plugin and must be installed in a custom Vencord build.

1. Clone or copy `index.tsx` into your Vencord `src/userplugins/quickConnectionToggle/` directory
2. Build Vencord: `pnpm build`
3. Enable **QuickConnectionToggle** in Vencord settings

> For **right-click mode**, also enable the `AccountPanelServerProfile` plugin (it provides the account panel context menu).

## Usage

**Profile bar mode** (default): A link icon appears next to the mute/deafen buttons. Click it to open the connection toggles. Click it again to close. The button glows red when no status is active.

**Right-click mode:** Right-click your account panel (bottom-left) → "Show as Status" section with toggleable checkboxes.

## Supported platforms

Only platforms that Discord supports "Display as status" for are shown:

- **Spotify**
- **PlayStation Network**

> Xbox is excluded — Discord's own API returns a server error when toggling `show_activity` for Xbox connections, even from Discord's native settings UI.

## License

[GPL-3.0-or-later](LICENSE)
