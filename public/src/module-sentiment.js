SubVis.ModuleSentiment = (function() {
    var that = {},
        $el,
        
        init = function(data) {
            $el = $('#module-sentiment');
            render(data);

            return that;
        },
        
        render = function(data) {
            var pos = '<h4>Positive</h4><ul class="sentiment-list-pos">';
            var neg = '<h4>Negative</h4><ul class="sentiment-list-neg">';

            for(var i = 0; i < 5; i++) {
                var posItem = data.positiveList[i],
                    negItem = data.negativeList[i];
                
                if(posItem) {
                    pos += '<li class="sentiment-pos-item"><span class="key sentiment-pos-key">' + posItem.key + '</span><span class="amount sentiment-pos-amount">' + posItem.amount + '</span></li>';
                }
                if(negItem) {
                    neg += '<li class="sentiment-neg-item"><span class="key sentiment-neg-key">' + negItem.key + '</span><span class="amount sentiment-neg-amount">' + negItem.amount + '</span></li>';
                }
            }

            pos += '</ul>';
            neg += '</ul>';
            $el.find('.module-item').html(data.score.toFixed(2));
            $el.find('#pos-neg').empty().html(pos + neg);
        };
        
        that.init = init;
        that.render = render;
        return that;
})();