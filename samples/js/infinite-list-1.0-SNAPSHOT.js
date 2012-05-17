
/*
Save a reference to the global object (window in the browser, global on the server).
*/

(function() {
  var root;

  root = this;

  /*
   Utility to create a particular namespace for Log4JScript
  */

  window.namespace = function(_name) {
    var createPackage, currentPkg, currentPkq, firstSpace, spc, subPackage, _i, _len;
    createPackage = function(_parentPkg, _src) {
      return _parentPkg[_src] = _parentPkg[_src] || new Object();
    };
    spc = _name.split(".");
    currentPkg = root;
    /*
        The top-level namespace.
        All public namespace classes and modules will be attached to this.
        Exported for both CommonJS and the browser.
    */
    if (typeof exports !== 'undefined') {
      firstSpace = spc.shift();
      currentPkq = exports;
    }
    for (_i = 0, _len = spc.length; _i < _len; _i++) {
      subPackage = spc[_i];
      currentPkg = createPackage(currentPkg, subPackage);
    }
    return null;
  };

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace("iList");

  /*
      Usage
  
      collection = new iList.LazyDataProvider({
              loadPolicy:  new iList.loadPolicy.ManualLoadPolicy() or  new iList.loadPolicy.iScroll() or new iList.loadPolicy.WindowScroll()
              loader:    new iList.AjaxDataLoader({
                                  url:    "mysite.com?q='searchString'",
                                  offset: 0,
                                  rows:   15, // how many rows to get each time
                                  })
                          })
  
      list = new iList.InfiniteList( {
          # VIEW configuration
          container:              $(".listing"),
          itemRendererTemplate:   '<div>{{data.title}}</div>', // jQueryTemplate to create new items
          templateFunction:       _.template // or Mustache.render
          itemSelector:           null // used when the Ajax returns HTML content, instead of JSON
  
          loaderSelector:         null // if there is another selector in the page that should be used as loader indicator
  
          # DOMAIN configuration
          dataProvider: collection
                          })
  */

  iList.InfiniteList = (function() {
    /*
            VIEW configuration
    */
    /*
            The HTMLElement which will contain the list
    */
    InfiniteList.prototype.container = null;

    /*
            A template to create new items. Works with templateFunction
    */

    InfiniteList.prototype.itemRendererTemplate = null;

    /*
            A function to be called with 2 parameters: template_String, data.
            This hook eases the integration with your templating engine: Mustache.render, _.tmpl
    
            For instance, if you provide Mustache.render function, it will be called with
                Mustache.render( this.itemRendererTemplate, item )
            Or if you provide _.template, it will be called with
                _.template( this.itemRendererTemplate, item )
    */

    InfiniteList.prototype.templateFunction = null;

    /*
            used when the Ajax returns HTML content, instead of JSON, to identify the new items
    */

    InfiniteList.prototype.itemRendererSelector = null;

    /*
            if there is another selector in the page that should be used as loading indicator
    */

    InfiniteList.prototype.loaderSelector = null;

    /*
            DOMAIN configuration
    */

    /*
            LazyDataProvider object
    */

    InfiniteList.prototype.dataProvider = null;

    InfiniteList.prototype._jqLoader = null;

    function InfiniteList(obj) {
      this.appendNewElements = __bind(this.appendNewElements, this);
      this.dataProvider_dataLoadedHandler = __bind(this.dataProvider_dataLoadedHandler, this);
      this.dataProvider_loadingDataHandler = __bind(this.dataProvider_loadingDataHandler, this);      this.container = obj.container, this.itemRendererTemplate = obj.itemRendererTemplate, this.templateFunction = obj.templateFunction;
      this.loaderTemplate = obj.loaderTemplate, this.loaderSelector = obj.loaderSelector;
      this.dataProvider = obj.dataProvider;
      this.throwIfDataProviderIsNull();
      this.throwIfContainerIsNull();
      this.throwIfNoItemRenderer();
      this.initialize();
    }

    InfiniteList.prototype.throwIfDataProviderIsNull = function() {
      if (!this.dataProvider) throw new Error("You must provide a dataProvider");
    };

    InfiniteList.prototype.throwIfContainerIsNull = function() {
      if (!this.container) throw new Error("You must provide a valid container");
    };

    InfiniteList.prototype.throwIfNoItemRenderer = function() {
      if (this.itemRendererTemplate && !this.templateFunction) {
        throw new Error("You must provide a templateFunction when providing itemRendererTemplate");
      }
      if (!this.itemRendererTemplate && !this.templateFunction && !this.itemRendererSelector) {
        throw new Error("You must provide an itemRendererTemplate, or an templateFunction or an itemRendererSelector");
      }
    };

    InfiniteList.prototype.initialize = function() {
      if (!(this.container instanceof $)) this.container = $(this.container);
      $(this.dataProvider).on("loadingData", this.dataProvider_loadingDataHandler);
      $(this.dataProvider).on("dataLoaded", this.dataProvider_dataLoadedHandler);
      return this._jqLoader = this.initLoader();
    };

    InfiniteList.prototype.initLoader = function() {
      if (this.loaderSelector) return $(this.loaderSelector);
    };

    InfiniteList.prototype.loadMore = function() {
      return this.dataProvider.loadMore();
    };

    InfiniteList.prototype.dataProvider_loadingDataHandler = function() {
      if (this._jqLoader) {
        this._jqLoader.removeClass("loaded");
        return this._jqLoader.addClass("loading");
      }
    };

    InfiniteList.prototype.dataProvider_dataLoadedHandler = function(event, data) {
      if (this._jqLoader) {
        this._jqLoader.removeClass("loading");
        this._jqLoader.addClass("loaded");
        /*
                        CSS class "end" is added to indicate there is no more data to load
        */
        if (data.length === 0) this._jqLoader.addClass("end");
      }
      return this.appendNewElements(data);
    };

    InfiniteList.prototype.appendNewElements = function(data) {
      if ($.isArray(this.dataProvider.source)) {
        return this.appendArrayElements(data);
      } else {
        return this.appendHTMLElements(data);
      }
    };

    InfiniteList.prototype.appendArrayElements = function(data) {
      var item, str;
      str = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          _results.push(this.createNewItem(item));
        }
        return _results;
      }).call(this)).join("");
      if (this._jqLoader) {
        return this._jqLoader.before(str);
      } else {
        return this.container.append(str);
      }
    };

    InfiniteList.prototype.createNewItem = function(item) {
      return this.templateFunction(this.itemRendererTemplate, item);
    };

    InfiniteList.prototype.appendHTMLElements = function() {
      throw new Error("HTML is not supported currently");
    };

    return InfiniteList;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace("iList");

  /*
      Class responsible to load the data in a lazy manner.
         - It uses a loader to retrieve data
         - the data is then appended into the source. dataConverter function can be used to parse the returned data.
         - the loadPolicy decides when it's time to load more data
  
      Triggers the following events:
         - loadingData - called when starting to load new data.
         - dataLoaded - called each time after loading a new chunk of data
  
         TODO: discuss the need of a reset functionality ?
  */

  iList.LazyDataProvider = (function() {
    /*
            Array object with the elements in the data provider
    */
    LazyDataProvider.prototype.source = null;

    /*
            Policy by which a new load should happen
    */

    LazyDataProvider.prototype.loadPolicy = null;

    /*
            The class responsible to load data
    */

    LazyDataProvider.prototype.loader = null;

    /*
            function used to convert the data when it comes from the server
    */

    LazyDataProvider.prototype.dataConverter = null;

    /*
            This Boolean flag is an indicator that a loader returned empty results,
            and that there is no more data to load.
            When this is true, no more loading requests are processed.
    */

    LazyDataProvider.prototype.gotEmptyResults = false;

    /*
            This Boolean flag is true when a request to load data is in progress.
            Only one request at a time is permitted
    */

    LazyDataProvider.prototype.isLoading = false;

    function LazyDataProvider(options) {
      this.loader_resultHandler = __bind(this.loader_resultHandler, this);
      this.loadPolicy_loadHandler = __bind(this.loadPolicy_loadHandler, this);
      this.appendResult = __bind(this.appendResult, this);      this.source = options.source, this.loadPolicy = options.loadPolicy, this.loader = options.loader, this.dataConverter = options.dataConverter;
      this.initialize();
    }

    LazyDataProvider.prototype.initialize = function() {
      if (this.source == null) this.source = [];
      $(this.loadPolicy).on("load", this.loadPolicy_loadHandler);
      return $(this.loader).on("result", this.loader_resultHandler);
    };

    LazyDataProvider.prototype.getSource = function() {
      return this.source;
    };

    LazyDataProvider.prototype.getLoadPolicy = function() {
      return this.loadPolicy;
    };

    LazyDataProvider.prototype.getLoader = function() {
      return this.loader;
    };

    /*
            Manually load more data
    */

    LazyDataProvider.prototype.loadMore = function() {
      if (this.isLoading) return;
      this.isLoading = true;
      if (!this.gotEmptyResults) return this.loader.loadMore();
    };

    LazyDataProvider.prototype.appendResult = function(result) {
      this.gotEmptyResults = result.length === 0;
      if ($.isArray(this.source)) {
        return this.source = this.source.concat(result);
      } else {
        return this.source += result;
      }
    };

    LazyDataProvider.prototype.loadPolicy_loadHandler = function() {
      if (!this.gotEmptyResults) {
        $(this).trigger("loadingData");
        return this.loadMore();
      }
    };

    LazyDataProvider.prototype.loader_resultHandler = function(event, data, textStatus, jqXHR) {
      var convertedData;
      this.isLoading = false;
      convertedData = typeof this.dataConverter === "function" ? this.dataConverter(data) : void 0;
      if (convertedData == null) convertedData = data;
      this.appendResult(convertedData);
      return $(this).trigger("dataLoaded", [convertedData]);
    };

    return LazyDataProvider;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace("iList.loader");

  iList.loader.AjaxDataLoader = (function() {

    AjaxDataLoader.prototype.url = null;

    AjaxDataLoader.prototype.rows = 30;

    AjaxDataLoader.prototype.offset = 0;

    AjaxDataLoader.prototype._xhr = null;

    function AjaxDataLoader(options) {
      this.clearHandlers = __bind(this.clearHandlers, this);
      this.failHandler = __bind(this.failHandler, this);
      this.doneHandler = __bind(this.doneHandler, this);      this.url = options.url, this.rows = options.rows, this.offset = options.offset;
    }

    AjaxDataLoader.prototype.loadMore = function() {
      if (this._xhr) {
        this.clearHandlers();
        this._xhr.abort();
      }
      this._xhr = $.get(this.url, {
        rows: this.rows,
        offset: this.offset
      });
      this._xhr.done(this.doneHandler);
      return this._xhr.fail(this.failHandler);
    };

    AjaxDataLoader.prototype.doneHandler = function(data, textStatus, jqXHR) {
      this.offset += this.rows;
      $(this).trigger("result", [data, textStatus, jqXHR]);
      return this.clearHandlers();
    };

    AjaxDataLoader.prototype.failHandler = function(data, textStatus, jqXHR) {
      $(this).trigger("fault", [data, textStatus, jqXHR]);
      return this.clearHandlers();
    };

    AjaxDataLoader.prototype.clearHandlers = function() {
      return $(this._xhr).off();
    };

    return AjaxDataLoader;

  })();

}).call(this);

(function() {

  namespace("iList.loadPolicy");

  /*
      Abstract class to be extended by other load policies
  */

  iList.loadPolicy.AbstractLoadPolicy = (function() {

    function AbstractLoadPolicy() {}

    AbstractLoadPolicy.prototype.triggerLoadEvent = function(reason) {
      return $(this).trigger("load", reason);
    };

    return AbstractLoadPolicy;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  namespace("iList.loadPolicy");

  /*
      This load policy gives requires an HTMLElement to listen when user clicks so that it triggers a new load event
  */

  iList.loadPolicy.ManualLoadPolicy = (function(_super) {

    __extends(ManualLoadPolicy, _super);

    /*
            When user clicks on this element, a new loading event is triggered
    */

    ManualLoadPolicy.prototype.loaderEl = null;

    function ManualLoadPolicy(loaderElSelector) {
      this.doLoad = __bind(this.doLoad, this);
      this.initialize = __bind(this.initialize, this);      this.initialize(loaderElSelector);
    }

    ManualLoadPolicy.prototype.initialize = function(loaderElSelector) {
      if (!loaderElSelector) return;
      this.loaderEl = $(loaderElSelector);
      return this.loaderEl.on("click", this.doLoad);
    };

    ManualLoadPolicy.prototype.doLoad = function() {
      return this.triggerLoadEvent("manual");
    };

    return ManualLoadPolicy;

  })(iList.loadPolicy.AbstractLoadPolicy);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  namespace("iList.loadPolicy");

  /*
      This load policy is listening for window scroll, and when it reaches the bottom of the page
      it triggers a new load event
  */

  iList.loadPolicy.WindowScroll = (function(_super) {

    __extends(WindowScroll, _super);

    /*
            How many pixels before reaching the bottom of the page triggers a new load event
    */

    WindowScroll.prototype.offset = 0;

    function WindowScroll(offsetPx) {
      this.window_scrollHandler = __bind(this.window_scrollHandler, this);      this.offset = offsetPx || this.offset;
      this.initialize();
    }

    WindowScroll.prototype.initialize = function() {
      return $(window).scroll(this.window_scrollHandler);
    };

    WindowScroll.prototype.window_scrollHandler = function() {
      /*
                  Get the view frame for the window - this is the
                  top and bottom coordinates of the visible slice of the document.
      */
      var pos, viewBottom, viewTop;
      viewTop = $(window).scrollTop();
      viewBottom = viewTop + $(window).height();
      pos = $(document).height() - this.offset;
      if (viewBottom >= pos) return this.triggerLoadEvent("window_scroll");
    };

    return WindowScroll;

  })(iList.loadPolicy.AbstractLoadPolicy);

}).call(this);

