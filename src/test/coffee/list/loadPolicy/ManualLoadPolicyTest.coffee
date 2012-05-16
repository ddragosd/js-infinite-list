TestCase("ManualLoadPolicyTest", {
    setUp: ->
        $("body").append("""<div class='listing'>
                                <img id="listLoader" src="images/loader.gif"/>
                            </div>""")
    tearDown: ->
        $(".listing").remove()

    testInitialization: ->
        loadPolicy = new iList.loadPolicy.ManualLoadPolicy("#listLoader")
        assertNotNull( loadPolicy.loaderEl )

    testLoaderClick: ->
        loadPolicy = new iList.loadPolicy.ManualLoadPolicy("#listLoader")

        loadEventCount = 0
        $(loadPolicy).on("load", -> loadEventCount++ )
        assertEquals( loadEventCount, 0 )

        loadPolicy.loaderEl.trigger("click")
        assertEquals( loadEventCount, 1)
})