<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useListsStore, useListItemsStore } from '../stores';
import ListItem from './ListItem.vue';
import AddListItem from './AddListItem.vue';

const route = useRoute();
const router = useRouter();
const listsStore = useListsStore();
const listItemsStore = useListItemsStore();

const listId = route.params.id as string;

const list = computed(() => listsStore.getListById(listId));
const items = computed(() => listItemsStore.getItemsByListId(listId));

// Item selection state for keyboard navigation
const selectedItemIndex = ref<number>(-1);
const selectedItemId = computed(() => {
  const currentItems = items.value;
  if (selectedItemIndex.value >= 0 && selectedItemIndex.value < currentItems.length) {
    return currentItems[selectedItemIndex.value].id;
  }
  return null;
});

const navigateBack = () => {
  router.push('/');
};

const deleteList = () => {
  if (
    confirm(
      'Are you sure you want to delete this list? This will also delete all items in the list.'
    )
  ) {
    // Delete all items in the list first
    listItemsStore.deleteItemsByListId(listId);
    // Then delete the list
    listsStore.deleteList(listId);
    router.push('/');
  }
};

// Item selection methods
const selectItem = (index: number): void => {
  const currentItems = items.value;
  if (index >= 0 && index < currentItems.length) {
    selectedItemIndex.value = index;
  }
};

const selectNextItem = (): void => {
  const currentItems = items.value;
  if (currentItems.length === 0) {
    return;
  }
  
  const nextIndex = selectedItemIndex.value + 1;
  if (nextIndex < currentItems.length) {
    selectedItemIndex.value = nextIndex;
  }
};

const selectPreviousItem = (): void => {
  const currentItems = items.value;
  if (currentItems.length === 0) {
    return;
  }
  
  const prevIndex = selectedItemIndex.value - 1;
  if (prevIndex >= 0) {
    selectedItemIndex.value = prevIndex;
  }
};

const clearSelection = (): void => {
  selectedItemIndex.value = -1;
};

const getSelectedItem = () => {
  const currentItems = items.value;
  if (selectedItemIndex.value >= 0 && selectedItemIndex.value < currentItems.length) {
    return currentItems[selectedItemIndex.value];
  }
  return null;
};

const handleSelectNextItem = (): void => {
  const currentItems = items.value;
  if (currentItems.length === 0) {
    return;
  }
  
  // If no item selected, select first item
  if (selectedItemIndex.value === -1) {
    selectedItemIndex.value = 0;
  } else {
    selectNextItem();
  }
  
  // Scroll selected item into view
  scrollToSelectedItem();
};

const handleSelectPreviousItem = (): void => {
  const currentItems = items.value;
  if (currentItems.length === 0) {
    return;
  }
  
  // If no item selected, select last item
  if (selectedItemIndex.value === -1) {
    selectedItemIndex.value = currentItems.length - 1;
  } else {
    selectPreviousItem();
  }
  
  // Scroll selected item into view
  scrollToSelectedItem();
};

const handleEditSelectedItem = (): void => {
  const selectedItem = getSelectedItem();
  if (selectedItem) {
    // Find the item component and trigger edit mode
    const event = new CustomEvent('start-edit-item', {
      detail: { itemId: selectedItem.id }
    });
    document.dispatchEvent(event);
  }
};

const handleCompleteSelectedItem = (): void => {
  const selectedItem = getSelectedItem();
  if (selectedItem) {
    listItemsStore.toggleItemComplete(selectedItem.id);
  }
};

const handleDeleteCurrentList = (): void => {
  deleteList();
};

const handleOpenAddItemForm = (): void => {
  // Trigger the add item form to open
  const event = new CustomEvent('open-add-item-form-trigger');
  document.dispatchEvent(event);
};

const handleCancelCurrentAction = (): void => {
  // Clear selection and cancel any ongoing actions
  clearSelection();
  const event = new CustomEvent('cancel-action-trigger');
  document.dispatchEvent(event);
};

const scrollToSelectedItem = (): void => {
  if (selectedItemIndex.value >= 0) {
    const selectedItem = getSelectedItem();
    if (selectedItem) {
      // Find the DOM element for the selected item
      setTimeout(() => {
        const itemElement = document.querySelector(`[data-item-id="${selectedItem.id}"]`);
        if (itemElement) {
          itemElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }, 50);
    }
  }
};

onMounted(() => {
  if (!list.value) {
    router.push('/');
    return;
  }

  // Add event listeners for keyboard shortcuts
  document.addEventListener('select-next-item', handleSelectNextItem);
  document.addEventListener('select-previous-item', handleSelectPreviousItem);
  document.addEventListener('edit-selected-item', handleEditSelectedItem);
  document.addEventListener('complete-selected-item', handleCompleteSelectedItem);
  document.addEventListener('delete-current-list', handleDeleteCurrentList);
  document.addEventListener('open-add-item-form', handleOpenAddItemForm);
  document.addEventListener('cancel-current-action', handleCancelCurrentAction);
});

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener('select-next-item', handleSelectNextItem);
  document.removeEventListener('select-previous-item', handleSelectPreviousItem);
  document.removeEventListener('edit-selected-item', handleEditSelectedItem);
  document.removeEventListener('complete-selected-item', handleCompleteSelectedItem);
  document.removeEventListener('delete-current-list', handleDeleteCurrentList);
  document.removeEventListener('open-add-item-form', handleOpenAddItemForm);
  document.removeEventListener('cancel-current-action', handleCancelCurrentAction);
});

// Export methods for keyboard shortcuts (Phase 2)
defineExpose({
  selectNextItem,
  selectPreviousItem,
  clearSelection,
  getSelectedItem,
});
</script>

<template>
  <div v-if="list" class="list-detail">
    <div class="list-header">
      <button @click="navigateBack" class="btn btn-secondary back-btn">
        ← Back to Lists
      </button>
      <div class="header-actions">
        <button @click="deleteList" class="btn btn-danger">Delete List</button>
      </div>
    </div>

    <div class="list-info">
      <h2>{{ list.name }}</h2>
      <p v-if="list.description" class="list-description">
        {{ list.description }}
      </p>
      <div v-if="list.dueDate" class="due-date">
        Due: {{ new Date(list.dueDate).toLocaleDateString() }}
      </div>
    </div>

    <AddListItem :listId="listId" />

    <div class="items-section">
      <div class="items-header">
        <h3>Items ({{ items.length }})</h3>
        <div v-if="items.length > 0" class="keyboard-hints">
          <span class="hint">Use ↑↓ to navigate</span>
          <span class="hint">Enter to edit</span>
          <span class="hint">? for shortcuts</span>
        </div>
      </div>

      <div 
        v-if="items.length > 0" 
        class="items-list"
        role="listbox"
        :aria-label="`Todo items for ${list.name}`"
        aria-multiselectable="false"
      >
        <ListItem 
          v-for="(item, index) in items" 
          :key="item.id" 
          :item="item" 
          :isSelected="selectedItemId === item.id"
          :data-item-id="item.id"
          @click="selectItem(index)"
        />
      </div>

      <div v-else class="empty-items">
        <p>No items in this list yet. Add some above!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-detail {
  max-width: 800px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e1e5e9;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.list-info {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.list-info h2 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 2rem;
}

.list-description {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.6;
  font-size: 1.1rem;
}

.due-date {
  display: inline-block;
  background: #f8f9fa;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
}

.items-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.items-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.keyboard-hints {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hint {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  white-space: nowrap;
}

.items-list {
  outline: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-items {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-items p {
  margin: 0;
  font-size: 1.1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-1px);
}
</style>
