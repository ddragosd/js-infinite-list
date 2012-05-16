namespace "iList"
###
    Class responsible to load the data in a lazy manner.
       - It uses a loader to retrieve data
       - the data is then appended into the source. dataConverter function can be used to parse the returned data.
       - the loadPolicy decides when it's time to load more data

    Triggers the following events:
       - loadingData - called when starting to load new data.
       - dataLoaded - called each time after loading a new chunk of data

       TODO: discuss the need of a reset functionality ?
 ###
class iList.LazyDataProvider
    ###
        Array object with the elements in the data provider
     ###
    source:             null

    ###
        Policy by which a new load should happen
     ###
    loadPolicy :        null

    ###
        The class responsible to load data
     ###
    loader :            null

    ###
        function used to convert the data when it comes from the server
     ###
    dataConverter:      null

    ###
        This Boolean flag is an indicator that a loader returned empty results,
        and that there is no more data to load.
        When this is true, no more loading requests are processed.
     ###
    gotEmptyResults:    false

    constructor: ( options ) ->
        {@source, @loadPolicy, @loader, @dataConverter} = options
        @initialize()

    initialize: ->
        @source ?= []
        # TODO: throwIfNoLoadPolicy
        # TODO: throwIfNoLoader
        $(@loadPolicy).on("load", @loadPolicy_loadHandler)
        $(@loader).on("result", @loader_resultHandler )
        # $(@loader).on("fault", @loader_faultHandler )

    getSource:      -> @source
    getLoadPolicy:  -> @loadPolicy
    getLoader:      -> @loader

    ###
        Manually load more data
     ###
    loadMore: ->
        @loader.loadMore() if not @gotEmptyResults

    appendResult: ( result ) =>
        @gotEmptyResults = ( result.length == 0 )
        if $.isArray( @source )
            @source = @source.concat( result )
        else
            @source += result

    loadPolicy_loadHandler:  =>
        if not @gotEmptyResults
            $(this).trigger( "loadingData" )
            @loadMore()

    loader_resultHandler: ( event, data, textStatus, jqXHR ) =>
        convertedData = @dataConverter?( data )
        convertedData ?= data
        @appendResult( convertedData )
        $(this).trigger("dataLoaded", [convertedData] )