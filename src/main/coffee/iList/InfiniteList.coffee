namespace "iList"

class iList.InfiniteList
    ###
        VIEW configuration
     ###

    ###
        The HTMLElement which will contain the list
     ###
    container:              null

    ###
        A template to create new items. Works with templateFunction
     ###
    itemRendererTemplate:   null

    ###
        A function to be called with 2 parameters: template_String, data.
        This hook eases the integration with your templating engine: Mustache.render, _.tmpl

        For instance, if you provide Mustache.render function, it will be called with
            Mustache.render( this.itemRendererTemplate, item )
        Or if you provide _.template, it will be called with
            _.template( this.itemRendererTemplate, item )
     ###
    templateFunction:       null

    ###
        if there is another selector in the page that should be used as loading indicator
     ###
    loaderSelector:         null

    ###
        DOMAIN configuration
     ###
    ###
        LazyDataProvider object
     ###
    dataProvider:           null

    _jqLoader:        null # the instance of the loader, from loaderSelector or from loaderTemplate

    constructor: (obj) ->
        {@container, @itemRendererTemplate, @templateFunction} = obj
        {@loaderTemplate, @loaderSelector} = obj

        {@dataProvider} = obj

        @throwIfDataProviderIsNull()
        @throwIfContainerIsNull()
        @throwIfNoItemRenderer()

        @initialize()

    throwIfDataProviderIsNull:  ->  throw new Error("You must provide a dataProvider") if not @dataProvider
    throwIfContainerIsNull:     ->  throw new Error("You must provide a valid container") if not @container
    throwIfNoItemRenderer:      ->
       if @itemRendererTemplate and not @templateFunction
        throw new Error("You must provide a templateFunction when providing itemRendererTemplate" )

    initialize: ->
        @container = $(@container) if not ( @container instanceof $ )

        $(@dataProvider).on("loadingData", @dataProvider_loadingDataHandler )
        $(@dataProvider).on("dataLoaded", @dataProvider_dataLoadedHandler )

        @_jqLoader = @initLoader()

    initLoader: ->
        if (  @loaderSelector )
            return $(@loaderSelector)


    loadMore: ->
        @dataProvider.loadMore()

    dataProvider_loadingDataHandler: =>
        if ( @_jqLoader )
            @_jqLoader.removeClass("loaded")
            @_jqLoader.addClass("loading")

    dataProvider_dataLoadedHandler: ( event, data ) =>
        if ( @_jqLoader )
            @_jqLoader.removeClass("loading")
            @_jqLoader.addClass("loaded")
            ###
                CSS class "end" is added to indicate there is no more data to load
             ###
            if ( data.length == 0 )
                @_jqLoader.addClass("end")
        @appendNewElements( data )


    appendNewElements: ( data ) =>
        # console?.log(data)
        if ( @dataProvider.dataType in ["json","jsonp", "xml"] )
            @appendArrayElements( data )
        else
            @appendHTMLElements( data )

    appendArrayElements: ( data ) ->
       str = ( @createNewItem( item ) for item in data ).join("")
       if ( @_jqLoader )
        @_jqLoader.before( str )
       else
        @container.append( str )

    createNewItem: ( item ) ->
       @templateFunction( @itemRendererTemplate, item )

    appendHTMLElements: ( data ) ->
        if ( @_jqLoader )
            @_jqLoader.before( elem ) for elem in data
        else
            @container.append( elem ) for elem in data