(function() {
    'use strict';

    angular.module('app.programs').factory('ProgramService',
        function($http, serverBaseUrl, Notice) {

            var pathToProgram = '/program/';

            var ProgramService = {
                getPrograms: getPrograms,
                savePrograms: savePrograms,
                runProgram: runProgram
            };

            function getPrograms() {
                return $http.get(serverBaseUrl + pathToProgram)
                    .then(function(result) {
                        return result.data;
                    })
                    .catch(function(error) {
                        Notice.error("Impossible to retrieve programs");
                    });
            }

            function savePrograms(programs) {
                return $http.put(serverBaseUrl + pathToProgram, { programs: programs })
                    .then(function(result) {
                        Notice.info("programs saved ");
                    })
                    .catch(function(error) {
                        Notice.error("Impossible to save programs");
                    });
            }

            function runProgram(program) {
                return $http.post(serverBaseUrl + pathToProgram, { program: program })
                    .then(function(result) {
                        Notice.info("programs running ");
                    })
                    .catch(function(error) {
                        Notice.error("Impossible to run the program");
                    });
            }


            return ProgramService;

        }

    );
})();