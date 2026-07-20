/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenus";
import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin, { OptionType } from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { ContextMenuApi, Menu, RestAPI, useState } from "@webpack/common";

interface ConnectedAccountFull {
    id: string;
    name: string;
    type: string;
    show_activity: boolean;
    visibility: number;
    verified: boolean;
}

// Connection types that support "Display as status"
// Platforms like GitHub only support "Display on profile" and are excluded
const SHOW_ACTIVITY_SUPPORTED = new Set([
    "spotify", "steam", "twitch", "youtube", "xbox",
    "leagueoflegends", "riotgames", "battlenet", "epicgames",
    "playstation", "psn", "playstation-stg",
]);

const PLATFORM_NAMES: Record<string, string> = {
    "amazon-music": "Amazon Music",
    battlenet: "Battle.net",
    bungie: "Bungie.net",
    crunchyroll: "Crunchyroll",
    domain: "Domain",
    ebay: "eBay",
    epicgames: "Epic Games",
    facebook: "Facebook",
    github: "GitHub",
    instagram: "Instagram",
    leagueoflegends: "League of Legends",
    mastodon: "Mastodon",
    paypal: "PayPal",
    playstation: "PlayStation Network",
    "playstation-stg": "PlayStation Network",
    psn: "PlayStation Network",
    reddit: "Reddit",
    riotgames: "Riot Games",
    roblox: "Roblox",
    samsung: "Samsung",
    skype: "Skype",
    soundcloud: "SoundCloud",
    spotify: "Spotify",
    steam: "Steam",
    tiktok: "TikTok",
    twitch: "Twitch",
    twitter: "Twitter / X",
    twitter_legacy: "Twitter",
    xbox: "Xbox",
    youtube: "YouTube",
};

const settings = definePluginSettings({
    trigger: {
        type: OptionType.SELECT,
        description: "How to access the connection toggles",
        options: [
            { label: "Right-click account panel (requires AccountPanelServerProfile)", value: "rightClick", default: true },
            { label: "Button in profile bar", value: "profileButton" },
        ],
    },
});

let cachedConnections: ConnectedAccountFull[] = [];

function getVisibleConnections() {
    return cachedConnections.filter(c => SHOW_ACTIVITY_SUPPORTED.has(c.type));
}

async function fetchConnections() {
    try {
        const { body } = await RestAPI.get({ url: "/users/@me/connections" });
        if (Array.isArray(body)) cachedConnections = body as ConnectedAccountFull[];
    } catch (e) {
        console.error("[QuickConnectionToggle] Failed to fetch connections:", e);
    }
}

async function toggleActivity(account: ConnectedAccountFull) {
    const newValue = !account.show_activity;

    cachedConnections = cachedConnections.map(c =>
        c.type === account.type && c.id === account.id
            ? { ...c, show_activity: newValue }
            : c
    );

    try {
        await RestAPI.patch({
            url: `/users/@me/connections/${account.type}/${account.id}`,
            body: { show_activity: newValue },
        });
    } catch (e) {
        console.error("[QuickConnectionToggle] Failed to update connection:", e);
        await fetchConnections();
    }
}

function ConnectionsMenu() {
    const [connections, setConnections] = useState(() => getVisibleConnections());

    async function toggle(account: ConnectedAccountFull) {
        const newValue = !account.show_activity;
        setConnections(prev => prev.map(c =>
            c.type === account.type && c.id === account.id
                ? { ...c, show_activity: newValue }
                : c
        ));
        await toggleActivity(account);
    }

    return (
        <Menu.Menu navId="vc-qct-panel" onClose={ContextMenuApi.closeContextMenu}>
            <Menu.MenuGroup label="Show as Status">
                {connections.map(account => (
                    <Menu.MenuCheckboxItem
                        key={`${account.type}-${account.id}`}
                        id={`quick-conn-${account.type}-${account.id}`}
                        label={PLATFORM_NAMES[account.type] ?? account.name}
                        checked={account.show_activity}
                        action={() => toggle(account)}
                    />
                ))}
            </Menu.MenuGroup>
        </Menu.Menu>
    );
}

// Injected into the right-click menu created by AccountPanelServerProfile
const accountPanelMenuPatch: NavContextMenuPatchCallback = children => {
    if (settings.store.trigger !== "rightClick") return;
    const connections = getVisibleConnections();
    if (!connections.length) return;

    children.push(
        <Menu.MenuSeparator />,
        <Menu.MenuGroup label="Show as Status">
            {connections.map(account => (
                <Menu.MenuCheckboxItem
                    key={`${account.type}-${account.id}`}
                    id={`quick-conn-${account.type}-${account.id}`}
                    label={PLATFORM_NAMES[account.type] ?? account.name}
                    checked={account.show_activity}
                    action={() => toggleActivity(account)}
                />
            ))}
        </Menu.MenuGroup>
    );
};

const PanelButton = findComponentByCodeLazy(".GREEN,positionKeyStemOverride:");

function ConnectionIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7H13V9H17C18.65 9 20 10.35 20 12C20 13.65 18.65 15 17 15H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7ZM11 15H7C5.35 15 4 13.65 4 12C4 10.35 5.35 9 7 9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15ZM8 13H16V11H8V13Z" />
        </svg>
    );
}

function ConnectionsPanelButton(props: { nameplate?: any; }) {
    const { trigger } = settings.use(["trigger"]);
    if (trigger !== "profileButton") return null;
    if (!getVisibleConnections().length) return null;

    return (
        <PanelButton
            tooltipText="Toggle Connection Status"
            icon={ConnectionIcon}
            role="button"
            plated={props?.nameplate != null}
            onClick={(e: React.MouseEvent) => ContextMenuApi.openContextMenu(e, () => <ConnectionsMenu />)}
        />
    );
}

export default definePlugin({
    name: "QuickConnectionToggle",
    description: "Toggle 'show as status' for connections from the account panel. Right-click mode requires AccountPanelServerProfile.",
    authors: [{ name: "jordy", id: 0n }],
    tags: ["Connections", "Status", "Utility"],
    dependencies: ["ContextMenuAPI"],
    settings,

    contextMenus: {
        "vc-ap-server-profile": accountPanelMenuPatch,
    },

    patches: [
        {
            find: "#{intl::USER_PROFILE_ACCOUNT_POPOUT_BUTTON_A11Y_LABEL}",
            replacement: {
                match: /children:\[(?=.{0,25}?accountContainerRef)/,
                replace: "children:[$self.ConnectionsPanelButton(arguments[0]),"
            }
        }
    ],

    flux: {
        USER_CONNECTION_UPDATE: fetchConnections,
        USER_CONNECTIONS_UPDATE: fetchConnections,
    },

    async start() {
        await fetchConnections();
    },

    ConnectionsPanelButton: ErrorBoundary.wrap(ConnectionsPanelButton, { noop: true }),
});
