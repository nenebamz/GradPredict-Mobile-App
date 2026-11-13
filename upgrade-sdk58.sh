#!/usr/bin/env bash
set -e
rm -rf node_modules package-lock.json
npm install 'expo@~58.0.0' --legacy-peer-deps
npx expo install --fix --npm
npx expo-doctor
echo 'Then run: npx expo start --clear'
