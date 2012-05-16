(function()
{
    var __bind = function(fn, me) { return function() { return fn.apply(me, arguments); }; };

    window.TwitterFeedLoader = (function()
    {

        TwitterFeedLoader.prototype.url = "http://search.twitter.com/search.json";

        TwitterFeedLoader.prototype.rpp = 10;

        TwitterFeedLoader.prototype.page = 1;

        TwitterFeedLoader.prototype.query = "adobe";

        TwitterFeedLoader.prototype.lang = "en";

        /**
         * This limit is to behave nice with Twitter API
         */
        TwitterFeedLoader.MAX_PAGE = 4;



        TwitterFeedLoader.prototype._xhr = null;

        function TwitterFeedLoader(options)
        {
            this.clearHandlers = __bind(this.clearHandlers, this);
            this.failHandler = __bind(this.failHandler, this);
            this.doneHandler = __bind(this.doneHandler, this);
            this.url = options.url || this.url;
            this.rpp = options.rpp || this.rpp;
            this.page = options.startPage || this.page;
            this.lang = options.lang || this.lang;
            this.query = options.query || this.query;
        }

        TwitterFeedLoader.prototype.loadMore = function()
        {
            if ( this.page >= TwitterFeedLoader.MAX_PAGE ) {
                // send an empty response back to stop getting more tweets
                $(this).trigger("result", [[], "success", this._xhr]);
                this.clearHandlers();
                return;
            }

            if (this._xhr)
            {
                this.clearHandlers();
                this._xhr.abort();
            }
            this._xhr = $.ajax({
                url: this.url,
                dataType: "jsonp",
                data: {
                    q: this.query,
                    rpp: this.rpp,
                    lang: this.lang,
                    page: this.page
                }
            });
            this._xhr.done(this.doneHandler);
            this._xhr.fail(this.failHandler);
        };

        TwitterFeedLoader.prototype.doneHandler = function(data, textStatus, jqXHR)
        {
            this.page++;
            data = data.results;
            $(this).trigger("result", [data, textStatus, jqXHR]);
            this.clearHandlers();
        };

        TwitterFeedLoader.prototype.failHandler = function(data, textStatus, jqXHR)
        {
            $(this).trigger("fault", [data, textStatus, jqXHR]);
            this.clearHandlers();
        };

        TwitterFeedLoader.prototype.clearHandlers = function()
        {
            $(this._xhr).off();
        };

        return TwitterFeedLoader;

    })();

}).call(this);