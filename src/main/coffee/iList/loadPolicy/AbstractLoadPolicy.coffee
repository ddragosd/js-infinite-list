namespace "iList.loadPolicy"

###
    Abstract class to be extended by other load policies
 ###
class iList.loadPolicy.AbstractLoadPolicy

    triggerLoadEvent: ( reason ) ->
        $(this).trigger("load", reason );
