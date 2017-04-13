'use strict';

function overrideIfKeyExist(object1,object2){
  for (var key in object1){
    if(typeof(object2[key]) !== 'undefined'){
      object1[key]=object2[key];
    }
  }
  return object1;
}

exports.overrideIfKeyExist = overrideIfKeyExist;
