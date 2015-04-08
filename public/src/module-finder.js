SubVis.ModuleFinder = (function() {
    var that = {},
        $el,
        $input,
        $resultList,
        results,
        curWord,

        init = function() {
            $el = $('#module-finder');
            $input = $el.find('#word-finder');
            $resultList = $el.find('#finder-results-div');
            results = [];
            registerListeners();
            return that;
        },
        
        registerListeners = function() {
            $input.off().on('keypress', handleKeys);
        },
        
        handleKeys = function(event) {
            var key = event.keyCode,
                val = event.target.value;

            if(key === 13) {
                if(results.indexOf(val) < 0 && val.length > 2) {
                    results.push(val);
                    curWord = val;
                    $el.trigger('findWords', val);
                }
            }
        },
        
        render = function(data) {
            if(results.length > 5) {
                results.splice(0,1);
                $resultList.find('li').last().remove();
            }
            $resultList.prepend('<li class="finder-item">' + curWord + ' | Found: ' + data + '</li>');
        };
    
    that.init = init;
    that.render = render;
    return that;
})()