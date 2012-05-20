namespace "iList.loader"

class iList.loader.AjaxDataLoader extends iList.loader.AjaxBaseLoader
    rows: 30
    offset: 0


    constructor: ( options ) ->
        super( options )
        {@rows, @offset} = options

    ###
        @Override
     ###
    getNextUrl: ->
        if ( @url.indexOf("?") < 0 )
            return "#{@url}?rows=#{@rows}&offset=#{@offset}"
        return "#{@url}&rows=#{@rows}&offset=#{@offset}"

    ###
        @Override
     ###
    processResult: ( data ) ->
        @offset += @rows

