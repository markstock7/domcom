{txt, p, see} = dc

module.exports = ->
  counter$ = see(counter = 0)
  comp = p(txt1=txt(counter$))
  comp.on 'willAttach', ->
    count = ->
      counter$(counter++)
      if counter==1000 then clearInterval countHandle
    countHandle = setInterval count, 1
  dc.updateWhen(setInterval, {interval:16, clear: -> counter>=1000})
  comp
