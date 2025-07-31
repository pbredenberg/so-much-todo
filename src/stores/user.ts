import { defineStore } from "pinia";
import { ref } from "vue";

export interface User {
  userName: string;
  profileUrl: string;
}

export const useUserStore = defineStore("user", () => {
  // State
  const user = ref<User>({
    userName: "",
    profileUrl: "",
  });

  // Load from localStorage on store initialization
  const loadFromStorage = () => {
    const stored = localStorage.getItem("user-store");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        user.value = { ...user.value, ...parsed };
      } catch (error) {
        console.error("Failed to load user data from localStorage:", error);
      }
    }
  };

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem("user-store", JSON.stringify(user.value));
    } catch (error) {
      console.error("Failed to save user data to localStorage:", error);
    }
  };

  // Actions
  const setUser = (newUser: Partial<User>) => {
    user.value = { ...user.value, ...newUser };
    saveToStorage();
  };

  const updateUserName = (userName: string) => {
    user.value.userName = userName;
    saveToStorage();
  };

  const updateProfileUrl = (profileUrl: string) => {
    user.value.profileUrl = profileUrl;
    saveToStorage();
  };

  const clearUser = () => {
    user.value = { userName: "", profileUrl: "" };
    saveToStorage();
  };

  // Initialize store
  loadFromStorage();

  return {
    user: user.value,
    setUser,
    updateUserName,
    updateProfileUrl,
    clearUser,
  };
});
