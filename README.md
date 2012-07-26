# InfiniteList

Javascript library with support for infinite scrolling.
This library is in beta state, with a 95.6% Code Coverage - so you can trust it does what it says as per the code coverage value :). 

If you want to see it in action you can check links bellow. Each link shows various configurations supported by this library.

* Auto load content while scrolling down. [Go to demo] (http://ddragosd.github.com/js-infinite-list/samples/WindowScrollSample.html)
* Manually load content when user clicks "load more". [Go to demo](http://ddragosd.github.com/js-infinite-list/samples/ManualScrollSample.html)
* Integration with iScroll. [Go to demo](http://ddragosd.github.com/js-infinite-list/samples/iScrollSample.html)
* You can also load pre-compiled HTML, not just JSON data. [Go to demo](http://ddragosd.github.com/js-infinite-list/samples/EngadgetTopicsSample.html)

You can combine any source of data ( HTML / JSON ) with custom rules for loading content, called load policies, which are explained bellow.

## Motivation
When I started writing this small library I've been looking a lot on the internet, to see how other people solved this problem.

This [link](http://designbeep.com/2011/08/12/12-jquery-infinite-scrollingscroll-read-plugins-for-content-navigation/) for instance, is showing a few jQuery plugins handling infinite scrolling.

The thing that is difficult to accommodate in these plugins is the fact that each case is different. Some plugins may expect JSON content, others may expect HTML. Some plugins depend on browser URL, others let you specify a URL. Why can't we control these aspects with a single lib and worry about finding a new lib when requirements change ?

## Infinite List concepts

In this library I'm trying to clearly isolate the 2 aspects of an Infinite List:

* View: how the list elements look
 * Are they generated from a template ?
 * Do they come pre-rendered as HTML ?
* Domain: Control how data is loaded
 * What is the URL ?
 * When to load it ?

This library allows you to customize each of these aspects.

More on these a bit later. For now let's see a quick example.

## Example

Start by defining the HTML container for the list:

    <div class="myListContainer">
        <img id="listLoader" src="images/loader.gif"/>
    </div>

Then define the domain of the list.

    dataProvider = new iList.LazyDataProvider({
    
            loadPolicy:  new iList.loadPolicy.ManualLoadPolicy( "#listLoader" ), 
                         // new iList.loadPolicy.iScroll(), 
                         // new iList.loadPolicy.WindowScroll()
                         
            loader:    new iList.loader.AjaxDataLoader({
                                url:    "mysite.com?q='searchString'",
                                offset: 0,         // how may rown to skip
                                rows:   3,         // how many rows to get each time
                                })
                        })

Then create the list, and you're done.

    list = new iList.InfiniteList( {
            # VIEW configuration
            container:              $("#myListContainer"),  // an HTML element
            itemRendererTemplate:   "<div>{{title}}</div>", // template for each new item to add
            templateFunction:       Mustache.to_html,       // templating function.

            loaderSelector:         $("#listLoader"),       // an HTML element indicating loading

            # DOMAIN configuration
            dataProvider:           dataProvider  } )       // source of data for the list


## View: how list elements look

TBD

## Domain: Control how data is loaded

TBD

## Building Infinite List

The build depends on [Apache Maven](http://maven.apache.org/guides/getting-started/index.html).
For those familiar with `maven` it's pretty straight forward:

    mvn clean install

Build also integrates unit tests; in case the build fails b/c it cannot open a browser add `browserPath` parameter:

    mvn clean install -DbrowserPath=/path/to/my/browser

If you want to skip the tests, you can execute:

    mvn clean install -Dmaven.test.skip=true

## Links and resources

* [Maven Getting Started Guide](http://maven.apache.org/guides/getting-started/index.html)

