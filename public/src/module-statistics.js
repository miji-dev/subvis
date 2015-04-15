SubVis.ModuleStatistics = (function() {
    var that = {},
        $el,
        $items,
    
        init = function(data) {
            $el = $('#module-statistics');
            $items = $el.find('.module-item');            
            
            render(data);
            
            return that;
        },
        
        render = function(data) {
            $($items[0]).html(data.wordCount);
            $($items[1]).html(data.sents);
            $($items[2]).html(data.avgWordsInSent.toFixed(2));
            $($items[3]).html(data.wordsPerMinute.toFixed(2));
            $($items[4]).html(data.sentsPerMinute.toFixed(2));
        };
        
        that.init = init;
        that.render = render;
        
        return that;
})();