export function secToStr(sec) {
  var h = sec/3600 ^ 0
  var m = (sec-h*3600)/60 ^ 0
  var s = sec-h*3600-m*60
  //var durationStr = (h<10?"0"+h:h)+" ч. "+(m<10?"0"+m:m)+" мин. "+(s<10?"0"+s:s)+" сек."
  var durationStr = (h>0?h+" ч. ":"")+(m>0?m+" мин. ":"")+(s+" сек.")

  return durationStr
}

export function ISODateString(d) {
  function pad(n){return n<10 ? '0'+n : n}
  return d.getFullYear()+'-'
      + pad(d.getMonth()+1)+'-'
      + pad(d.getDate()) +' '
      + pad(d.getHours())+':'
      + pad(d.getMinutes())+':'
      + pad(d.getSeconds())
}