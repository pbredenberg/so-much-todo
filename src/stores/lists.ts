import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export interface List {
  id: string;
  name: string;
  description: string;
  dueDate: string | null;
  tags: string[];
}

export const useListsStore = defineStore('lists', () => {
  // State
  const lists = ref<List[]>([]);

  // Load from localStorage on store initialization
  const loadFromStorage = () => {
    const stored = localStorage.getItem('lists-store');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        lists.value = parsed;
      } catch (error) {
        console.error('Failed to load lists data from localStorage:', error);
      }
    }
  };

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('lists-store', JSON.stringify(lists.value));
    } catch (error) {
      console.error('Failed to save lists data to localStorage:', error);
    }
  };

  // Actions
  const createList = (listData: Omit<List, 'id'>) => {
    const newList: List = {
      id: uuidv4(),
      ...listData,
      tags: listData.tags || [], // Use provided tags or empty array
    };
    lists.value.push(newList);
    saveToStorage();
    return newList;
  };

  const updateList = (id: string, updates: Partial<Omit<List, 'id'>>) => {
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

  // Tag management functions
  const addTagToList = (listId: string, tag: string) => {
    const list = lists.value.find(l => l.id === listId);
    if (list && !list.tags.includes(tag)) {
      list.tags.push(tag);
      saveToStorage();
      return true;
    }
    return false;
  };

  const removeTagFromList = (listId: string, tag: string) => {
    const list = lists.value.find(l => l.id === listId);
    if (list) {
      const index = list.tags.indexOf(tag);
      if (index > -1) {
        list.tags.splice(index, 1);
        saveToStorage();
        return true;
      }
    }
    return false;
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    lists.value.forEach(list => {
      list.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  const getListsByTag = (tag: string) => {
    return lists.value.filter(list => list.tags.includes(tag));
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
    addTagToList,
    removeTagFromList,
    getAllTags,
    getListsByTag,
  };
});
