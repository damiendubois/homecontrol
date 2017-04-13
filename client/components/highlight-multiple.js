'use strict';

angular.module('app').filter('highlightMultiple', function($sce,$filter) {
  return function(text, phrase) {
      if(!text ||text===''){
          return text;
         }
      text = text.toString();
      if(phrase){
            var tags = [];
            findTagsForMark(phrase.replace(/"/g, ''),text,tags);
            tags = $filter('orderBy')( tags, 'index');
            text = returnHtmlAsString(text,tags);
      }

      return $sce.trustAsHtml(text.toString());
  };
});


function findTagsForMark(phrase,text,tags){
     if(phrase){
            angular.forEach(phrase.split(' '),function(word){
                if (word){
                    var index = text.toLowerCase().indexOf(word.toLowerCase());
                    if(index>-1){
                        tags.push({type: 'beginMark', index:index});
                        tags.push({type: 'endMark', index:index + word.length});
                    }
                }
            });
      }
}

function returnHtmlAsString(text,tags){
    var textToReturn= text;
    for(var k = tags.length-1;k>=0;k--){
        var tag=tags[k];
        if(tag.type==='beginSpan'){
            textToReturn = [textToReturn.slice(0, tag.index),'<span class="txt-impacted txt-bold">' , textToReturn.slice(tag.index)].join('');
        }
        if(tag.type==='endSpan'){
            textToReturn = [textToReturn.slice(0, tag.index),'</span>' , textToReturn.slice(tag.index)].join('');
        }
        if(tag.type==='beginMark'){
            textToReturn = [textToReturn.slice(0, tag.index),'<mark class="highlighted">' , textToReturn.slice(tag.index)].join('');
        }
        if(tag.type==='endMark'){
            textToReturn = [textToReturn.slice(0, tag.index),'</mark class="highlighted">' , textToReturn.slice(tag.index)].join('');
        }
    }
    return textToReturn;
}