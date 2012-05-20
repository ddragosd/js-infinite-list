namespace "iList"
###
    Loader for HTML text.
 ###
class iList.LazyDataProviderHTML extends iList.LazyDataProvider
    ###
        jQuery selector to find the new items to be added to the list
     ###
    itemSelector: null

    constructor: ( options ) ->
        super(options)
        {@itemSelector} = options
        @throwIfNoItemSelector()


    throwIfNoItemSelector: ->
        throw new Error("You must set an itemSelector") if not @itemSelector


    getConvertedData: ( data ) ->
        convertedData = super(data)
        items = $(convertedData).find(@itemSelector)
        results = ( item for item in items )
        return results


