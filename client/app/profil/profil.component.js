(function() {
    'use strict';

    angular.module('app.profil').component('cwtProfil', {
        bindings: {
            onProfilEdited: '&'
        },
        controller: ProfilCtrl,
        controllerAs: 'profilCtrl',
        templateUrl: 'app/profil/profil.component.html'
    });

    function ProfilCtrl(ProfilService, usSpinnerService, Notice) {
        var profilCtrl = this;
        angular.extend(profilCtrl,{
            $onInit:init,
            saveProfil:saveProfil,
            cancel:cancel,
            deleteConnexion : deleteConnexion
        });

        function init(){
          usSpinnerService.spin('spinner-profil-edition');
          ProfilService.getAuthenticatedUserDetails().then(function(result) {
              profilCtrl.editedUser = result;
              usSpinnerService.stop('spinner-profil-edition');
          });
        }

        function saveProfil() {
            if (profilCtrl.profilForm.$valid) {
                ProfilService.updateAuthenticatedUserDetails(profilCtrl.editedUser)
                    .then(
                        function(editedUser) {
                            profilCtrl.onProfilEdited({
                                $event: {
                                    editedUser: editedUser
                                }
                            });
                        },
                        function(error) {
                            if (error.status == 401) {
                                Notice.info("Votre session vient d'être supprimée");
                                profilCtrl.onProfilEdited();
                            }
                        }
                    );
            }
        }

        function cancel() {
            profilCtrl.onProfilEdited();
        }

        function deleteConnexion(connexion) {
            connexion.deleted = true;
        }
    }

})();
