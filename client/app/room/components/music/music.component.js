(function() {
    'use strict';

    angular.module('app.rooms').component('music', {
        bindings: {
            room: '<'
        },
        controller: MusicCtrl,
        controllerAs: 'musicCtrl',
        templateUrl: 'app/room/components/music/music.component.html'
    });

    function MusicCtrl(MusicService, $interval, RFService) {
        var musicCtrl = this;

        angular.extend(musicCtrl, {
            $onInit: onInit,
            turnOnMusic: turnOnMusic,
            turnOffMusic: turnOffMusic,
            playlists: [],
            playPlaylist: playPlaylist,
            volumeDown: volumeDown,
            volumeUp: volumeUp,
            setSleepMusic: setSleepMusic,
            previousSong: previousSong,
            pauseSong: pauseSong,
            playSong: playSong,
            stopSong: stopSong,
            nextSong: nextSong,
            playingMusic: {},
            playingMusicPolling: null,
            callToGetMusicCameBack: true
        });

        function onInit() {
            MusicService.getPlaylists(musicCtrl.room.music.host).then(function(playlists) {
                musicCtrl.playlists = playlists;
            });
            musicCtrl.callToGetMusicCameBack = false;
            MusicService.getCurrentPlayingFile(musicCtrl.room.music.host).then(function(data) {
                musicCtrl.playingMusic = data;
                musicCtrl.callToGetMusicCameBack = true;
            });

            if (!musicCtrl.playingMusicPolling) {
                musicCtrl.callToGetMusicCameBack = false;
                musicCtrl.playingMusicPolling = $interval(function() {
                    if (!musicCtrl.callToGetMusicCameBack) {
                        return;
                    }
                    MusicService.getCurrentPlayingFile(musicCtrl.room.music.host)
                        .then(function(data) {
                            musicCtrl.playingMusic = data;
                            musicCtrl.callToGetMusicCameBack = true;
                        });
                }, 20000);
            }

        }

        function playPlaylist(playlist) {
            MusicService.playPlaylist(musicCtrl.room.music.host, playlist);
        }

        function turnOnMusic() {
            RFService.switchPlug(musicCtrl.room.music.plug, "on");
        }

        function turnOffMusic() {
            MusicService.stop(musicCtrl.room.music.host);
            RFService.switchPlug(musicCtrl.room.music.plug, "off");
        }

        function previousSong() {
            MusicService.playPrevious(musicCtrl.room.music.host);
        }

        function playSong() {
            MusicService.playPause(musicCtrl.room.music.host);
        }

        function pauseSong() {
            MusicService.playPause(musicCtrl.room.music.host);
        }

        function stopSong() {
            MusicService.stop(musicCtrl.room.music.host);
        }

        function nextSong() {
            MusicService.playNext(musicCtrl.room.music.host);
        }

        function volumeUp() {
            MusicService.volumeUp(musicCtrl.room.music.host);
        }

        function volumeDown() {
            MusicService.volumeDown(musicCtrl.room.music.host);
        }

        function setSleepMusic() {
            MusicService.setSleep(musicCtrl.room.music.host, musicCtrl.room.music.plug, musicCtrl.sleepMinutes);

        }

    }

})();