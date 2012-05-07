namespace "iList.loadPolicy"

###
    This load policy give you the possibility to call a load event manually
 ###
class iList.loadPolicy.ManualLoadPolicy extends iList.loadPolicy.AbstractLoadPolicy
    doLoad: =>
        @triggerLoadEvent("manual")


