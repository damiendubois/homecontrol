'use strict';

/**
 * Service: Notice/Toast
 * Wrapper of the bower components for toast
 */
angular.module('app').factory('Notice', function(toastr) {

  var Notice = {};

  // Success notice
  Notice.success = function( message ) {
    toastr.clear();
    toastr.success( message );
  };

  // Info notice
  Notice.info = function( message ) {
    toastr.clear();
    toastr.info( message, 'Info');
  };

  // Warning notice
  Notice.warning = function( message ) {
    toastr.clear();
    toastr.warning( message, 'Warning', {timeOut: 5000});
  };

  // Error notice. options can be omitted if the default ones are fine for you.
  Notice.error = function(message, options) {
    toastr.clear();
    var theOptions = {timeOut: 5000};
    if (options) {
        angular.extend(theOptions, options);
    }
    toastr.error(message, 'Error', theOptions);
  };

  return Notice;

});

angular.module('app').config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    closeButton: true,
    timeOut: 3000,
    positionClass: 'toast-bottom-right'
  });
});
