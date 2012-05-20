namespace "iList"
###
    Class responsible to load the data in a lazy manner.
       - It uses a loader to retrieve data
       - the data is then appended into the source. dataConverter function can be used to parse the returned data.
       - the loadPolicy decides when it's time to load more data

    Triggers the following events:
       - loadingData - called when starting to load new data.
       - dataLoaded - called each time after loading a new chunk of data

    By Default, the data is assumed to be an Array, meaning that source property is initialized as an empty Array.
    To work with HTML String, source property must be initialized with a String value, which could be empty: ""

    collection = new iList.LazyDataProvider( { source : "" } )


       TODO: discuss the need of a reset functionality ?
 ###
class iList.LazyDataProvider
    ###
        Array object with the elements in the data provider.
        It can be initialized by passing a 'source' property to the constructor object.
     ###
    source:             null

    ###
        The type of data expected from the server.
        Takes values similar to jQuery.ajax's dataType property: "json" or "jsonp" or "html"
     ###
    dataType:           "json"

    ###
        Policy by which a new load should happen
     ###
    loadPolicy :        null

    ###
        The class responsible to load data
     ###
    _loader :            null

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

    ###
        This Boolean flag is true when a request to load data is in progress.
        Only one request at a time is permitted
     ###
    isLoading:          false

    constructor: ( options ) ->
        {@source, @loadPolicy, @dataConverter} = options
        @dataType = options.dataType if options.dataType
        @initialize()
        @setLoader( options.loader )

    initialize: ->
        @setSourceIfEmpty()
        # TODO: throwIfNoLoadPolicy
        $(@loadPolicy).on("load", @loadPolicy_loadHandler)

    setSourceIfEmpty: ->
        @source ?= []

    getSource:      -> @source
    getLoadPolicy:  -> @loadPolicy
    getLoader:      -> @_loader
    setLoader: (ldr) ->
        if ( @_loader )
            $(@_loader).off("result", @loader_resultHandler)
        @_loader = ldr
        @throwIfNullLoader()
        $(@_loader).on("result", @loader_resultHandler )
        # need to decide what should be done on fault
        #$(@_loader).on("fault", @loader_faultHandler )

    throwIfNullLoader: ->
        throw new Error("You have to provide a non-null loader") if not @_loader

    reset: ->
        @source = []
        @gotEmptyResults = false

    ###
        Manually load more data
     ###
    loadMore: ->
        return if @isLoading
        @isLoading = true
        @_loader.loadMore() if not @gotEmptyResults

    appendResult: ( result ) =>
        @gotEmptyResults = ( result.length == 0 )
        if $.isArray( result ) and $.isArray( @source )
            @source = @source.concat( result )

    loadPolicy_loadHandler:  =>
        if not @gotEmptyResults
            $(this).trigger( "loadingData" )
            @loadMore()

    loader_resultHandler: ( event, data, textStatus, jqXHR ) =>
        @isLoading = false
        @processResult( data )

    processResult: ( data ) ->
        convertedData = @getConvertedData( data )
        @appendResult( convertedData )
        @triggerLoadedEvent( convertedData )

    getConvertedData: ( data ) ->
        convertedData = @dataConverter?( data )
        convertedData || data

    triggerLoadedEvent: (convertedData ) ->
        $(this).trigger("dataLoaded", [convertedData] )