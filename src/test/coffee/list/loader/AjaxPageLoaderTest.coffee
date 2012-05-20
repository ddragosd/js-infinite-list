TestCase("AjaxPageLoaderTest", {
    testURL : ->
        loader = new iList.loader.AjaxPageLoader( {
                url: "mysite.com/topics/page"
            })

        assertEquals( "mysite.com/topics/page/1", loader.getNextUrl() )
        loader.processResult()
        assertEquals( "mysite.com/topics/page/2", loader.getNextUrl() )
})