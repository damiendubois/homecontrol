(function() {
    'use strict';

    angular.module('app.login').component('cwtForgotPassword', {
        bindings: {
            onProcessDone: '&'
        },
        controller: ForgotPasswordCtrl,
        controllerAs: 'forgotPasswordCtrl',
        templateUrl: 'app/login/components/forgot-password/forgot-password.component.html'
    });

    function ForgotPasswordCtrl(Notice,AuthService) {
        var forgotPasswordCtrl = this;
        angular.extend(forgotPasswordCtrl, {
            $onInit: init,
            sendNewPassword: sendNewPassword,
            setCaptchaResponse:  setCaptchaResponse,
            captchaKey : '6Lc5chMUAAAAADf_rDW1WenvHMXWyVNMqdTg0Aq7',
            user: {}
        });

        function init() {

        }

        function sendNewPassword() {
            AuthService.resetPassword(forgotPasswordCtrl.username,forgotPasswordCtrl.captchaResponse)
              .then(function(){
                Notice.info("Un nouveau mot de passe va vous être envoyé par email");
                forgotPasswordCtrl.onProcessDone();
              })
              .catch(function(error){
                  Notice.error("Une erreur est survenue.");
              });

        }

        function setCaptchaResponse(response){
          forgotPasswordCtrl.captchaResponse = response;
        }


    }

})();
