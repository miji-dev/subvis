SubVis.ModuleFinder = (function() {
    var that = {},
        $el,
        $input,

        init = function() {
            $el = $('#module-finder');
            $input = $el.find('#word-finder');
            $resultBox = $el.find('#finder-results-div');
            registerListeners();
            return that;
        },
        
        registerListeners = function() {
            $input.off().on('keypress', handleKeys);
        },
        
        handleKeys = function(event) {
            var key = event.keyCode;
            if(key === 13) {
                $el.trigger('findWords',event.target.value);
            }
        },
        
        render = function(data) {
            $resultBox.find('.finder-item').remove();
            $resultBox.append('<p class="finder-item">Found: ' + data + '</p>');
        };
    
    that.init = init;
    that.render = render;
    return that;
})()