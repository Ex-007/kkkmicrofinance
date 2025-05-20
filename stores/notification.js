import { defineStore } from "pinia";
import { getToken, onMessage } from "firebase/messaging";

export const useNotificationStore = defineStore("notification", () => {
  const isLoading = ref(false);
  const error = ref(null);
  const { $firebase } = useNuxtApp();
  const messaging = $firebase?.messaging;
  const runtimeConfig = useRuntimeConfig();
  const userIdd = ref(null);
  const allTokens = ref([]);
  const newNotification = ref(null);
  const userToken = ref(null);
  const notifier = ref(false);

  // DETECT SIGNED IN USER
  const checkWho = async () => {
    isLoading.value = true;
    error.value = false;
    const client = useSupabaseClient();

    try {
      const { data, error } = await client.auth.getUser();
      if (error) {
        if (error.code === "PGRST116") {
          error.value = "No user logged in";
          return null;
        }
        throw error;
      }

      if (data && data.user) {
        const email = data.user.email;
        userIdd.value = email;
        await checkToken(email);
        return data.user;
      } else {
        return null;
      }
    } catch (err) {
      error.value = err.message;
      //   console.log(err.message)
    } finally {
      isLoading.value = false;
    }
  };

  //   CHECK IF TOKEN ALREADY EXISTS
  const checkToken = async (email) => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data, error } = await client
        .from("REGISTEREDUSERS")
        .select("notificationRoute")
        .eq("email", email)
        .single();

      if (error) throw error;
      if (data.notificationRoute) {
        userToken.value = data.notificationRoute;
        return;
      } else {
        fetchToken();
      }
    } catch (err) {
      error.value = err.message;
      // console.log(err.message)
    } finally {
      isLoading.value = false;
    }
  };

  // GET THE TOKEN
  const fetchToken = async () => {
    isLoading.value = true;
    error.value = null;
    const vapidKeyy = runtimeConfig.public.firebase.vapidKey;
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: vapidKeyy,
      });
      if (currentToken) {
        userToken.value = currentToken;
        // console.log(currentToken)
        saveToken(currentToken);
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = true;
    }
  };

  // SAVE USER'S TOKEN TO THEIR ACCOUNT
  const saveToken = async (currentToken) => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data, error } = await client
        .from("REGISTEREDUSERS")
        .update({
          notificationRoute: currentToken,
        })
        .eq("email", userIdd.value)
        .single();

      if (error) throw error;
    } catch (err) {
      error.value = err.message;
      console.log(err.message);
    } finally {
      isLoading.value = false;
    }
  };

  // LISTEN TO INCOMING MESSAGES
  const setupMessageListener = () => {
    if (process.client && messaging) {
      notifier.value = false;
      onMessage(messaging, (payload) => {
        notifier.value = true;
        newNotification.value = payload.notification;
        setTimeout(() => {
          notifier.value = false;
        }, 6000);
        // console.log('Foreground message received:', payload)
      });
    }
  };

  if (process.client) {
    nextTick(() => {
      setupMessageListener();
    });
  }

  // FETCH ALL USERS TOKEN FOR NOTIFICATION
  const fetchAllToken = async () => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data, error: supabaseError } = await client
        .from("REGISTEREDUSERS")
        .select("notificationRoute");

      if (supabaseError) {
        throw supabaseError;
      }

      if (data && data.length > 0) {
        allTokens.value = data
          .map((user) => user.notificationRoute)
          .filter((token) => token);
      }

      console.log(`Retrieved ${allTokens.value.length} notification tokens`);
      return allTokens.value;
    } catch (err) {
      error.value = err.message;
      console.log("Error fetching notification tokens:", err.message);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // EXTRACT SINGLE USER'S NOTIFICATION ROUTE
  const getUserToken = async (details) => {
    isLoading.value = true;
    error.value = false;
    const client = useSupabaseClient();
    try {
      const { data, error } = await client
        .from("REGISTEREDUSERS")
        .select("notificationRoute")
        .eq("reg_identity", details.userID)
        .single();

      if (error) {
        if (error.code == "PGRST116") {
          error.value = "noUser";
          return;
        }
        throw error;
      }
      const token = data.notificationRoute;
      return token;
    } catch (err) {
      error.value = err.message;
      console.log(err.message);
    } finally {
      isLoading.value = false;
    }
  };

  // SEND THE NOTIFICATION
  const sendNotification = async (details) => {
    isLoading.value = true;
    error.value = true;
    try {
      if (details.type == "All User") {
        await fetchAllToken();
        const response = await $fetch("/api/sendNotification", {
          method: "POST",
          body: {
            token: allTokens.value,
            message: details.message,
            title: details.title,
          },
        });
        console.log(response);
      } else {
        const token = await getUserToken(details);
        console.log(token);
        if (!token) {
          error.value = "noToken";
          return;
        }
        const response = await $fetch("/api/sendNotification", {
          method: "POST",
          body: {
            token: token,
            message: details.message,
            title: details.title,
          },
        });
      }
    } catch (err) {
      error.value = err.message;
      console.log(err.message);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    sendNotification,
    newNotification,
    notifier,
    checkWho,
  };
});
