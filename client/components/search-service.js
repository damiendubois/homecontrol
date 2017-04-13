'use strict';

/**
 * Service to handle errors from backend
 */
angular.module('app').factory('SearchService', ['$filter',function($filter) {

  var searchService={};

  // Success notice
  searchService.getSearchAllFilter =  function(filterGlobal,filterExact){
         return function( iElement,searchString ) {
            var toBeSearched = searchString;
            var exactMatchesString=[];
            if(!searchString || searchString===''){
                return true;
            }
            var isToBeDisplayed = true;
            var quoteSplitArray=searchString.split('"');
            if(quoteSplitArray.length%2===1){
                angular.forEach(quoteSplitArray,function(value, index){
                    if(index%2===1){
                        exactMatchesString.push(value);
                    }
                });
                toBeSearched=toBeSearched.replace(/"/g, '');
            }
            var searchStrings= toBeSearched.split(' ');
            for (var i = 0; i < searchStrings.length; i++) {
              isToBeDisplayed= isToBeDisplayed && filterGlobal(iElement,searchStrings[i]);
            }
            for (i = 0; i < exactMatchesString.length; i++) {
                if(exactMatchesString[i] && exactMatchesString[i]!==''){
                    isToBeDisplayed=isToBeDisplayed && filterExact(iElement,exactMatchesString[i]);
                }
            }

            return isToBeDisplayed;
        };
  };


    // Return the element or not
  searchService.getSearchAllAsArrayFilter =  function(filterGlobal,filterExact){
         return function( elements,searchString ) {
            var toBeSearched = searchString;
            var exactMatchesString=[];
            if(!searchString || searchString===''){
                return elements;
            }
            //split the search strings into all the strings to be found
            var quoteSplitArray=searchString.split('"');
            if(quoteSplitArray.length%2===1){
                angular.forEach(quoteSplitArray,function(value, index){
                    if(index%2===1){
                        exactMatchesString.push(value);
                    }
                });
                toBeSearched=toBeSearched.replace(/"/g, '');
            }

            var filteredElements = [];
            for (var elementIndex=0;elementIndex<elements.length;elementIndex++){
              var iElement =  elements[elementIndex];
              var isToBeDisplayed = true;
              var searchStrings= toBeSearched.split(' ');
              for (var i = 0; i < searchStrings.length; i++) {
                isToBeDisplayed= isToBeDisplayed && filterGlobal(iElement,searchStrings[i]);
              }
              for (i = 0; i < exactMatchesString.length; i++) {
                  if(exactMatchesString[i] && exactMatchesString[i]!==''){
                      isToBeDisplayed=isToBeDisplayed && filterExact(iElement,exactMatchesString[i]);
                  }
              }

              if(isToBeDisplayed){
                filteredElements.push(iElement);
              }

            }
           return filteredElements ;
        };
  };

    function getFilteredObjectAfterOneFilter(object,filterToApply){
        if(filterToApply.name){
            if(filterToApply.params){
                var paramsForFilter = [object].concat(filterToApply.params);
                return $filter(filterToApply.name).apply(null,paramsForFilter);
            }
            return $filter(filterToApply.name)(object);
        }else{
            return object;
        }
    }

    function getFilteredObjectAfterAllFilters(object, filtersToApply){
        if(!filtersToApply){
            return object;
        }
        var toCompare;
        if( filtersToApply.constructor === Array){
            toCompare = object;
            for(var i =0;i<filtersToApply.length;i++){
                toCompare = getFilteredObjectAfterOneFilter(toCompare,filtersToApply[i]);
            }
        }else{
            toCompare = getFilteredObjectAfterOneFilter(object,filtersToApply);
        }
        return toCompare;
    }

    function doesSearchStringIsExact(filterToApply,searchString,objectToCheck){
            return getFilteredObjectAfterAllFilters(objectToCheck,filterToApply).toString().toLowerCase()===searchString.toLowerCase();

    }


    function doesSearchStringContain(filterToApply,searchString,objectToCheck){
            return getFilteredObjectAfterAllFilters(objectToCheck,filterToApply).toString().toLowerCase().indexOf(searchString.toLowerCase())>-1;

    }



//recursive over pathToFind length : It must be an array of string
    searchService.recursiveSearchOverJsonObject=function(pathToFind, jsonObject, searchString,
        filterToApply, matchFunction ){
        if(pathToFind.length === 0){
             if(jsonObject.constructor === Array){
                    for(var i =0;i<jsonObject.length;i++){
                        if( matchFunction(filterToApply,searchString,jsonObject[i])){
                            return true;
                        }
                    }
                    return false;
             }
             if(jsonObject){
                return matchFunction(filterToApply,searchString,jsonObject);
             }
        }else{
             if(jsonObject.constructor === Array){
                 for(var j =0;j<jsonObject.length;j++){
                     if(jsonObject[j][pathToFind[0]]){
                         if(searchService.recursiveSearchOverJsonObject(pathToFind.slice(1),jsonObject[j][pathToFind[0]],searchString,filterToApply,matchFunction)){
                             return true;
                         }
                     }
                 }
                 return false;
             }
             if(jsonObject[pathToFind[0]]){
                return searchService.recursiveSearchOverJsonObject(pathToFind.slice(1),jsonObject[pathToFind[0]],searchString,filterToApply,matchFunction);
             }
             return false;
        }
    };


    searchService.getGenericGlobalFilter = function(searchFieldsWithFilters){
        return function(jsonObject,searchString){
            for(var i = 0; i<searchFieldsWithFilters.length;i++){
                var pathToFind = searchFieldsWithFilters[i].pathToFind;
                var filterToApply = searchFieldsWithFilters[i].filterToApply;
                if(searchService.recursiveSearchOverJsonObject(pathToFind, jsonObject, searchString,filterToApply,doesSearchStringContain)){
                    return true;
                }
            }
            return false;
        };
    };

    searchService.getGenericExactFilter = function(searchFieldsWithFilters){
        return function(jsonObject,searchString){
            for(var i = 0; i<searchFieldsWithFilters.length;i++){
                var pathToFind = searchFieldsWithFilters[i].pathToFind;
                var filterToApply = searchFieldsWithFilters[i].filterToApply;
                if(searchService.recursiveSearchOverJsonObject(pathToFind, jsonObject, searchString,filterToApply,doesSearchStringIsExact)){
                    return true;
                }
            }
            return false;
        };
    };



  return searchService;
}]);
