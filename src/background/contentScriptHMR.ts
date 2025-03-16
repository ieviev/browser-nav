import { isFirefox, isForbiddenUrl } from '~/env'

browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
  if (frameId !== 0)
    return

  if (isForbiddenUrl(url))
    return

  // inject the latest scripts
  browser.tabs.executeScript(tabId, {
    file: `${isFirefox ? '' : '.'}/dist/contentScripts/index.global.js`,
    runAt: 'document_end',
  }).catch(error => console.error(error))
})
