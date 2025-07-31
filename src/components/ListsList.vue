<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useListsStore } from '../stores';
import ListForm from './ListForm.vue';

const router = useRouter();
const listsStore = useListsStore();

const lists = computed(() => listsStore.getAllLists());

const navigateToList = (listId: string) => {
  router.push(`/list/${listId}`);
};

const navigateToProfile = () => {
  router.push('/profile');
};
</script>

<template>
  <div class="lists-container">
    <div class="lists-header">
      <h2>My Todo Lists</h2>
      <div class="header-actions">
        <button @click="navigateToProfile" class="btn btn-secondary">
          Profile
        </button>
      </div>
    </div>

    <ListForm />

    <div class="lists-grid" v-if="lists.length > 0">
      <div
        v-for="list in lists"
        :key="list.id"
        class="list-card"
        @click="navigateToList(list.id)"
      >
        <div class="list-card-header">
          <h3>{{ list.name }}</h3>
          <span v-if="list.dueDate" class="due-date">
            Due: {{ new Date(list.dueDate).toLocaleDateString() }}
          </span>
        </div>
        <p class="list-description">{{ list.description }}</p>
        <div class="list-card-footer">
          <span class="list-id">ID: {{ list.id.slice(0, 8) }}...</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <h3>No lists yet</h3>
      <p>Create your first todo list above!</p>
    </div>
  </div>
</template>

<style scoped>
.lists-container {
  max-width: 1200px;
  margin: 0 auto;
}

.lists-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e1e5e9;
}

.lists-header h2 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.list-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.list-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.list-card-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.due-date {
  font-size: 0.875rem;
  color: #666;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.list-description {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.list-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #999;
}

.list-id {
  font-family: monospace;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin: 0;
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
</style>
