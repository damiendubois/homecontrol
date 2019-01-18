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
            runProgram: runProgram
        });

        function onInit() {
            HomeDefinitionService.getProgDefinition().then(function(progConf) {
                programSetupCtrl.progConf = progConf;
                weirdThingNeeded();
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
                    storeAct.store = programSetupCtrl.progConf.stores.find(function(st) {
                        return st.label === storeAct.store.label;
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

        function removeProgram(programToBeRemoved) {
            programSetupCtrl.programs = programSetupCtrl.programs.filter(function(program) {
                return programToBeRemoved !== program;
            });
        }


    }

})();