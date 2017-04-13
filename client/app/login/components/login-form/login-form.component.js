(function() {
    'use strict';

    angular.module('app.login').component('cwtLoginForm', {
        bindings: {
            onLogged: '&'
        },
        controller: LoginCtrl,
        controllerAs: 'loginCtrl',
        templateUrl: 'app/login/components/login-form/login-form.component.html'
    });

    function LoginCtrl(AuthService, usSpinnerService, Notice) {
        var loginCtrl = this;
        angular.extend(loginCtrl, {
            $onInit: init,
            login: login,
            user: {}
        });

        function init() {

        }

        function login() {
            usSpinnerService.spin('spinner-login');
            AuthService.login(loginCtrl.user).then(function(msg) {
                usSpinnerService.stop('spinner-login');
                loginCtrl.onLogged();
            }, function(err) {

                usSpinnerService.stop('spinner-login');
                if(err.status===400){
                  Notice.error("L'utilisateur ou le mot de passe est inccorect");
                }
                if(err.status ===423){
                  Notice.error("L'utilisateur est bloqué");
                }
            });
        }

    }

})();
