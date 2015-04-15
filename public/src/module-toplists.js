SubVis.ModuleTopLists = (function() {
    var that = {},
        $el,
        $items,

        init = function(fl) {
            $el = $('#module-toplists');
            $items = $el.find('h4');
            render(fl);
            return that;
        },
        
        render = function(freqLists) {
            var listArray = [freqLists.wordList,freqLists.verbList,freqLists.nounList,freqLists.adjectiveList,freqLists.adverbList,freqLists.entityList],
                textArray = ['<ol class="toplist-list">','<ol class="toplist-list">','<ol class="toplist-list">','<ol class="toplist-list">','<ol class="toplist-list">','<ol class="toplist-list">'],
                item;
                
            $('.toplist-list').remove();

            for(var i = 0; i < 5; i++) {
                for(var j = 0; j < listArray.length; j++) {
                    item = listArray[j][i];
                    if(!item) {
                        continue;
                    }
                    textArray[j] += '<li class="toplist-item"><span class="key toplist-key"> ' + item.key + ' </span><span class="amount toplist-amount"> ' + item.amount + ' </span></li>';
                    if(i == 4) {
                        textArray[j] += '</ol>';
                    }
                }
            }
            
            for(var i = 0; i < $items.length; i++) {
                $($items[i]).after(textArray[i]);
            }
        };
        
        that.init = init;
        that.render = render;

        return that;
})();