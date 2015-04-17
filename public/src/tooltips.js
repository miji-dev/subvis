SubVis.Tooltips = (function() {
    var that = {},
        $tooltips,

        init = function() {
            $tooltips = $('.tooltip');
            registerListeners();
            return that;
        },
        
        generateTooltip = function(event) {
            var id = event.currentTarget.parentNode.parentNode.id.split('-')[1],
                text = getTooltipText(id),
                $container = $('<div class="tooltip-container' + (id == "statistics" ? " lefty" : "") + '">'),
                $title = $('<h5 class="tooltip-header">'),
                $content = $('<p class="tooltip-content">');

            $title.html(text[0]);
            $content.html(text[1]);
            $container.append($title).append($content);
            return $container;
        },
        
        getTooltipText = function(which) {
            switch (which) {
                case 'finder':
                    return ['Finder Module', "Here you can search for a certain word and you will retrieve how many times this word occurs in the subtitle. Up to 5 of the last searches will be shown in the module."];
                case 'meta':
                    return ['Meta Module','The Meta Module shows general movie information, mostly independent from the subtitle file'];
                case 'time':
                    return ['Time Module',"The Time Module shows some time related information, that is the moments when the first and last sequences are shown, the amount of all sequences and the overall speech duration."];
                case 'settings':
                    return ['Settings Module',"Here you can remove the first and/or last sequence from the subtitle. That comes in handy if there are ads or credits in the subtitle file that you don't want to take into account. This action might take a while due to several recalculations."];
                case 'sentiment':
                    return ['Sentiment Module',"The Sentiment Module shows the calculated sentiment score of the movie's subtitle and a list of the words that are mainly responsible for the positive and negative values."];
                case 'statistics':
                    return ['Statistics Module',"The Statistics Module holds some information regarding words and sentences."];
                case 'timeline':
                    return ['Timeline Module',"The Timeline Module is SubVis' main module. Here you can see at what precise moments of the movie there are spoken words. Via the interval control you can determine how many sequences will be analysed together. That control can be adjusted between 1 min and the movie length as maximum. By clicking on one of the bars in the timeline the modules will no longer show the overall movie analysis but only the selected interval. Just play with the controls and find the analysis that fits your needs best."];
                case 'toplists':
                    return ['Toplists Module', 'Here there are some Top 5 lists partitioned by the part of speech.'];
                case 'sequence':
                    return ['Sequence Module', 'The Sequence Module shows the actual subtitle text of the currently selected interval. Each word is colour-coded depending on its part of speech. Via Mouseover you can see the part of speech code of the selected word.'];
                case 'wordcloud':
                    return ['Wordcloud Module', 'Here there is a word cloud visualisation of all the words of the currently selected interval. The word cloud can be downloaded as png or svg via the corresponding buttons.'];
                default:
                    return ['No title availabel','No text available'];
            }
        },
        
        registerListeners = function() {
            $tooltips.off().on('mouseenter', function(event) {
                $(event.currentTarget).append(generateTooltip(event));
            }).on('mouseleave', function(event) {
                $(event.currentTarget).find('div').remove();
            })
        };

    that.init = init;
    return that;
})();