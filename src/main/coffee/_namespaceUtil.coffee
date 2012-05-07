###
Save a reference to the global object (window in the browser, global on the server).
 ###
root = this


###
 Utility to create a particular namespace for Log4JScript
 ###
window.namespace = (_name) ->
 createPackage = (_parentPkg, _src) ->
  _parentPkg[_src] = _parentPkg[_src] or new Object()

 spc = _name.split(".")
 currentPkg = root
 ###
    The top-level namespace.
    All public namespace classes and modules will be attached to this.
    Exported for both CommonJS and the browser.
  ###
 if ( typeof exports != 'undefined' )
    firstSpace = spc.shift()
    currentPkq = exports

 currentPkg=createPackage(currentPkg, subPackage) for subPackage in spc
 return null

