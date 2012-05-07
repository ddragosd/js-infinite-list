AsyncTestCase( "LazyDataProvider", {

    fakeLoaderCls: class FakeLoader
        respondWith: ["a","b","c"]
        loadMore: =>
            $(this).trigger("result", [@respondWith, "200", null] )

    testInitialization: ->
        source = []
        loadPolicy = new iList.loadPolicy.ManualLoadPolicy()
        loader = new FakeLoader()
        dataConverter = -> return "fn"

        dp = new iList.LazyDataProvider( {
            source: source,
            loader: loader,
            loadPolicy: loadPolicy,
            dataConverter: dataConverter
        })

        assertSame( source, dp.getSource() )
        assertSame( loader, dp.loader )
        assertSame( loadPolicy, dp.loadPolicy )
        assertSame( dataConverter, dp.dataConverter )

    testWithArrayResult: ( queue )  ->
        source = []
        manualLoadPolicy = new iList.loadPolicy.ManualLoadPolicy()
        loader = new FakeLoader()

        dp = new iList.LazyDataProvider( {
            source: source,
            loader: loader,
            loadPolicy: manualLoadPolicy
        })

        assertSame( source, dp.getSource() )
        assertEquals( 0, dp.getSource().length )

        loader.respondWith = ["1","2","3"]

        queue.call("Step1: simulate a load request", -> manualLoadPolicy.doLoad() )

        queue.call("Step2: verify that data is loaded",
                    ->
                        assertEquals(3, dp.getSource().length) )

        queue.call("Step3: simulate another load request",
                    ->
                        loader.respondWith = ["a","b", "c"]
                        manualLoadPolicy.doLoad() )

        queue.call("Step4: verify that data is appended",
                    ->
                        assertEquals(6, dp.getSource().length)
                        assertEquals("1,2,3,a,b,c", dp.getSource().join(",") ) )
})