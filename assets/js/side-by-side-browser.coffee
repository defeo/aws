---
---

$bw = $ '#browser'
$win = $bw.append 'div.window'
$adr = $win.append 'div.address'
$bdy = $win.append 'div.body'
$src = ($bw.append 'pre.source.highlight')

$adr.textContent = 'http://.../'
$bdy.append 'h3 Hello, please introduce yourself'
$bdy.innerHTML += '<input type="text"><button>Enter</button>'
$src.innerHTML = ($ '#today pre').innerHTML

($bdy.$ 'button').on 'click', ->
  $bw.style.height = $bw.offsetHeight + 'px'
  t = ($bdy.$ 'input').value
  $adr.textContent = "http://.../today?name=#{t}"
  $bdy.innerHTML = ""
  $src.innerHTML = ($ '#tomorrow pre').innerHTML
  ($src.$ 'code').childNodes.forEach (n) ->
          n.textContent = n.textContent.replace '#name', t
  $bdy.innerHTML = $src.textContent

  ($bdy.$ 'a').on 'click', (e) ->
    $adr.textContent = "http://.../tomorrow?name=#{t}"
    $bdy.innerHTML = ""
    $src.innerHTML = ($ '#then pre').innerHTML
    ($src.$ 'code').childNodes.forEach (n) ->
            n.textContent = n.textContent.replace '#name', t
    $bdy.innerHTML = $src.textContent
    e.preventDefault()
    false
