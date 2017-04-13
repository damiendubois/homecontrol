(function() {
    'use strict'; 

    angular.module('app.users').filter('userFilter',['SearchService',function(SearchService ){
    var fieldsToSearch= ([{pathToFind:['name']},{pathToFind:['email']},{pathToFind:['permissions']}]);
    var globalFilter= SearchService.getGenericGlobalFilter(fieldsToSearch);
    var exactFilter = SearchService.getGenericExactFilter(fieldsToSearch);
    return SearchService.getSearchAllAsArrayFilter(globalFilter,exactFilter);
  }]);

})();