'use strict';

angular.module('app').factory('HomeDefinitionService', function($http, Notice, serverBaseUrl) {

    var homeDefinition;

    var homeDefinitionService = {
        getHomeDefinition: getHomeDefinition,
        getRoomConf: getRoomConf,
        getProgDefinition: getProgDefinition
    };

    return homeDefinitionService;

    function getHomeDefinition() {
        loadHomeDefinition();
        return homeDefinition;
    }

    function getRoomConf(roomId) {
        loadHomeDefinition();
        return homeDefinition.then(function(homeDefFromServer) {
            var allRooms = homeDefFromServer.rooms;
            var filteredRoom = allRooms.filter(function(oneRoom) {
                return oneRoom.id == roomId;
            });
            if (filteredRoom.length) {
                return filteredRoom[0];
            }
        });
    }

    function getProgDefinition() {
        loadHomeDefinition();
        return homeDefinition.then(function(homeDefFromServer) {
            return homeDefFromServer.programmables;
        });
    }

    function loadHomeDefinition() {
        if (!homeDefinition) {
            homeDefinition = $http.get(serverBaseUrl + '/homedef').
            then(function(response) {
                return response.data;
            }).
            catch(function(error) {
                Notice.error("An error occured on server please contact administrator");
            });
        }
    }

});