---
---

($$ '.always-on > :first-child').forEach (x) -> x.append 'i.fa.fa-caret-right.toggler'
($$ '.collapsible').forEach (x) ->
    tog = x.$ '.toggleable'
    x.dataset.height = tog.scrollHeight
    x.check = (() ->
        @classList.remove 'collapsed'
        tog.css { height: x.dataset.height + 'px' }
    ).bind(x)
    x.uncheck = (() ->
        @classList.add 'collapsed'
        tog.css { height: '0px' }
    ).bind(x)
    x.toggle = (() ->
        cpsd = x.classList.toggle 'collapsed'
        tog.css
            height: if cpsd then '0px' else x.dataset.height + 'px'
    ).bind(x)
    x.$('.always-on').on 'click', x.toggle.bind(x)

hash = () -> if document.location.hash
    ($$ ((document.location.hash.substr 1).split(',').map (x) -> "##{x}").join ',').forEach (x) ->
        x.check()

window.on 'hashchange', hash
document.on 'DOMContentLoaded', hash
