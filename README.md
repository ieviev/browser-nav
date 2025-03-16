Demo:

https://github.com/user-attachments/assets/47ba58d4-f1a9-4379-b5c3-e1aea90758f5

Features:
- search window for all links in a web-page
- works on both chromium and firefox based browsers
- reveals and underlines the link in the document
- case-insensitive filter for words in the query
- `Enter` clicks the link / `Escape` exits the search
- also viable just to navigate around the page with it
- includes some other basic browser navigation shortcuts

--- 

#### Included:

![image](https://github.com/user-attachments/assets/8548ce0f-bb63-4f3a-9369-da5b8854b61e)

- left/right tab: changes the current browser tab to left/right
- navigate back/forward: moves back/forward to last page visited
- show available links: creates search window for all links on the page

links menu binds:
| key | action |
| - | - |
| up/down | position +/- 1 |
| left/right | position +/- 7 |
| escape | exit menu |
| enter | click the link |

#### Installation

go to either `chrome://extensions/` on chromium or `about:addons` and Extensions tab on firefox and drag the extension zip to the window, dont forget to set up shortcuts as well.

--- 

#### Rant

After endless browser hopping between chromium, blue firefox, vivaldi, qutebrowser, zen, brave, librewolf, waterfox or whatever i learned that what i need doesn't have to be built in the browser at all. All i do every single day is look up documentation and the main problem i have with the humble web browser is that it's just not designed for user experience. There's so many different browsers out there but very few of them touch anything except the visuals or hardening privacy. So this is a solution to that across all browsers. Also an added feature perhaps (relative to other browsers) is that i'm not trying to sell you anything and this is just something i found useful. You're welcome!

#### Building from source

install node dependencies: `npm install`

Chromium:
```sh
npm run build-chrome
npm run pack:zip
```

Firefox:
```sh
npm run build-firefox
npm run pack:zip
```



