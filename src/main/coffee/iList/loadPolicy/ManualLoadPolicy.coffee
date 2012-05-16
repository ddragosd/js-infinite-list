namespace "iList.loadPolicy"

###
    This load policy gives requires an HTMLElement to listen when user clicks so that it triggers a new load event
 ###
class iList.loadPolicy.ManualLoadPolicy extends iList.loadPolicy.AbstractLoadPolicy
    ###
        When user clicks on this element, a new loading event is triggered
     ###
    loaderEl:           null

    constructor: ( loaderElSelector ) ->
        @initialize( loaderElSelector )

    initialize: ( loaderElSelector )=>
        if ( not loaderElSelector )
            return
        @loaderEl = $(loaderElSelector)
        @loaderEl.on("click", @doLoad )

    doLoad: =>
        @triggerLoadEvent("manual")


