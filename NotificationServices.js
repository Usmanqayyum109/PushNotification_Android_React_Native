import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';

// Request Notification Permission on ANDROID
export const RequestNotificationPermission = async () => {
  try {
    let result;

    // Function to open device settings
    const openSettings = () => {
      Linking.openSettings();
    };

    if (Platform.Version <= 33) {
      // Check if the app already has the notification permission
      const hasPermission = await messaging().hasPermission();

      if (!hasPermission) {
        // Request permission if not granted
        result = await messaging().requestPermission();
        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          // Log an error message if permission request is not successful
          console.error('Notification permission request failed:', result);
        }
      } else {
        console.log('Notification permission already granted.');

        result = PermissionsAndroid.RESULTS.GRANTED;
      }
    } else {
      // Request notification permission for Android version 33 and above
      result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // Handle the case where the user selected "Never ask again"
        Alert.alert(
          'Permission Denied',
          'Please enable notification permissions manually in your device settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ],
        );
      }
    }

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      // Call GetDeviceToken after permission is granted
      GetDeviceToken();
    }

    return result;
  } catch (error) {
    // Handle errors during the permission request
    console.error('Error requesting notification permission:', error);
    return PermissionsAndroid.RESULTS.DENIED;
  }
};

// Function to get the device token for push notifications
const GetDeviceToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('Push notification token:', token);
  } catch (error) {
    console.error('Error getting device token:', error);
  }
};

// Function to handle foreground notifications
export const ForegroundNotification = () => {
  // Set up a callback to be invoked when a message is received while the app is in the foreground
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
};

export const KillStateNotification = () => {
  // Register Kill state handler using getInitialNotification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      // If the console does not display, please restart your phone.
      if (remoteMessage) {
        console.log('Message handled in the kill state!', remoteMessage);
      }
    })
    .catch(error => {
      console.log('Kill State', error);
    });
};

const OpenedApp = () => {
  // Register a callback for when a notification is opened while the app is in the foreground
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(remoteMessage);
  });
};
