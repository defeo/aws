---
---

($$ '.mock-browser').forEach (mock) ->
    address = mock.append 'form'
    src = address.append 'input'
    src.type = 'text'
    do (x = address.append 'input') ->
        x.type = 'submit'
        x.value = '→'
    win = mock.append 'iframe.mock-window'
    if mock.dataset.sandbox?
        win.sandbox = mock.dataset.sandbox
    cb = window[mock.dataset.callback] ? (x) -> x
    if mock.dataset.src?
        win.src = (cb src.value = mock.dataset.src) ? ''

    address.on 'submit mock-custom', (e) ->
        dest = cb src.value
        win.src = dest if dest
        e.preventDefault()
    
    address.css
        display : 'flex'
    src.css
        flex    : '1 1 auto'
    win.css
        display : 'block'
        width   : '100%'
        height  : mock.dataset.height ? 'auto'

($$ 'a.mock-jump').forEach (a) ->
    address = $ "##{a.dataset['target']} > form"
    src = address.$ 'input[type="text"]'
    a.on 'click', (e) ->
        src.value = a.href
        address.dispatchEvent new Event 'mock-custom'
        e.preventDefault()
