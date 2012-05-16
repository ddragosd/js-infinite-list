namespace "iList.loadPolicy"

###
    This load policy is listening for window scroll, and when it reaches the bottom of the page
    it triggers a new load event
 ###
class iList.loadPolicy.WindowScroll extends iList.loadPolicy.AbstractLoadPolicy
    ###
        How many pixels before reaching the bottom of the page triggers a new load event
     ###
    offset : 0

    constructor: ( offsetPx ) ->
        @offset = offsetPx || @offset
        @initialize()

    initialize: ->
        $(window).scroll( @window_scrollHandler )

    window_scrollHandler: =>
        ###
            Get the view frame for the window - this is the
            top and bottom coordinates of the visible slice of the document.
         ###
        viewTop = $( window ).scrollTop()

        viewBottom = viewTop + $( window ).height()
        pos = $(document).height() - @offset

        if  (viewBottom >= pos)
            @triggerLoadEvent("window_scroll")