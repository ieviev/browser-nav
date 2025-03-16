/* eslint-disable no-console */
import { onMessage } from 'webext-bridge/content-script'
import { createApp } from 'vue'
import App from './views/App.vue'


function createContainer(props: { entries: ContainerEntry[]; onSelected: Function, getElement: Function }) {
    const container = document.createElement('div')
    container.id = __NAME__
    const root = document.createElement('div')
    const styleEl = document.createElement('link')
    const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    shadowDOM.appendChild(styleEl)
    shadowDOM.appendChild(root)
    document.body.appendChild(container)
    const app = createApp(App, props)
    app.mount(root);
    (app._component as any).methods.setUnmount(app.unmount);
    window.onkeydown = (x => {
        if (x.key === 'Escape') {
            app.unmount()
        }
    })
    return app;
}

(() => {
    onMessage('evt', ({ data }) => {
        switch (data.kind) {
            case 'menu-links': {
                let links = document.getElementsByTagName('a');
                const entries = [];

                for (var i = 0; i < links.length; i++) {
                    var name = links[i].text;
                    if (/\S/.test(name)) {
                        var href = links[i].getAttribute("href");
                        var title = `${name} (${href})`
                        entries.push({
                            name: name,
                            description: title,
                            index: i,
                        })
                    }
                }
                createContainer({
                    entries: entries,
                    onSelected: (index: number) => links[index].click(),
                    getElement: (index: number) => links[index],
                })
                break;
            }
            default: 
                break;
        }
    })
})()
