namespace "iList.loader"

class iList.loader.AjaxBaseLoader
    url: null

    _xhr: null

    constructor: ( options ) ->
        {@url} = options

    getNextUrl: ->  "#{@url}"
    getXhr: ->      $.get( @getNextUrl() )

    loadMore: ->
        if ( @_xhr )
            @_clearHandlers()
            @_xhr.abort()

        @_xhr = @getXhr()
        @_xhr.done( @_doneHandler )
        @_xhr.fail( @_failHandler )
        
    processResult: ( data ) ->
        return null

    _doneHandler: ( data, textStatus, jqXHR ) =>
        @processResult()
        $(this).trigger("result", [data, textStatus, jqXHR] )
        @_clearHandlers()

    _failHandler: ( data, textStatus, jqXHR ) =>
        $(this).trigger("fault", [data, textStatus, jqXHR] )
        @_clearHandlers()

    _clearHandlers: () =>
        $(@_xhr).off()
