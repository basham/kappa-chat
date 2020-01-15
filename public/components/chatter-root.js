import { adoptStyles, define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject, useSubscribe } from '../util/rx.js'
import styles from './chatter-root.css'

adoptStyles(styles)

// Enable :active styles in iOS Safari.
// https://css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/
document.addEventListener('touchstart', () => {}, true)

define('chatter-root', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const render$ = combineLatestObject({
  }).pipe(
    renderComponent(el, render)
  )
  subscribe(render$)

  return unsubscribe
})

function render (props) {
  return html`
    <h1>Chatter</h1>
    <chatter-upgrader />
  `
}
