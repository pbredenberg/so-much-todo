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
</script>

<template>
  <div class="lists-container">
    <div class="page-header">
      <div class="page-header-content">
        <h2>My Todo Lists</h2>
        <div class="header-actions"></div>
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
            📅 {{ new Date(list.dueDate).toLocaleDateString() }}
          </span>
        </div>
        <p v-if="list.description" class="list-description">
          {{ list.description }}
        </p>
        <div class="list-card-footer">
          <span class="list-id">#{{ list.id.slice(0, 8) }}</span>
          <span class="list-actions">
            <span class="action-icon">📝</span>
          </span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
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

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.page-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header-content h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.list-card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.list-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  opacity: 0;
  transition: var(--transition);
}

.list-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.list-card:hover::before {
  opacity: 1;
}

.list-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.list-card-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  flex: 1;
  margin-right: 1rem;
}

.due-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--light-bg);
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  white-space: nowrap;
}

.list-description {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.list-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.list-id {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.action-icon {
  font-size: 1rem;
  opacity: 0.7;
  transition: var(--transition);
}

.list-card:hover .action-icon {
  opacity: 1;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  margin-top: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .page-header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .page-header-content h2 {
    font-size: 1.5rem;
  }

  .lists-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .list-card {
    padding: 1rem;
  }
}
</style>
