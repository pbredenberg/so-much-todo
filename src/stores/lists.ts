import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";

export interface List {
  id: string;
  name: string;
  description: string;
  dueDate: string | null;
}

export const useListsStore = defineStore("lists", () => {
  // State
  const lists = ref<List[]>([]);

  // Load from localStorage on store initialization
  const loadFromStorage = () => {
    const stored = localStorage.getItem("lists-store");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        lists.value = parsed;
      } catch (error) {
        console.error("Failed to load lists data from localStorage:", error);
      }
    }
  };

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem("lists-store", JSON.stringify(lists.value));
    } catch (error) {
      console.error("Failed to save lists data to localStorage:", error);
    }
  };

  // Actions
  const createList = (listData: Omit<List, "id">) => {
    const newList: List = {
      id: uuidv4(),
      ...listData,
    };
    lists.value.push(newList);
    saveToStorage();
    return newList;
  };

  const updateList = (id: string, updates: Partial<Omit<List, "id">>) => {
    const index = lists.value.findIndex((list) => list.id === id);
    if (index !== -1) {
      lists.value[index] = { ...lists.value[index], ...updates };
      saveToStorage();
      return lists.value[index];
    }
    return null;
  };

  const deleteList = (id: string) => {
    const index = lists.value.findIndex((list) => list.id === id);
    if (index !== -1) {
      lists.value.splice(index, 1);
      saveToStorage();
      return true;
    }
    return false;
  };

  const getListById = (id: string) => {
    return lists.value.find((list) => list.id === id);
  };

  const getAllLists = () => {
    return lists.value;
  };

  const clearAllLists = () => {
    lists.value = [];
    saveToStorage();
  };

  // Initialize store
  loadFromStorage();

  return {
    lists: lists.value,
    createList,
    updateList,
    deleteList,
    getListById,
    getAllLists,
    clearAllLists,
  };
});
