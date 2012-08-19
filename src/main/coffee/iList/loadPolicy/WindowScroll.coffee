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

    ###
        How much time to wait before asking to load more items, if there is enough space
        in the initial screen.
     ###
    reloadTimeout : 2000

    constructor: ( offsetPx ) ->
        @offset = offsetPx || @offset
        @initialize()

    initialize: ->
        $(window).scroll( @window_scrollHandler )

        # check if the loaded content is large enough to take the entire screen
        # by forcing a scroll event
        @ensureTheEntireWindowIsOccupied(3)

    ensureTheEntireWindowIsOccupied: (maxReloads = 3)=>
          reloads = 0
          intervalId = window.setInterval =>
            window.clearInterval(intervalId) if not @window_scrollHandler() or ++reloads >= maxReloads
          , @reloadTimeout
          true

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
            return true

        return false