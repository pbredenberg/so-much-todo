import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export interface ListItem {
  id: string;
  listId: string;
  name: string;
  isComplete: boolean;
}

export const useListItemsStore = defineStore('listItems', () => {
  // State
  const listItems = ref<ListItem[]>([]);

  // Load from localStorage on store initialization
  const loadFromStorage = () => {
    const stored = localStorage.getItem('list-items-store');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        listItems.value = parsed;
      } catch (error) {
        console.error(
          'Failed to load list items data from localStorage:',
          error
        );
      }
    }
  };

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('list-items-store', JSON.stringify(listItems.value));
    } catch (error) {
      console.error('Failed to save list items data to localStorage:', error);
    }
  };

  // Actions
  const createListItem = (itemData: Omit<ListItem, 'id'>) => {
    const newItem: ListItem = {
      id: uuidv4(),
      ...itemData,
    };
    listItems.value.push(newItem);
    saveToStorage();
    return newItem;
  };

  const updateListItem = (
    id: string,
    updates: Partial<Omit<ListItem, 'id'>>
  ) => {
    const index = listItems.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      listItems.value[index] = { ...listItems.value[index], ...updates };
      saveToStorage();
      return listItems.value[index];
    }
    return null;
  };

  const deleteListItem = (id: string) => {
    const index = listItems.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      listItems.value.splice(index, 1);
      saveToStorage();
      return true;
    }
    return false;
  };

  const toggleItemComplete = (id: string) => {
    const index = listItems.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      listItems.value[index].isComplete = !listItems.value[index].isComplete;
      saveToStorage();
      return listItems.value[index];
    }
    return null;
  };

  const getItemsByListId = (listId: string) => {
    return listItems.value.filter((item) => item.listId === listId);
  };

  const getItemById = (id: string) => {
    return listItems.value.find((item) => item.id === id);
  };

  const deleteItemsByListId = (listId: string) => {
    const initialLength = listItems.value.length;
    listItems.value = listItems.value.filter((item) => item.listId !== listId);
    if (listItems.value.length !== initialLength) {
      saveToStorage();
      return true;
    }
    return false;
  };

  const clearAllItems = () => {
    listItems.value = [];
    saveToStorage();
  };

  // Initialize store
  loadFromStorage();

  return {
    listItems: listItems.value,
    createListItem,
    updateListItem,
    deleteListItem,
    toggleItemComplete,
    getItemsByListId,
    getItemById,
    deleteItemsByListId,
    clearAllItems,
  };
});
