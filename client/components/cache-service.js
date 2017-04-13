'use strict';

/**
 * Service: Notice/Toast
 * Wrapper of the bower components for toast
 */
angular.module('app').factory('CacheService', function($q) {

  var cachedData= {};
  var CacheService = {
    isResourceValid: isResourceValid,
    invalidResource: invalidResource,
    flushCache: flushCache,
    setResource: setResource,
    getResource: getResource,
    updateElementInCachedArray : updateElementInCachedArray,
    addElementInCachedArray : addElementInCachedArray,
    removeElementInCachedArray : removeElementInCachedArray
  };

  function isResourceValid(resourceKey){
    if(cachedData[resourceKey] && cachedData[resourceKey].expirationTime > new Date()){
      return true;
    }
    return false;
  }

  function invalidResource(resourceKey){
    if(cachedData[resourceKey]){
      delete cachedData[resourceKey];
    }
  }

  function flushCache(){
    cachedData = {};
  }

  function setResource(resourceKey, resourceValue, validityTimeInSeconds){
    var expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime()+ 1000*validityTimeInSeconds);
    cachedData[resourceKey] = {
      data : angular.copy(resourceValue),
      expirationTime : expirationTime
    };
  }

  function getResource(resourceKey){
    if(cachedData[resourceKey]){
      return $q(function(resolve,reject){
        resolve(angular.copy(cachedData[resourceKey].data));
      });
    }
    return null;
  }

  function updateElementInCachedArray(resourceKey,newElement){
    if(cachedData[resourceKey] && cachedData[resourceKey].data && Array.isArray(cachedData[resourceKey].data)){
      var listOfElement = cachedData[resourceKey].data;
      var matchingIndex = listOfElement.findIndex(function(element){
        return element._id===newElement._id;
      });
      if(matchingIndex>-1){
        listOfElement[matchingIndex] = newElement;
        return true;
      }
    }
    return false;
  }

  function addElementInCachedArray(resourceKey, newElement){
    if(cachedData[resourceKey] && cachedData[resourceKey].data && Array.isArray(cachedData[resourceKey].data)){
      var listOfElement = cachedData[resourceKey].data;
      listOfElement.push(newElement);
      return true;
    }
    return false;
  }

  function removeElementInCachedArray(resourceKey,elementToRemove){
    if(cachedData[resourceKey] && cachedData[resourceKey].data && Array.isArray(cachedData[resourceKey].data)){
      var listOfElement = cachedData[resourceKey].data;
      var indexToRemove = listOfElement.findIndex(function(element){
        return element._id===elementToRemove._id;
      });
      if(indexToRemove>-1){
        listOfElement.splice(indexToRemove,1);
        return true;
      }
    }
    return false;
  }

  return CacheService;
});
