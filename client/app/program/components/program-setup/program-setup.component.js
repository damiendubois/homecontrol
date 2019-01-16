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
            configuration: {}
        });

        function onInit() {
            HomeDefinitionService.getProgDefinition().then(function(roomconf) {
                programSetupCtrl.configuration = roomconf;
            });
            ProgramService.getPrograms().then(function(programs) {
                programSetupCtrl.programs = programs;
            });
        }


        function addProgram() {
            var newProgram = {
                name: 'New program',
                isOn: true,
                hour: 8,
                min: 0,
                frequency: {},
                store: {
                    isOn: true
                }
            };
            programSetupCtrl.programs.push(newProgram);
        }

        function saveProgram() {
            ProgramService.savePrograms(programSetupCtrl.programs);
        }

        function removeProgram(programToBeRemoved) {
            programSetupCtrl.programs = programSetupCtrl.programs.filter(function(program) {
                return programToBeRemoved !== program;
            });
        }


    }

})();