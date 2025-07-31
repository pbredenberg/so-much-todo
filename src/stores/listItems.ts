import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { useListsStore } from './lists';

export interface ListItem {
  id: string;
  listId: string;
  name: string;
  isComplete: boolean;
  dueDate: string | null;
  selected: boolean;
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

  // Validation helper
  const validateDueDate = (listId: string, dueDate: string | null): boolean => {
    if (!dueDate) return true; // No due date is always valid
    
    const listsStore = useListsStore();
    const parentList = listsStore.getListById(listId);
    
    if (!parentList?.dueDate) return true; // No parent due date constraint
    
    return new Date(dueDate) <= new Date(parentList.dueDate);
  };

  // Actions
  const createListItem = (itemData: Omit<ListItem, 'id' | 'selected'>) => {
    // Validate due date against parent list
    if (itemData.dueDate && !validateDueDate(itemData.listId, itemData.dueDate)) {
      throw new Error('Item due date cannot be later than the parent list due date');
    }
    const newItem: ListItem = {
      id: uuidv4(),
      selected: false,
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
      const currentItem = listItems.value[index];
      
      // Validate due date if it's being updated
      if (updates.dueDate !== undefined && !validateDueDate(currentItem.listId, updates.dueDate)) {
        throw new Error('Item due date cannot be later than the parent list due date');
      }
      
      listItems.value[index] = { ...currentItem, ...updates };
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

  // Selection methods
  const selectItem = (id: string) => {
    const index = listItems.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      listItems.value[index].selected = true;
      saveToStorage();
      return listItems.value[index];
    }
    return null;
  };

  const deselectItem = (id: string) => {
    const index = listItems.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      listItems.value[index].selected = false;
      saveToStorage();
      return listItems.value[index];
    }
    return null;
  };

  const selectAllItems = (listId: string) => {
    let changed = false;
    listItems.value.forEach((item, index) => {
      if (item.listId === listId && !item.selected) {
        listItems.value[index].selected = true;
        changed = true;
      }
    });
    if (changed) {
      saveToStorage();
    }
    return getItemsByListId(listId);
  };

  const deselectAllItems = (listId: string) => {
    let changed = false;
    listItems.value.forEach((item, index) => {
      if (item.listId === listId && item.selected) {
        listItems.value[index].selected = false;
        changed = true;
      }
    });
    if (changed) {
      saveToStorage();
    }
    return getItemsByListId(listId);
  };

  // Bulk operations
  const bulkDeleteItems = (listId: string) => {
    const initialLength = listItems.value.length;
    listItems.value = listItems.value.filter(
      (item) => !(item.listId === listId && item.selected)
    );
    if (listItems.value.length !== initialLength) {
      saveToStorage();
      return true;
    }
    return false;
  };

  const bulkSetItemsComplete = (listId: string, complete: boolean) => {
    let changed = false;
    listItems.value.forEach((item, index) => {
      if (item.listId === listId && item.selected && item.isComplete !== complete) {
        listItems.value[index].isComplete = complete;
        changed = true;
      }
    });
    if (changed) {
      saveToStorage();
    }
    return getItemsByListId(listId).filter(item => item.selected);
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
    selectItem,
    deselectItem,
    selectAllItems,
    deselectAllItems,
    bulkDeleteItems,
    bulkSetItemsComplete: (listId: string) => bulkSetItemsComplete(listId, true),
    bulkSetItemsIncomplete: (listId: string) => bulkSetItemsComplete(listId, false),
  };
});
