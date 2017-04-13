(function() {
    'use strict';

    angular.module('app.login').service('AuthService', ['$q', '$http', 'serverBaseUrl', '$state','CacheService',
        function($q, $http, serverBaseUrl, $state,CacheService) {

            var LOCAL_TOKEN_KEY = 'homecontrol-fr-key';
            var isAuthenticated = false;
            var authToken;
            var user = {};

            function loadUserCredentials() {
                var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                if (token) {
                    useCredentials(token);
                }
            }

            function storeUserCredentials(token) {
                window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
                useCredentials(token);
            }

            function storeUserPermissions(permissions) {
                user.permissions = permissions;
            }

            function useCredentials(token) {
                isAuthenticated = true;
                authToken = token;

                // Set the token as header for your requests!
                $http.defaults.headers.common.Authorization = authToken;
            }

            var destroyUserCredentials = function() {
                authToken = undefined;
                isAuthenticated = false;
                user = {};
                $http.defaults.headers.common.Authorization = undefined;
                window.localStorage.removeItem(LOCAL_TOKEN_KEY);
            };

            var resetPassword = function(username, captchaResponse){
              var user= {
                name : username,
                captchaResponse: captchaResponse
              };
              return $http.post(serverBaseUrl + '/user/reset', user);
            };

            var isUserSet = function() {
                return (user.name && user.permissions && user.name !== '');
            };

            var setUser = function() {
                return $q(function(resolve, reject) {
                    $http.get(serverBaseUrl + '/user/logged', {}).then(function(result) {
                        if (result.data.success) {
                            user.name = result.data.user.name;
                            user.permissions = result.data.user.permissions;
                        } else {
                            reject(result.data.msg);
                        }
                    });
                });
            };

            var getUser = function() {
                return user;
            };

            var hasPermission = function(perm) {
                if (!isUserSet()) {
                    return false;
                }
                return user.permissions.includes(perm);
            };

            var login = function(user) {
                return $q(function(resolve, reject) {
                    $http.post(serverBaseUrl + '/user/logged', user).then(function(result) {
                        if (result.data.success) {
                            storeUserCredentials(result.data.token);
                            storeUserPermissions(result.data.permissions);
                            resolve(result.data.msg);
                        } else {
                            reject(result.data.msg);
                        }
                    }, function(err) {
                        reject(err);
                    });
                });
            };

            var logout = function() {
                if ($http.defaults.headers.common.Authorization !== undefined) {
                    CacheService.flushCache();
                    $http.delete(serverBaseUrl + '/user/logged', {}).then(function(result) {
                        if (result.data.success) {
                            destroyUserCredentials();
                            $state.go('app.login');
                        } else {
                            $q.reject(result.data.msg);
                        }
                    });
                }
            };

            loadUserCredentials();

            return {
                login: login,
                resetPassword: resetPassword,
                setUser: setUser,
                getUser: getUser,
                isUserSet: isUserSet,
                destroySessionToken: destroyUserCredentials,
                hasPermission: hasPermission,
                logout: logout,
                isAuthenticated: function() {
                    return isAuthenticated; }
            };
        }
    ]);
})();
