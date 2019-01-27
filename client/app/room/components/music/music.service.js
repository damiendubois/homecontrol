(function() {
    'use strict';

    angular.module('app.rooms').factory('MusicService',
        function($http, serverBaseUrl, Notice) {

            var MusicService = {
                playlists: {},
                playNext: playNext,
                shutdown: shutdown,
                playPlaylist: playPlaylist,
                playPrevious: playPrevious,
                playPause: playPause,
                stop: stop,
                getPlaylists: getPlaylists,
                volumeUp: volumeUp,
                volumeDown: volumeDown,
                setSleep: setSleep,
                getCurrentPlayingFile: getCurrentPlayingFile
            };

            return MusicService;

            function playNext(room) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "Player.GoTo", "id": 1, "params": { "playerid": 0, "to": "next" } } }).
                then(function() {
                    Notice.info('next');
                }).
                catch(function(error) {
                    Notice.error('error');
                });
            }

            function shutdown(room) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "System.Shutdown", "id": 1 } }).
                then(function() {
                    Notice.info('shuting down');
                }).
                catch(function(error) {
                    Notice.error('error');
                });
            }

            function playPlaylist(room, playlist) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "id": 1, "method": "Player.Open", "params": { "item": { "directory": playlist }, "options": { "shuffled": true } } } }).
                then(function() {
                    Notice.info('playing : ' + playlist);
                }).
                catch(function(error) {
                    Notice.error('error');
                });
            }

            function playPrevious(room) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "Player.GoTo", "id": 1, "params": { "playerid": 0, "to": "previous" } } }).
                then(function() {
                    Notice.info('previous');
                }).
                catch(function() {
                    Notice.error('error');
                });
            }

            function playPause(room) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "Player.PlayPause", "id": 1, "params": { "playerid": 0 } } }).
                then(function() {
                    Notice.info('play/pause');
                }).
                catch(function() {
                    Notice.error('error');
                });
            }


            function stop(room) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "Player.Stop", "id": 1, "params": { "playerid": 0 } } }).
                then(function() {
                    Notice.info('stop');
                }).
                catch(function() {
                    Notice.error('error');
                });
            }

            function getPlaylists(room) {
                if (!MusicService.playlists[room]) {
                    MusicService.playlists[room] = $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "Files.GetDirectory", "params": { "directory": "/storage/music/", "media": "files" }, "id": "1" } }).
                    then(function(serverResult) {
                        var objectReturned = serverResult.data;
                        try {
                            objectReturned = JSON.parse(serverResult.data);
                        } catch (e) {
                            console.log(e);
                        }
                        if (objectReturned.result && objectReturned.result.files) {
                            return objectReturned.result.files;
                        }
                        return [];
                    }).
                    catch(function() {
                        Notice.error('error');
                    });
                }
                return MusicService.playlists[room];
            }

            function volumeUp(room) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "Application.SetVolume", "id": "1", "params": { "volume": "increment" } } }).
                then(function() {
                    Notice.info('volume up');
                }).
                catch(function() {
                    Notice.error('error');
                });
            }


            function volumeDown(room) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "Application.SetVolume", "id": "1", "params": { "volume": "decrement" } } }).
                then(function() {
                    Notice.info('volume down');
                }).
                catch(function() {
                    Notice.error('error');
                });
            }

            function setSleep(host, plug, minutes) {
                return $http.post(serverBaseUrl + '/music/sleep', { host: host, plug: plug, sleepMinutes: minutes }).
                then(function() {
                    Notice.info('sleep set');
                }).
                catch(function() {
                    Notice.error('error');
                });
            }

            function getCurrentPlayingFile(room, callback) {
                return $http.post(serverBaseUrl + '/music', { room: room, jsonToSend: { "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 0 }, "id": "AudioGetItem" } }).
                then(function(serverResult) {
                    var objectReturned = serverResult.data;
                    try {
                        objectReturned = JSON.parse(serverResult.data);
                    } catch (e) {
                        console.log(e);
                    }

                    if (objectReturned.result && objectReturned.result.item) {
                        return objectReturned.result.item;
                    }
                }).
                catch(function() {
                    Notice.error('error getting current playing music');
                });
            }

















        }

    );
})();