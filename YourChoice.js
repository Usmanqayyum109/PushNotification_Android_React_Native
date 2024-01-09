  useEffect(() => {
    // Call the function to request notification permission
    RequestNotificationPermission();
  }, []);
  useEffect(() => {
    // Call the function to set up foreground notification handling
    ForegroundNotification();
  }, []);
  useEffect(() => {
    // Call the function to set up kill state notification handling
    KillStateNotification();
  }, []);
