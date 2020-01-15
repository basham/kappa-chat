import kappa from 'kappa-core'
//import list from 'kappa-view-list'
//import level from 'level-mem'
import ram from 'random-access-memory'
import { adoptStyles, define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject, debug, fromEventSelector, useSubscribe } from '../util/rx.js'
import styles from './chatter-root.css'

adoptStyles(styles)

// Enable :active styles in iOS Safari.
// https://css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/
document.addEventListener('touchstart', () => {}, true)

//
// Kapp
//
//const idx = level()
//const chatView = list(idx, (msg, next) => {
//  if (msg.value.type !== 'chat-message') return next()
//  next(null, [ msg.value.timestamp ])
//})

//const core = kappa(ram, { valueEncoding: 'json' })
//core.use('chat', chatView)

//
// Component
//
define('chatter-root', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()

  const send$ = fromEventSelector(el, 'form[data-send]', 'submit').pipe(
    debug('##')
  )
  
  subscribe(send$)

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
    <form data-send>
      <textarea name='message' data-message></textarea>
      <button type='submit'>Send</button>
    </form>
  `
}
