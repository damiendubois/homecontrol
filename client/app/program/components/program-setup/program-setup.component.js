(function() {
    'use strict';

    angular.module('app.programs').component('programSetup', {
        bindings: {},
        controller: ProgramSetupCtrl,
        controllerAs: 'programSetupCtrl',
        templateUrl: 'app/program/components/program-setup/program-setup.component.html'
    });

    function ProgramSetupCtrl(HomeDefinitionService, ProgramService) {
        var programSetupCtrl = this;

        angular.extend(programSetupCtrl, {
            $onInit: onInit,
            progConf: { stores: [] },
            addProgram: addProgram,
            saveProgram: saveProgram,
            addStoreAction: addStoreAction,
            removeStoreAction: removeStoreAction,
            runProgram: runProgram,
            removeProgram: removeProgram,
            addMusicAction: addMusicAction,
            removeMusicAction: removeMusicAction,
            playlistsPerHost: {}
        });

        function onInit() {
            HomeDefinitionService.getProgDefinition().then(function(progConf) {
                programSetupCtrl.progConf = progConf;
                weirdThingNeeded();
                progConf.musics.forEach(function(music) {
                    MusicService.getPlaylists(music.host).then(function(playlists) {
                        programSetupCtrl.playlists[music.host] = playlists;
                    });
                });
            });
            ProgramService.getPrograms().then(function(programs) {
                programSetupCtrl.programs = programs;
                weirdThingNeeded();
            });
        }

        function weirdThingNeeded() {
            if (!programSetupCtrl.programs || !programSetupCtrl.progConf) {
                return;
            }
            programSetupCtrl.programs.forEach(function(program) {
                program.storeActions.forEach(function(storeAct) {
                    if (!storeAct.store || !storeAct.store.label) {
                        return;
                    }
                    storeAct.store = programSetupCtrl.progConf.stores.find(function(st) {
                        return st.label === storeAct.store.label;
                    });
                });
                program.musicActions.forEach(function(musicAct) {
                    if (!musicAct.music || !musicAct.music.label) {
                        return;
                    }
                    musicAct.music = programSetupCtrl.progConf.musics.find(function(mus) {
                        return mus.label === musicAct.music.label;
                    });
                });
            });

        }


        function addProgram() {
            var newProgram = {
                name: 'New program',
                isOn: true,
                hour: 8,
                min: 0,
                frequency: {},
                storeActions: []
            };
            programSetupCtrl.programs.push(newProgram);
        }

        function addStoreAction(program) {
            var newStoreAction = {
                action: null,
                store: null
            };
            program.storeActions.push(newStoreAction);
        }

        function addMusicAction(program) {
            var newMusicAction = {
                playlist: null,
                lastTime: null,
                music: null
            };
            program.musicActions.push(newMusicAction);
        }


        function saveProgram() {
            ProgramService.savePrograms(programSetupCtrl.programs);
        }

        function runProgram(program) {
            ProgramService.runProgram(program);
        }

        function removeStoreAction(program, storeAction) {
            program.storeActions = program.storeActions.filter(function(oneStoreAction) {
                return storeAction !== oneStoreAction;
            });
        }

        function removeMusicAction(program, musicAction) {
            program.musicActions = program.musicActions.filter(function(oneMusicAction) {
                return musicAction !== oneMusicAction;
            });
        }

        function removeProgram(programToBeRemoved) {
            programSetupCtrl.programs = programSetupCtrl.programs.filter(function(program) {
                return programToBeRemoved !== program;
            });
        }


    }

})();