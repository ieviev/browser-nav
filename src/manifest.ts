import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, isFirefox, port, r } from '../scripts/utils'

export async function getManifest() {
    const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

    const manifest: Manifest.WebExtensionManifest = {
        manifest_version: 3,
        name: pkg.displayName || pkg.name,
        version: pkg.version,
        description: pkg.description,
        action: {
            default_icon: './assets/icon.png',
            default_popup: './dist/popup/index.html',
        },
        // keeping this if some configuration ever needed
        options_ui: {
            page: './dist/options/index.html',
            open_in_tab: true,
        },
        background:
            isFirefox ? {
                scripts: ['dist/background/index.mjs'],
                type: 'module',
            } : { service_worker: './dist/background/index.mjs' },
        icons: {
            16: './assets/icon.png',
            48: './assets/icon.png',
            128: './assets/icon.png',
        },
        permissions: [
            'tabs',
            'storage',
            'activeTab',
            'bookmarks',
            'search',
            'scripting',
            // 'commands'
        ],
        host_permissions: ['*://*/*'],
        content_scripts: [
            {
                matches: [
                    '<all_urls>',
                ],
                js: [
                    'dist/contentScripts/index.global.js',
                ],
            },
        ],
        web_accessible_resources: [
            {
                resources: ['dist/contentScripts/style.css'],
                matches: ['<all_urls>'],
            },
        ],
        content_security_policy: {
            extension_pages: isDev
                ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
                : 'script-src \'self\'; object-src \'self\'',
        },
        commands: {
            "nav-back": {
                description: "navigate back",
                suggested_key: {
                    default: "Alt+Z"
                }
            },
            "nav-fwd": {
                description: "navigate forwards",
                suggested_key: {
                    default: "Alt+X"
                }
            },
            "left-tab": {
                description: "left tab",

            },
            "right-tab": {
                description: "right tab",

            },
            "menu-links": {
                description: "show available links",
                suggested_key: {
                    default: "Alt+S"
                }
            }
        },
        "browser_specific_settings": {
            "gecko": {
                "id": "browser-nav@ieviev.github.com"
            }
        }
    }
    return manifest
}
