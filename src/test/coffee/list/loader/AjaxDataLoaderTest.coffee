AsyncTestCase( "AjaxDataLoader", {
    server: null

    setUp: ->
        @server = sinon.fakeServer.create()

    tearDown: ->
        @server.restore()

    testInitialization: ->
        assertTrue( true )

    testSuccessfulCall: ( queue )  ->
        resultCount = 0
        faultCount = 0
        url = "/some/article/comments.json"

        loader = new iList.loader.AjaxDataLoader({
            url: url
            rows: 1
            offset: 0
        })

        $(loader).on("result", -> resultCount++ )
        $(loader).on("fault", -> faultCount++ )

        @server.respondWith("GET", "#{url}?rows=1&offset=0",
                                [200, { "Content-Type": "application/json" },
                                 '[{ "id": 12, "comment": "Hey there" }]'])

        @server.respondWith("GET", "#{url}?rows=1&offset=1",
                                [200, { "Content-Type": "application/json" },
                                 '[{ "id": 14, "comment": "Hey there again" }]'])

        assertEquals( 0, resultCount )
        assertEquals(0, faultCount )

        queue.call("step1: make the call", ->
                        loader.loadMore()
                        @server.respond() )

        queue.call("step2: verify the result", ->
            assertEquals( 1, resultCount )
            assertEquals( 0, faultCount ) )

        queue.call("step3: test the rown and offset increase", ->
             loader.loadMore()
             @server.respond() )

        queue.call("step4: verify the result again", ->
            assertEquals( 2, resultCount )
            assertEquals( 0, faultCount ) )

    testUnsuccessfulCall: ->
        assertTrue( true )
})