namespace "iList"
###
    Class responsible to load the data in a lazy manner.
       - It uses an loader to load more data the data
       - the data is then appended into the source. dataConverter function can be used to parse the returned data.
       - the loadPolicy decides when it's time to load more data

    Triggers the following events:
       - loadingData - called when starting to load new data.
       - dataLoaded - called each time after loading a new chunk of data

       TODO: discuss the need of a reset functionality ?
 ###
class iList.LazyDataProvider
    source: null
    loadPolicy : null
    loader : null
    # function used to convert the data when it comes from the server
    dataConverter: null

    constructor: ( options ) ->
        {@source, @loadPolicy, @loader, @dataConverter} = options
        @initialize()

    initialize: ->
        $(@loadPolicy).on("load", @loadPolicy_loadHandler)
        $(@loader).on("result", @loader_resultHandler )
        # $(@loader).on("fault", @loader_faultHandler )

    getSource: -> @source

    appendResult: ( result ) =>
        if $.isArray( @source )
            @source = @source.concat( result )
        else
            @source += result

    loadPolicy_loadHandler:  =>
        $(this).trigger( "loadingData" )
        @loader.loadMore()

    loader_resultHandler: ( event, data, textStatus, jqXHR ) =>
        convertedData = @dataConverter?( data )
        @appendResult( convertedData || data )
        $(this).trigger("dataLoaded", data )