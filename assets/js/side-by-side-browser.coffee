---
---

$bw = $ '#browser'
$win = $bw.append 'div.window'
$adr = $win.append 'div.address'
$bdy = $win.append 'div.body'
$src = ($bw.append 'pre.source.html').append 'code'

$adr.textContent = 'http://.../'
$bdy.append 'h3 Bonjour, présentez-vous'
$bdy.innerHTML += '<input type="text"><button>Entrer</button>'
$src.textContent = '''
    <form method="get" action="aujourdhui">
      <h3>Bonjour, présentez-vous</h3>
      <input type="text" name="nom">
      <input type="submit" value="Entrer">
    </form>'''
hljs.highlightBlock $src

($bdy.$ 'button').on 'click', ->
  $bw.style.height = $bw.offsetHeight + 'px'
  t = ($bdy.$ 'input').value
  $adr.textContent = "http://.../aujourdhui?nom=#{t}"
  $bdy.innerHTML = ""
  $bdy.append "p Bonjour #{t}, <a href='#'>à demain</a>"
  $src.textContent = """<p>Bonjour #{t},
    <a href='demain?nom=#{t}'>à demain</a>
  </p>"""
  hljs.highlightBlock $src

  ($bdy.$ 'a').on 'click', (e) ->
    $adr.textContent = "http://.../demain?nom=#{t}"
    $bdy.innerHTML = ""
    $bdy.append "p Bonjour #{t}"
    $src.textContent = "<p>Bonjour #{t}</p>"
    hljs.highlightBlock $src
    e.preventDefault()
    false
