'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

// set up a mongoose model
var UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    lock: {
        adminLock:{
          type : Boolean
        },
        lockUntil: {
            type: Date
        },
        lockingTime: {
            type: Date
        },
        loggingAttempt: {
            type: Number
        }
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    permissions: {
        type: [String],
        required: true
    },
    connexionTokens: [{
        value: {
            type: String
        },
        expirationDate: {
            type: Date
        },
        ip: {
            type: String
        },
        userAgent: {
            type: String
        },
        creationDate: {
            type: Date
        }
    }]


});

UserSchema.pre('findOneAndUpdate',function(next){
  if(this._update && this._update.password){
    var updateToBeDone = this._update;
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(updateToBeDone.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            updateToBeDone.password = hash;
            next();
        });
    });
  }else{
    next();
  }
});

UserSchema.pre('findByIdAndUpdate',function(next){
  if(this._update && this._update.password){
    var updateToBeDone = this._update;
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(updateToBeDone.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            updateToBeDone.password = hash;
            next();
        });
    });
  }else{
    next();
  }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});


UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.methods.comparePasswordPromise = function(passw){
    return new Promise(function(resolve,reject){
        bcrypt.compare(passw, this.password, function(err, isMatch){
            if (err) {
                reject(err);
                return;
            }
            this.passwordMatch = isMatch;
            resolve(this);
        });
    });
};

module.exports = mongoose.model('User', UserSchema);
