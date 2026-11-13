$ErrorActionPreference = "Stop"
Write-Host "Upgrading GradPredict to Expo SDK 58..."
if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }
if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }
npm install expo@~58.0.0 --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { throw "Expo install failed" }
npx expo install --fix --npm
if ($LASTEXITCODE -ne 0) { throw "Expo dependency alignment failed" }
npx expo-doctor
Write-Host "Then run: npx expo start --clear"
