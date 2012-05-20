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

    testIntializationWithNoSource: ->
        dp = new iList.LazyDataProvider ( {
            loader: new FakeLoader(),
            loadPolicy: new iList.loadPolicy.ManualLoadPolicy()
        })
        assertNotNull ( dp.source )
        assertEquals(0, dp.source.length)

    testWithArrayResult: ( queue )  ->
        source = []
        manualLoadPolicy = new iList.loadPolicy.ManualLoadPolicy()
        loader = new FakeLoader()
        loadingDataEventCount = 0
        dataLoadedEventCount = 0

        dp = new iList.LazyDataProvider( {
            source: source,
            loader: loader,
            loadPolicy: manualLoadPolicy
        })

        $(dp).on("loadingData", -> loadingDataEventCount++ )
        $(dp).on("dataLoaded", -> dataLoadedEventCount++ )

        assertSame( source, dp.getSource() )
        assertEquals( 0, dp.getSource().length )

        assertEquals( 0, loadingDataEventCount )
        assertEquals( 0, dataLoadedEventCount )

        loader.respondWith = ["1","2","3"]
        manualLoadPolicy.doLoad()

        assertEquals( 3, dp.getSource().length )
        assertEquals( 1, loadingDataEventCount )
        assertEquals( 1, dataLoadedEventCount )
        assertFalse( dp.isLoading )

        loader.respondWith = ["a","b", "c"]
        manualLoadPolicy.doLoad()

        assertEquals( 2, loadingDataEventCount )
        assertEquals( 2, dataLoadedEventCount )

        assertEquals(6, dp.getSource().length)
        assertEquals("1,2,3,a,b,c", dp.getSource().join(",") )

    testThatOnEmptyResponseLoadingStops: (queue) ->
        manualLoadPolicy = new iList.loadPolicy.ManualLoadPolicy()
        loader = new FakeLoader()
        loadingDataEventCount = 0
        dataLoadedEventCount = 0

        dp = new iList.LazyDataProvider( {
            loader: loader,
            loadPolicy: manualLoadPolicy
        })

        assertFalse( dp.gotEmptyResults )

        $(dp).on("loadingData", -> loadingDataEventCount++ )
        $(dp).on("dataLoaded", -> dataLoadedEventCount++ )

        loader.respondWith = ["1","2","3"]
        manualLoadPolicy.doLoad()
        assertEquals( 3, dp.getSource().length )
        assertFalse( dp.gotEmptyResults )
        assertEquals( 1, loadingDataEventCount )
        assertEquals( 1, dataLoadedEventCount )

        loader.respondWith = []
        manualLoadPolicy.doLoad()
        assertEquals( 3, dp.getSource().length )
        assertEquals( 2, loadingDataEventCount )
        assertEquals( 2, dataLoadedEventCount )
        assertTrue( dp.gotEmptyResults )

        loader.respondWith = [1,2,3]
        manualLoadPolicy.doLoad()
        assertEquals( 3, dp.getSource().length )
        assertEquals( 2, loadingDataEventCount )
        assertEquals( 2, dataLoadedEventCount )
        assertTrue( dp.gotEmptyResults )

})