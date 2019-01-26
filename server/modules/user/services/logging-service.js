'use strict';

var userService = require('./user-service');
var userDao = require('../dao/user-dao');
var jwt = require('jwt-simple');
var config = require('../../../config/environment');
var logger = require('../../../services/logger-service')(module);
var tokenExpirationLength = 999999;
var NUMBER_OF_AUTHORIZED_ATTEMPTS = 10;

var loggingService = {
    checkPermission: checkPermission,
    checkLogged: checkLogged,
    logUser: logUser
};

module.exports = loggingService;

function checkPermission(permissions) {
    return function(req, res, next) {
        var token = getTokenFromHeader(req.headers);
        if (!token) {
            return res.status(401).send({
                success: false,
                msg: 'No token provided.'
            });
        }
        var decodedCredentials = jwt.decode(token, config.secret);
        if (!verifyCredentialDateValid(decodedCredentials, res)) {
            return;
        }
        userDao.getByName(decodedCredentials.name)
            .then(function(user) {
                if (user.lock.adminLock) {
                    return res.status(423).send({
                        success: false,
                        msg: 'User locked'
                    });
                }
                if (verifyTokenValid(decodedCredentials.connexionToken, user, res) && verifyPermissionValid(permissions, user, res)) {
                    setUserDataInRequest(req, user, decodedCredentials.connexionToken);
                    next();
                }
            })
            .catch(function(error) {
                if (!error.code || error.code !== 404) {
                    logger.error(error);
                }
                return res.status(401).send({
                    success: false,
                    msg: 'Authentication failed: ' + error
                });
            });
    };
}

function checkLogged() {
    return checkPermission();
}

function logUser(req, res) {
    userDao.getByName(req.body.name)
        .then(function(user) {
            if (!user) {
                return res.status(400).send({
                    success: false,
                    msg: 'Authentication failed.'
                });
            }
            if (user.lock.adminLock || (user.lock.lockUntil && (new Date(user.lock.lockUntil) > new Date()))) {
                return res.status(423).send({
                    success: false,
                    msg: 'User is locked.'
                });
            }
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch || err) {
                    return addAttemptAndLockIfNecessary(user)
                        .then(function(user) {
                            res.status(400).send({
                                success: false,
                                msg: 'Authentication failed.'
                            });
                        });
                }
                createNewTokenForUser(user, getIP(req), req.headers['user-agent'])
                    .then(function(uiToken) {
                        res.json(uiToken);
                    });
            });
        })
        .catch(function(error) {
            logger.error(error);
        });

}

function getIP(req) {
    if (req.connection && req.connection.remoteAddress) {
        return req.connection.remoteAddress.replace('::ffff:', '');
    }
    return 'Hidden';
}


function addAttemptAndLockIfNecessary(user) {
    if (!user.lock.loggingAttempt) {
        user.lock.loggingAttempt = 0;
    }
    user.lock.loggingAttempt += 1;
    if (user.lock.loggingAttempt === NUMBER_OF_AUTHORIZED_ATTEMPTS) {
        user.lock.lockingTime = new Date();
        user.lock.lockUntil = new Date();
        user.lock.lockUntil.setDate(user.lock.lockUntil.getDate() + 1);
        user.lock.loggingAttempt = 0;
    }
    return user.save().catch(function(error) {
        logger.error(error);
    });
}

function createNewTokenForUser(user, ip, userAgent) {
    user.lock.loggingAttempt = 0;
    var connexionToken = generateToken();
    var expirationDate = new Date();
    var creationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + tokenExpirationLength);
    if (!user.connexionTokens) {
        user.connexionTokens = [];
    }
    user.connexionTokens.push({
        value: connexionToken,
        expirationDate: expirationDate,
        ip: ip,
        userAgent: userAgent,
        creationDate: creationDate
    });
    return user.save()
        .then(function() {
            var userToEncode = {
                name: user.name,
                connexionToken: connexionToken,
                expirationDate: expirationDate
            };
            // if user is found and password is right create a token
            var token = jwt.encode(userToEncode, config.secret);
            // return the information including token as JSON
            return {
                success: true,
                token: 'JWT ' + token,
                permissions: user.permissions
            };
        })
        .catch(function(error) {
            logger.error(error);
        });
}

function isCredentialOutdated(credential) {
    return new Date(credential.expirationDate) < new Date();
}

function generateToken() {
    var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++) {
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return token;
}

function retrieveToken(tokenValue, tokenList) {
    var tokensMatching = tokenList.filter(function(tokenFromList) {
        return tokenFromList.value === tokenValue;
    });
    if (tokensMatching.length > 0) {
        return tokensMatching[0];
    }
    return null;
}

function getTokenFromHeader(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }
    }
    return null;
}


function setUserDataInRequest(req, user, token) {
    req.loggedUser = {
        id: user._id,
        name: user.name,
        permissions: user.permissions,
        token: token
    };
}

function verifyCredentialDateValid(credential, res) {
    if (isCredentialOutdated(credential)) {
        userService.removeTokenFor(credential.name, credential.connexionToken);
        res.status(401).send({
            success: false,
            msg: 'Session expired'
        });
        return false;
    }
    return true;
}

function verifyTokenValid(token, user, res) {
    var matchingToken = retrieveToken(token, user.connexionTokens);
    if (!matchingToken) {
        res.status(401).send({
            success: false,
            msg: 'Authentication failed: Token does not exist'
        });
        return false;
    }

    if (isCredentialOutdated(matchingToken)) {
        res.status(401).send({
            success: false,
            msg: 'Authentication failed: Token expired'
        });
        userService.removeTokenFor(user.name, matchingToken.connexionToken);
        return false;
    }
    return true;
}

function verifyPermissionValid(permissions, user, res) {
    if (!isOneOfThesePermissionAllowedToUser(permissions, user)) {
        res.status(403).send({
            success: false,
            msg: 'User does not have the permission'
        });
        return false;
    }
    return true;
}


function isOneOfThesePermissionAllowedToUser(permissions, user) {
    if (!permissions || (permissions instanceof Array && permissions.length === 0)) {
        return true;
    }
    if (!user.permissions) {
        return false;
    }

    // Different permission give access to the action
    if (permissions instanceof Array) {
        return permissions.filter(function(permission) {
            return user.permissions.filter(function(userPermission) {
                return permission === userPermission;
            }).length;
        }).length;
    }

    // there is only one permission allowing the action
    return user.permissions.filter(function(userPermission) {
        return permissions === userPermission;
    }).length;


}