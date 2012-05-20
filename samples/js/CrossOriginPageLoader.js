(function()
{
    var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent)
    {
        for (var key in parent)
        {
            if (__hasProp.call(parent, key))
            {
                child[key] = parent[key];
            }
        }
        function ctor() { this.constructor = child; }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
    };

    window.CrossOriginPageLoader = (function(_super)
    {

        __extends(CrossOriginPageLoader, _super);

        CrossOriginPageLoader.prototype.page = 1;

        function CrossOriginPageLoader(options)
        {
            CrossOriginPageLoader.__super__.constructor.call(this, options);
            if (options.page)
            {
                this.page = options.page;
            }
        }

        /*
         @Override
         */
        CrossOriginPageLoader.prototype.getNextUrl = function()
        {
            return "" + this.url + this.page + "&callback=?";
        };

        /*
         @Override
         */
        CrossOriginPageLoader.prototype.getXhr = function ()
        {
            return $.getJSON(this.getNextUrl());
        }

        /*
         @Override
         */
        CrossOriginPageLoader.prototype.processResult = function(data)
        {
            return this.page += 1;
        };

        CrossOriginPageLoader.prototype.loadMore = function ()  {
            if ( this.page >= 3 ) {
                // send an empty response back to stop getting more results
                $(this).trigger("result", [[], "success", this._xhr]);
                this.clearHandlers();
                return;
            }

            CrossOriginPageLoader.__super__.loadMore.call(this);
        }

        return CrossOriginPageLoader;

    })(iList.loader.AjaxBaseLoader);

}).call(this);