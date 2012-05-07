TestCase("InfiniteListTest", {

    listItemRenderer: """ <div>${data.title}</div> """

#    setUp: ->
#
#    tearDown: ->
#
#    testInitialization: ->
#        array = [ {title: 'initialElement' }];
#
#        collection = new iList.LazyDataProvider({
#            source:        array,  # source can be an array, or an HTML string
#            loadPolicy:  new iList.LazyLoadPolicy.WINDOW_SCROLL(), # new iList.LazyLoadPolicy.iSCROLL(), new iList.LazyLoadPolicy.MANUAL()
#            loader:    new iList.AjaxDataLoader({
#                                url:    "mysite.com?q='searchString'",
#                                offset: 0,
#                                rows:   15, # how many rows to get each time
#                                })
#                        })
#
#        list = new iList.InfiniteList( {
#            # VIEW configuration
#            container:              $(".listing"),
#            itemRendererTemplate:   @listItemRenderer, #jQueryTemplate to create new items
#            itemRendererFunction:   null # used instead of itemRendererTemplate to return the HTML String for new items
#            itemSelector:           null # used when the Ajax returns HTML content, instead of JSON
#
#            loader:                 '<img src="images/loader.gif"/>'
#            loaderSelector:         null # if there is another selector in the page that should be used
#
#            # DOMAIN configuration
#            dataProvider: collection
#                            })
#
#
#    testLoadingHTMLContent: ->
#        htmlSource = ""
#        collection = new iList.LazyDataProvider({
#            source:        htmlSource,
#            loadPolicy:    LazyLoadPolicy.WINDOW_SCROLL,
#            urlBuilder:    {
#                                url:    "mysite.com/page1",
#                                source: htmlSource
#                                loadMore: ->
#
#                           }
#                        })
#
#        list = new iList.InfiniteList( {
#            # VIEW configuration
#            container:              $(".listing"),
#            itemRendererTemplate:   @listItemRenderer, #jQueryTemplate to create new items
#            itemRendererFunction:   null # used instead of itemRendererTemplate to return the HTML String for new items
#            itemSelector:           null # used when the Ajax returns HTML content, instead of JSON
#
#            loader:                 '<img src="images/loader.gif"/>'
#            loaderSelector:         null # if there is another selector in the page that should be used
#
#            # DOMAIN configuration
#            dataProvider: collection
#                            })
})