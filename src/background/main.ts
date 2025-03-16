import { sendMessage } from 'webext-bridge/background'
import { commands, type Tabs } from 'webextension-polyfill'

// only on dev mode
if (import.meta.hot) {
    // @ts-expect-error for background HMR
    import('/@vite/client')
    // load latest content script
    import('./contentScriptHMR')
}

// for debugging
async function log(tab: Tabs.Tab, s: string) {
    await browser.scripting.executeScript({
        func: (s) => {
            console.log(s)
        },
        args: [s],
        target: { tabId: tab.id! }
    })
}

async function sendMsg(tab: Tabs.Tab, kind: CommandKind) {
    await sendMessage('evt', { kind: kind }, { context: 'content-script', tabId: tab.id! })
}

let commandsmap = {
    "menu-links": async (tab: Tabs.Tab) => {
        await sendMsg(tab, 'menu-links')
    },
    "nav-back": async (tab: Tabs.Tab) => {
        browser.tabs.goBack(tab.id)
    },
    "nav-fwd": async (tab: Tabs.Tab) => {
        // log(tab, "fwd")
        browser.tabs.goForward(tab.id)
    },
    "left-tab": async (tab: Tabs.Tab) => {
        let alltabs = await browser.tabs.query({});
        let toleft = alltabs.findLast(v => v.id! < tab.id!)
        if (toleft) {
            await browser.tabs.update(toleft.id, {
                active: true,
            })
        }
    },
    "right-tab": async (tab: Tabs.Tab) => {
        let alltabs = await browser.tabs.query({});
        let toright = alltabs.find(v => v.id! > tab.id!)
        if (toright) {
            await browser.tabs.update(toright.id, {
                active: true,
            })
        }
    },
} as { [key: string]: Function }

commands.onCommand.addListener((v, tab) => {
    commandsmap[v](tab);
})
