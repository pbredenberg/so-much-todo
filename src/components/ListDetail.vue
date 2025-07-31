<script setup lang="ts">
import { computed, onMounted } from 'vue';
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
      <h3>Items ({{ items.length }})</h3>

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
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
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
