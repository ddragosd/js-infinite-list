AsyncTestCase("WindowScrollTest", {

    testInitialization: ->
        loadPolicy = new iList.loadPolicy.WindowScroll( 100 )
        assertEquals( 100, loadPolicy.offset)

    testInitializationWithNoPAram: ->
        loadPolicy = new iList.loadPolicy.WindowScroll()
        assertEquals(0, loadPolicy.offset)

    testScrollTriggersLoadEvent: ->
        loadCount = 0
        loadPolicy = new iList.loadPolicy.WindowScroll( 300 )
        $(loadPolicy).on("load", -> loadCount++ )

        loadPolicy.window_scrollHandler()
        assertEquals("load event should have been triggered", 1, loadCount )

    testScrollTriggersLoadEventByDefault: (queue) ->
        loadPolicy = null
        loadCount = 0
        timeoutCount = 0

        queue.call("step1: initialize LoadPolicy", (callbacks) ->
            loadPolicy = new iList.loadPolicy.WindowScroll( 300 )
            $(loadPolicy).on("load", -> loadCount++ )
            myCallback = callbacks.add( -> timeoutCount++ )
            setTimeout(myCallback, 4000) )

        queue.call("step2: verify trigger events", ->
            assertEquals(2, loadCount)
            assertEquals(1, timeoutCount) )

})