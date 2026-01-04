# Spot It - React Capacitor PWA

A modern React application built with TypeScript, Tailwind CSS, and Capacitor for cross-platform mobile development. This project provides:

- **Android**: Native app using Capacitor
- **iOS**: Progressive Web App (PWA) for easy installation
- **Web**: Responsive web application

## 🚀 Features

- ⚡ **React 18** with TypeScript
- 🎨 **Tailwind CSS** for modern styling
- 📱 **Capacitor** for Android native app
- 🌐 **PWA** for iOS installation
- 🔧 **Vite** for fast development and building
- 📦 **Auto-updating PWA** with service worker

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Android Studio (for Android development)
- Xcode (optional, for iOS development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spot-it
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication:
     - Go to Authentication > Sign-in method
     - Enable Email/Password
     - Enable Google
     - Enable Apple (if needed)
   - Create a Firestore database:
     - Go to Firestore Database
     - Create database in production mode (or test mode for development)
   - Get your Firebase config:
     - Go to Project Settings > General
     - Scroll down to "Your apps" and click the web icon (</>)
     - Register your app and copy the config values
   - Create a `.env` file in the root directory:
     ```env
     VITE_FIREBASE_API_KEY=your-api-key-here
     VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
     VITE_FIREBASE_APP_ID=your-app-id
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📱 Platform Setup

### Android Development

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**
   ```bash
   npx cap sync
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

4. **Run on device/emulator**
   - Open Android Studio
   - Connect your Android device or start an emulator
   - Click the "Run" button

### iOS PWA

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Serve the PWA**
   ```bash
   npm run preview
   ```

3. **Install on iOS**
   - Open Safari on your iOS device
   - Navigate to the app URL
   - Tap the "Share" button
   - Select "Add to Home Screen"

## 🏗️ Build Commands

```bash
# Development
npm run dev          # Start development server
npm run preview      # Preview production build

# Building
npm run build        # Build for production
npm run build:watch  # Build with file watching

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 📁 Project Structure

```
spot-it/
├── android/                 # Android native project
├── src/
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── public/                 # Static assets
├── dist/                   # Production build output
├── capacitor.config.ts     # Capacitor configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the design by:
- Modifying `tailwind.config.js` for theme customization
- Adding custom CSS in `src/index.css`
- Using Tailwind utility classes in components

### PWA Configuration
PWA settings are configured in `vite.config.ts`:
- App name and description
- Icons and theme colors
- Display mode and orientation

### Capacitor Configuration
Capacitor settings are in `capacitor.config.ts`:
- App ID and name
- Web directory path
- Plugin configurations

## 🔧 Development Workflow

1. **Make changes** to your React components
2. **Test in browser** with `npm run dev`
3. **Build for production** with `npm run build`
4. **Sync with Capacitor** with `npx cap sync`
5. **Test on Android** by opening in Android Studio
6. **Test PWA** by serving the build and installing on iOS

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript compiler
- `npx cap sync` - Sync web assets with native platforms
- `npx cap open android` - Open Android project in Android Studio

## 🌟 Features Demo

The app includes a simple counter demo that showcases:
- Interactive UI components
- State management with React hooks
- Responsive design with Tailwind CSS
- Touch-friendly mobile interface

## 📱 Platform Support

| Platform | Support | Installation |
|----------|---------|--------------|
| Android  | ✅ Native App | Via Android Studio |
| iOS      | ✅ PWA | Add to Home Screen |
| Web      | ✅ Responsive | Direct browser access |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on all platforms
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Build fails with PostCSS error**
- Ensure `@tailwindcss/postcss` is installed
- Check `postcss.config.js` configuration

**Capacitor sync issues**
- Run `npm run build` before `npx cap sync`
- Clear `dist` folder and rebuild if needed

**Android build issues**
- Ensure Android Studio is properly configured
- Check that Android SDK is installed
- Verify device/emulator is connected

**PWA not installing on iOS**
- Ensure HTTPS is used (required for PWA)
- Check manifest.json is properly generated
- Verify service worker is registered

For more help, check the [Capacitor documentation](https://capacitorjs.com/docs) and [Vite PWA plugin documentation](https://vite-plugin-pwa.netlify.app/).
