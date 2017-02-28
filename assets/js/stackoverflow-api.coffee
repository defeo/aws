---
---

$('#stack').onsubmit = (submit) ->
  $('#answers').className = 'fadeout'
  
  xhr = new XMLHttpRequest()
  query = $('#query').value
  qs = ("#{k}=#{encodeURIComponent(v)}" for k,v of {
    q: query
    order: 'desc',
    sort: 'activity',
    site: 'stackoverflow'
  }).join('&')
  xhr.open 'GET', 'https://api.stackexchange.com/2.2/search/advanced?' + qs

  xhr.responseType = 'json'
  xhr.onload = ->
    if not xhr.response?.items?.length
      $('#answers').innerHTML = '<p>Pas de résultats.</p>'
    else
      $('#answers').innerHTML = ''
      ul = $('#answers').append 'ul'
      for q in xhr.response.items
        ((ul.append 'li').append "a #{q.title}").href = "?#{q.question_id}"
    $('#answers').className = 'fadein'

  # Necessary to wait for transition end
  # (too lazy to handle the transitionend event)
  setTimeout ( ->
    xhr.send()
  ), 2000
  
  submit.preventDefault()
        
$('#answers').addEventListener 'click', (e) ->
  console.log e.target.tagName
  if e.target.tagName == 'A'
    $('#answers').className = 'fadeout'
    xhr = new XMLHttpRequest()
    id = (e.target.href.match /\?([0-9]+)$/)[1]
    xhr.open 'GET', "https://api.stackexchange.com/2.2/questions/#{id}?site=stackoverflow&filter=withbody"
    
    xhr.responseType = 'json'
    xhr.onload = ->
      q = xhr.response?.items?[0]
      if not q
        $('#answers').innerHTML = '<p>Pas de résultats.</p>'
      else
        $('#answers').innerHTML = ''
        $('#answers').append "h3 #{q.title}"
        $('#answers').innerHTML += q.body
        
      $('#answers').className = 'fadein'

    # Necessary to wait for transition end
    # (too lazy to handle the transitionend event)
    setTimeout ( ->
      xhr.send()
    ), 2000

    console.log "yo"
    e.preventDefault()
