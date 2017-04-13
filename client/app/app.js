'use strict';

angular.module('app', [
    'ui.bootstrap',
    'cwt.gui',
    'ui.router',
    'toggle-switch',
    'toastr',
    'app.layout',
    'app.config',
    'app.login',
    'app.users',
    'app.profil',
    'app.rooms'])

.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});
