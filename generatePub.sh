#!/bin/bash

rm -rf pub;
npm install;
bower install;
gulp dist;
cp -rf node_modules node_modules_temp;
npm prune --production;
mkdir pub;
mv node_modules pub/;
mv dist pub/;
cp package.json pub/;
mv node_modules_temp node_modules;
