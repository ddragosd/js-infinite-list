TestCase("HTMLDataProviderTest", {
    fakeLoaderCls: class HTMLFakeLoader
        respondWith: """ <div class="d1"><div class="d11"/><div class="d11"/><div class="d11"/></div> """
        loadMore: =>
            $(this).trigger("result", [@respondWith, "200", null] )
    dp : null

    setUp: ->
        loader = new HTMLFakeLoader()
        @dp = new iList.LazyDataProviderHTML( {
                            loadPolicy: new iList.loadPolicy.ManualLoadPolicy(),
                            loader: loader,
                            itemSelector: ".d11"
                        })

    testGetConvertedData: ->
        r = @dp.getConvertedData( """ <div class="d1"><div class="d11"/><div class="d11"/><div class="d11"/></div> """ )
        assertNotNull(r)
        assertTrue( $.isArray(r))
        assertEquals(3, r.length)


    testReadingHTMLContent: ->
        assertEquals(0, @dp.source.length )
        @dp.loadMore()
        assertEquals(3, @dp.source.length )






})