namespace "iList.loader"

class iList.loader.AjaxPageLoader extends iList.loader.AjaxBaseLoader
    page: 1

    constructor: ( options ) ->
        super( options )
        @page = options.page if options.page

    ###
        @Override
     ###
    getNextUrl: ->
        "#{@url}/#{@page}"


    ###
        @Override
     ###
    processResult: ( data ) ->
        @page += 1
