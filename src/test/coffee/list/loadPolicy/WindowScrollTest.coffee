TestCase("WindowScrollTest", {

    testInitialization: ->
        loadPolicy = new iList.loadPolicy.WindowScroll( 100 )
        assertEquals( 100, loadPolicy.offset)

    testScrollTriggersLoadEvent: ->
        loadCount = 0
        loadPolicy = new iList.loadPolicy.WindowScroll( 300 )
        $(loadPolicy).on("load", -> loadCount++ )

        loadPolicy.window_scrollHandler()
        assertEquals("load event should have been triggered", 1, loadCount )

})