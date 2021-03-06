AsyncTestCase("InfiniteListTest", {
    listEl : null
    server: null
    collection: null
    list: null

    itemRendererTemplate: """<div>{{title}}</div> """
    loaderTemplate: """<img id="listLoader" src="images/loader.gif"//>"""

    arrayResponse: [ {title:"t1"}, {title:"t2"}, {title:"t3"} ]
    emptyResponse: []
    objResponse: {}


    setUp: ->
        $("body").append("""<div class="listing"></div>""")
        @listEl = $(".listing")
        @listEl.append("""<img id="listLoader" src="images/loader.gif"/>""")

        @collection = new iList.LazyDataProvider({
            loadPolicy:  new iList.loadPolicy.ManualLoadPolicy( "#listLoader" ), # new iList.loadPolicy.iScroll(), new iList.loadPolicy.WindowScroll()
            loader:    new iList.loader.AjaxDataLoader({
                                url:    "mysite.com?q='searchString'",
                                offset: 0,
                                rows:   3, # how many rows to get each time
                                })
                        })

        @list = new iList.InfiniteList( {
            # VIEW configuration
            container:              @listEl,
            itemRendererTemplate:   @itemRendererTemplate,
            templateFunction:       Mustache.to_html,

            loaderSelector:         $("#listLoader"),

            # DOMAIN configuration
            dataProvider:           @collection  } )

        @server = sinon.fakeServer.create()

    tearDown: ->
        @listEl.remove()
        @server.restore()

    testInitialization: ->
        assertSame( @collection, @list.dataProvider )
        assertNotNull( @list.container )
        assertEquals( @itemRendererTemplate, @list.itemRendererTemplate )

    testLoadingJSONContent: ( queue ) ->
        url = "/some/article/comments.json"

        loaderInst = @listEl.find("#listLoader")

        @collection.getLoader().url = url
        @server.respondWith("GET", "#{url}?rows=3&offset=0",
                                [200, { "Content-Type": "application/json" },
                                 JSON.stringify( @arrayResponse )])

        queue.call("simulate user click", ->
                    $("#listLoader").trigger("click")
                    assertEquals( 0, this.listEl.find("div").length ) )

        queue.call("wait for the call to process", ->
                    assertTrue( loaderInst.hasClass("loading") )
                    @server.respond() )
        queue.call("test list is populated", ->
                    assertEquals(3, @collection.source.length )
                    assertEquals(3, @listEl.find("div").length )
                    assertFalse( loaderInst.hasClass("loading") )
                    assertTrue( loaderInst.hasClass("loaded") ) )

        @server.respondWith("GET", "#{url}?rows=3&offset=3",
                                [200, { "Content-Type": "application/json" },
                                 JSON.stringify( @arrayResponse )])

        queue.call("simulate user click", ->
                    $("#listLoader").trigger("click")
                    assertEquals( 3, @listEl.find("div").length )
                    assertTrue( loaderInst.hasClass("loading"))
                    assertFalse( loaderInst.hasClass("loaded")) )

        queue.call("wait for the call to process", ->
                    @server.respond() )

        queue.call("test list is populated", ->
                    assertEquals(6, @collection.source.length )
                    assertEquals(6, this.listEl.find("div").length )
                    assertTrue( loaderInst.hasClass("loaded")) )

    testLoadingHTMLContent: (queue) ->
        loaderInst = @listEl.find("#listLoader")

        url = "mysite.com/topics/page/"


        @collection = new iList.LazyDataProviderHTML({
            dataType:       "html",
            loadPolicy:     new iList.loadPolicy.ManualLoadPolicy( "#listLoader" ),
            loader:         new iList.loader.AjaxPageLoader({
                                    url:    url
                                }),
            itemSelector:   ".item"
                        })

        @list = new iList.InfiniteList( {
            # VIEW configuration
            container:              @listEl,
            loaderSelector:         $("#listLoader"),

            # DOMAIN configuration
            dataProvider:           @collection  } )

        @server.respondWith("GET", "#{url}/1",
                    [200, { "Content-Type": "text/html" },
                    """ <div class="d1"><div class="item"/><div class="item"/><div class="item"/></div> """])

        queue.call("simulate user click", ->
                    $("#listLoader").trigger("click")
                    assertEquals( 0, this.listEl.find("div").length ) )

        queue.call("wait for the call to process", ->
                    assertTrue( loaderInst.hasClass("loading") )
                    @server.respond() )
        queue.call("test list is populated", ->
                    assertEquals(3, @collection.source.length )
                    assertEquals(3, @listEl.find("div").length )
                    assertFalse( loaderInst.hasClass("loading") )
                    assertTrue( loaderInst.hasClass("loaded") ) )

})