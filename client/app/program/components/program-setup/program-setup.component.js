(function() {
    'use strict';

    angular.module('app.programs').component('programSetup', {
        bindings: {},
        controller: ProgramSetupCtrl,
        controllerAs: 'programSetupCtrl',
        templateUrl: 'app/program/components/program-setup/program-setup.component.html'
    });

    function ProgramSetupCtrl(HomeDefinitionService, ProgramService, MusicService) {
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
            addPlugAction: addPlugAction,
            removePlugAction: removePlugAction,
            playlistsPerHost: {}
        });

        function onInit() {
            HomeDefinitionService.getProgDefinition().then(function(progConf) {
                programSetupCtrl.progConf = progConf;
                weirdThingNeeded();
                progConf.musics.forEach(function(music) {
                    MusicService.getPlaylists(music.host).then(function(playlists) {
                        programSetupCtrl.playlistsPerHost[music.host] = playlists;
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
                program.plugActions.forEach(function(plugAct) {
                    if (!plugAct.plug || !plugAct.plug.label) {
                        return;
                    }
                    plugAct.plug = programSetupCtrl.progConf.plugs.find(function(plug) {
                        return plug.label === plugAct.plug.label;
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
                storeActions: [],
                plugActions: [],
                musicActions: []
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

        function addPlugAction(program) {
            var newPlugAction = {
                plug: null,
                action: null,
            };
            program.plugActions.push(newPlugAction);
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

        function removePlugAction(program, plugAction) {
            program.plugActions = program.plugActions.filter(function(onePlugAction) {
                return plugAction !== onePlugAction;
            });
        }

        function removeProgram(programToBeRemoved) {
            programSetupCtrl.programs = programSetupCtrl.programs.filter(function(program) {
                return programToBeRemoved !== program;
            });
        }


    }

})();