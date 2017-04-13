(function() {
    'use strict';

  angular.module('app.rooms').component('music', {
    bindings: {
      room : '<'
    },
    controller: MusicCtrl,
    controllerAs: 'musicCtrl',
    templateUrl: 'app/room/components/music/music.component.html'
  });

  function MusicCtrl(MusicService,$interval,RFService) {
      var musicCtrl =this;

      angular.extend(musicCtrl,{
        $onInit : onInit,
        turnOnMusic:turnOnMusic,
        turnOffMusic:turnOffMusic,
        playlists:[],
        playPlaylist:playPlaylist,
        volumeDown:volumeDown,
        volumeUp:volumeUp,
        setSleepMusic:setSleepMusic,
        previousSong:previousSong,
        pauseSong:pauseSong,
        playSong:playSong,
        stopSong:stopSong,
        nextSong:nextSong,
        playingMusic: {},
        playingMusicPolling: null
      });

      function onInit(){
        MusicService.getPlaylists(musicCtrl.room.music.host).then(function(playlists){
          musicCtrl.playlists = playlists;
        });

        MusicService.getCurrentPlayingFile(musicCtrl.room.music.host).then(function(data){
            musicCtrl.playingMusic = data;
        });

        if(!musicCtrl.playingMusicPolling){
            musicCtrl.playingMusicPolling = $interval(function(){
                MusicService.getCurrentPlayingFile(musicCtrl.room.music.host)
                .then(function(data){
                    musicCtrl.playingMusic = data;
                });
            }, 10000);
        }

      }

      function playPlaylist(playlist){
          MusicService.playPlaylist(musicCtrl.room.host,playlist);
      }

      function turnOnMusic(){
          RFService.switchPlug(musicCtrl.room.music.plug,"on");
      }

      function turnOffMusic(){
          MusicService.stop(musicCtrl.room.music.host);
          RFService.switchPlug(musicCtrl.room.music.plug,"off");
      }

      function previousSong(){
          MusicService.playPrevious(musicCtrl.room.music.host);
      }

      function playSong(){
          MusicService.playPause(musicCtrl.room.music.host);
      }

      function pauseSong(){
          MusicService.playPause(musicCtrl.room.music.host);
      }

      function stopSong(){
          MusicService.stop(musicCtrl.room.music.host);
      }

      function nextSong(){
          MusicService.playNext(musicCtrl.room.music.host);
      }

      function volumeUp(){
          MusicService.volumeUp(musicCtrl.room.music.host);
      }

      function volumeDown(){
          MusicService.volumeDown(musicCtrl.room.music.host);
      }
      function setSleepMusic(){
        MusicService.setSleep(musicCtrl.room.music.host,musicCtrl.room.music.plug,musicCtrl.sleepMinutes);

      }

  }

})();
