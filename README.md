# GradPredict — Expo SDK 58 upgrade kit

The included source is the original GradPredict app. **Run the upgrade script to install Expo SDK 58 and align all React Native dependencies**; the files in this ZIP have not been independently executed against SDK 58. An internet connection is required.

## Windows PowerShell (from project folder)
```powershell
powershell -ExecutionPolicy Bypass -File .\upgrade-sdk58.ps1
npx expo start --clear
```

## macOS/Linux
```bash
bash upgrade-sdk58.sh
npx expo start --clear
```

If Expo reports an unsupported SDK version or dependency conflicts, inspect the npm errors and follow the version recommendations from `npx expo-doctor`.

The model remains in demo mode; no trained ML model is included.
