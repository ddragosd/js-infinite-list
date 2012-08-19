
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
      var _ref;
      if (((_ref = this.dataProvider.dataType) === "json" || _ref === "jsonp" || _ref === "xml")) {
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

    InfiniteList.prototype.appendHTMLElements = function(data) {
      var elem, _i, _j, _len, _len2, _results, _results2;
      if (this._jqLoader) {
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          elem = data[_i];
          _results.push(this._jqLoader.before(elem));
        }
        return _results;
      } else {
        _results2 = [];
        for (_j = 0, _len2 = data.length; _j < _len2; _j++) {
          elem = data[_j];
          _results2.push(this.container.append(elem));
        }
        return _results2;
      }
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
  
      By Default, the data is assumed to be an Array, meaning that source property is initialized as an empty Array.
      To work with HTML String, source property must be initialized with a String value, which could be empty: ""
  
      collection = new iList.LazyDataProvider( { source : "" } )
  
  
         TODO: discuss the need of a reset functionality ?
  */

  iList.LazyDataProvider = (function() {
    /*
            Array object with the elements in the data provider.
            It can be initialized by passing a 'source' property to the constructor object.
    */
    LazyDataProvider.prototype.source = null;

    /*
            The type of data expected from the server.
            Takes values similar to jQuery.ajax's dataType property: "json" or "jsonp" or "html"
    */

    LazyDataProvider.prototype.dataType = "json";

    /*
            Policy by which a new load should happen
    */

    LazyDataProvider.prototype.loadPolicy = null;

    /*
            The class responsible to load data
    */

    LazyDataProvider.prototype._loader = null;

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
      this.appendResult = __bind(this.appendResult, this);      this.source = options.source, this.loadPolicy = options.loadPolicy, this.dataConverter = options.dataConverter;
      if (options.dataType) this.dataType = options.dataType;
      this.initialize();
      this.setLoader(options.loader);
    }

    LazyDataProvider.prototype.initialize = function() {
      this.setSourceIfEmpty();
      return $(this.loadPolicy).on("load", this.loadPolicy_loadHandler);
    };

    LazyDataProvider.prototype.setSourceIfEmpty = function() {
      var _ref;
      return (_ref = this.source) != null ? _ref : this.source = [];
    };

    LazyDataProvider.prototype.getSource = function() {
      return this.source;
    };

    LazyDataProvider.prototype.getLoadPolicy = function() {
      return this.loadPolicy;
    };

    LazyDataProvider.prototype.getLoader = function() {
      return this._loader;
    };

    LazyDataProvider.prototype.setLoader = function(ldr) {
      if (this._loader) $(this._loader).off("result", this.loader_resultHandler);
      this._loader = ldr;
      this.throwIfNullLoader();
      return $(this._loader).on("result", this.loader_resultHandler);
    };

    LazyDataProvider.prototype.throwIfNullLoader = function() {
      if (!this._loader) throw new Error("You have to provide a non-null loader");
    };

    LazyDataProvider.prototype.reset = function() {
      this.source = [];
      return this.gotEmptyResults = false;
    };

    /*
            Manually load more data
    */

    LazyDataProvider.prototype.loadMore = function() {
      if (this.isLoading) return;
      this.isLoading = true;
      if (!this.gotEmptyResults) return this._loader.loadMore();
    };

    LazyDataProvider.prototype.appendResult = function(result) {
      this.gotEmptyResults = result.length === 0;
      if ($.isArray(result) && $.isArray(this.source)) {
        return this.source = this.source.concat(result);
      }
    };

    LazyDataProvider.prototype.loadPolicy_loadHandler = function() {
      if (!this.gotEmptyResults) {
        $(this).trigger("loadingData");
        return this.loadMore();
      }
    };

    LazyDataProvider.prototype.loader_resultHandler = function(event, data, textStatus, jqXHR) {
      this.isLoading = false;
      return this.processResult(data);
    };

    LazyDataProvider.prototype.processResult = function(data) {
      var convertedData;
      convertedData = this.getConvertedData(data);
      this.appendResult(convertedData);
      return this.triggerLoadedEvent(convertedData);
    };

    LazyDataProvider.prototype.getConvertedData = function(data) {
      var convertedData;
      convertedData = typeof this.dataConverter === "function" ? this.dataConverter(data) : void 0;
      return convertedData || data;
    };

    LazyDataProvider.prototype.triggerLoadedEvent = function(convertedData) {
      return $(this).trigger("dataLoaded", [convertedData]);
    };

    return LazyDataProvider;

  })();

}).call(this);

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  namespace("iList");

  /*
      Loader for HTML text.
  */

  iList.LazyDataProviderHTML = (function(_super) {

    __extends(LazyDataProviderHTML, _super);

    /*
            jQuery selector to find the new items to be added to the list
    */

    LazyDataProviderHTML.prototype.itemSelector = null;

    function LazyDataProviderHTML(options) {
      LazyDataProviderHTML.__super__.constructor.call(this, options);
      this.itemSelector = options.itemSelector;
      this.throwIfNoItemSelector();
    }

    LazyDataProviderHTML.prototype.throwIfNoItemSelector = function() {
      if (!this.itemSelector) throw new Error("You must set an itemSelector");
    };

    LazyDataProviderHTML.prototype.getConvertedData = function(data) {
      var convertedData, item, items, results;
      convertedData = LazyDataProviderHTML.__super__.getConvertedData.call(this, data);
      items = $(convertedData).find(this.itemSelector);
      results = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          _results.push(item);
        }
        return _results;
      })();
      return results;
    };

    return LazyDataProviderHTML;

  })(iList.LazyDataProvider);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace("iList.loader");

  iList.loader.AjaxBaseLoader = (function() {

    AjaxBaseLoader.prototype.url = null;

    AjaxBaseLoader.prototype._xhr = null;

    function AjaxBaseLoader(options) {
      this._clearHandlers = __bind(this._clearHandlers, this);
      this._failHandler = __bind(this._failHandler, this);
      this._doneHandler = __bind(this._doneHandler, this);      this.url = options.url;
    }

    AjaxBaseLoader.prototype.getNextUrl = function() {
      return "" + this.url;
    };

    AjaxBaseLoader.prototype.getXhr = function() {
      return $.get(this.getNextUrl());
    };

    AjaxBaseLoader.prototype.loadMore = function() {
      if (this._xhr) {
        this._clearHandlers();
        this._xhr.abort();
      }
      this._xhr = this.getXhr();
      this._xhr.done(this._doneHandler);
      return this._xhr.fail(this._failHandler);
    };

    AjaxBaseLoader.prototype.processResult = function(data) {
      return null;
    };

    AjaxBaseLoader.prototype._doneHandler = function(data, textStatus, jqXHR) {
      this.processResult(data);
      $(this).trigger("result", [data, textStatus, jqXHR]);
      return this._clearHandlers();
    };

    AjaxBaseLoader.prototype._failHandler = function(data, textStatus, jqXHR) {
      $(this).trigger("fault", [data, textStatus, jqXHR]);
      return this._clearHandlers();
    };

    AjaxBaseLoader.prototype._clearHandlers = function() {
      return $(this._xhr).off();
    };

    return AjaxBaseLoader;

  })();

}).call(this);

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  namespace("iList.loader");

  iList.loader.AjaxDataLoader = (function(_super) {

    __extends(AjaxDataLoader, _super);

    AjaxDataLoader.prototype.rows = 30;

    AjaxDataLoader.prototype.offset = 0;

    function AjaxDataLoader(options) {
      AjaxDataLoader.__super__.constructor.call(this, options);
      this.rows = options.rows, this.offset = options.offset;
    }

    /*
            @Override
    */

    AjaxDataLoader.prototype.getNextUrl = function() {
      if (this.url.indexOf("?") < 0) {
        return "" + this.url + "?rows=" + this.rows + "&offset=" + this.offset;
      }
      return "" + this.url + "&rows=" + this.rows + "&offset=" + this.offset;
    };

    /*
            @Override
    */

    AjaxDataLoader.prototype.processResult = function(data) {
      return this.offset += this.rows;
    };

    return AjaxDataLoader;

  })(iList.loader.AjaxBaseLoader);

}).call(this);

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  namespace("iList.loader");

  iList.loader.AjaxPageLoader = (function(_super) {

    __extends(AjaxPageLoader, _super);

    AjaxPageLoader.prototype.page = 1;

    function AjaxPageLoader(options) {
      AjaxPageLoader.__super__.constructor.call(this, options);
      if (options.page) this.page = options.page;
    }

    /*
            @Override
    */

    AjaxPageLoader.prototype.getNextUrl = function() {
      return "" + this.url + "/" + this.page;
    };

    /*
            @Override
    */

    AjaxPageLoader.prototype.processResult = function(data) {
      return this.page += 1;
    };

    return AjaxPageLoader;

  })(iList.loader.AjaxBaseLoader);

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

    /*
            How much time to wait before asking to load more items, if there is enough space
            in the initial screen.
    */

    WindowScroll.prototype.reloadTimeout = 2000;

    function WindowScroll(offsetPx) {
      this.window_scrollHandler = __bind(this.window_scrollHandler, this);
      this.ensureTheEntireWindowIsOccupied = __bind(this.ensureTheEntireWindowIsOccupied, this);      this.offset = offsetPx || this.offset;
      this.initialize();
    }

    WindowScroll.prototype.initialize = function() {
      $(window).scroll(this.window_scrollHandler);
      return this.ensureTheEntireWindowIsOccupied(3);
    };

    WindowScroll.prototype.ensureTheEntireWindowIsOccupied = function(maxReloads) {
      var intervalId, reloads,
        _this = this;
      if (maxReloads == null) maxReloads = 3;
      reloads = 0;
      intervalId = window.setInterval(function() {
        if (!_this.window_scrollHandler() || ++reloads >= maxReloads) {
          return window.clearInterval(intervalId);
        }
      }, this.reloadTimeout);
      return true;
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
      if (viewBottom >= pos) {
        this.triggerLoadEvent("window_scroll");
        return true;
      }
      return false;
    };

    return WindowScroll;

  })(iList.loadPolicy.AbstractLoadPolicy);

}).call(this);

