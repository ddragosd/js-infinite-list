namespace "iList.loader"

class iList.loader.AjaxDataLoader
    url: null
    rows: 30
    offset: 0

    _xhr: null

    constructor: ( options ) ->
        {@url, @rows, @offset} = options

    loadMore: ->
        if ( @_xhr )
            @clearHandlers()
            @_xhr.abort()

        @_xhr = $.get( @url, { rows: @rows, offset: @offset } )
        @_xhr.done( @doneHandler )
        @_xhr.fail( @failHandler )

    doneHandler: ( data, textStatus, jqXHR ) =>
        @offset += @rows
        $(this).trigger("result", [data, textStatus, jqXHR] )
        @clearHandlers()

    failHandler: ( data, textStatus, jqXHR ) =>
        $(this).trigger("fault", [data, textStatus, jqXHR] )
        @clearHandlers()

    clearHandlers: () =>
        $(@_xhr).off()
