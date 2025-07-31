<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
const selectedItems = computed(() => items.value.filter(item => item.selected));
const isLoading = ref(false);

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

// Bulk action methods
const selectAll = () => {
  isLoading.value = true;
  listItemsStore.selectAllItems(listId);
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

const deselectAll = () => {
  isLoading.value = true;
  listItemsStore.deselectAllItems(listId);
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

const bulkDelete = () => {
  if (selectedItems.value.length === 0) return;
  
  if (confirm(`Are you sure you want to delete ${selectedItems.value.length} selected item(s)?`)) {
    isLoading.value = true;
    listItemsStore.bulkDeleteItems(listId);
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
};

const bulkSetComplete = () => {
  if (selectedItems.value.length === 0) return;
  
  isLoading.value = true;
  listItemsStore.bulkSetItemsComplete(listId);
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

const bulkSetIncomplete = () => {
  if (selectedItems.value.length === 0) return;
  
  isLoading.value = true;
  listItemsStore.bulkSetItemsIncomplete(listId);
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

onMounted(() => {
  if (!list.value) {
    router.push('/');
  }
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
        
        <div class="bulk-actions" v-if="items.length > 0">
          <div class="selection-actions">
            <button @click="selectAll" class="btn btn-sm btn-secondary" :disabled="isLoading">
              Select All
            </button>
            <button @click="deselectAll" class="btn btn-sm btn-secondary" :disabled="isLoading || selectedItems.length === 0">
              Deselect All
            </button>
            <span v-if="selectedItems.length > 0" class="selected-count">
              {{ selectedItems.length }} selected
            </span>
          </div>
          
          <div v-if="selectedItems.length > 0" class="bulk-operations">
            <button @click="bulkSetComplete" class="btn btn-sm btn-primary" :disabled="isLoading">
              Mark Done
            </button>
            <button @click="bulkSetIncomplete" class="btn btn-sm btn-primary" :disabled="isLoading">
              Mark Undone
            </button>
            <button @click="bulkDelete" class="btn btn-sm btn-danger" :disabled="isLoading">
              Delete Selected
            </button>
          </div>
        </div>
      </div>

      <div v-if="items.length > 0" class="items-list">
        <ListItem v-for="item in items" :key="item.id" :item="item" />
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

.items-section h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.items-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .items-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.bulk-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .bulk-actions {
    flex-direction: row;
    align-items: center;
  }
}

.selection-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bulk-operations {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.selected-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  padding: 0.25rem 0.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-items {
  text-align: center;
  padding: 3rem;
  color: #666;
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

.btn-sm {
  padding: 0.4rem 0.6rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
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
