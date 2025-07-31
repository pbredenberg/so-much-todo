<script setup lang="ts">
import { ref } from 'vue';
import { useListsStore } from '../stores';
import TagInput from './TagInput.vue';

const listsStore = useListsStore();

const showForm = ref(false);
const formData = ref({
  name: '',
  description: '',
  dueDate: '',
  tags: [] as string[],
});

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    dueDate: '',
    tags: [],
  };
};

const createList = () => {
  if (!formData.value.name.trim()) return;

  listsStore.createList({
    name: formData.value.name.trim(),
    description: formData.value.description.trim(),
    dueDate: formData.value.dueDate || null,
    tags: formData.value.tags,
  });

  resetForm();
  showForm.value = false;
};

const toggleForm = () => {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    resetForm();
  }
};
</script>

<template>
  <div class="list-form-container">
    <button
      v-if="!showForm"
      @click="toggleForm"
      class="btn btn-primary add-list-btn"
    >
      <span>➕</span>
      Create New List
    </button>

    <div v-else class="list-form">
      <div class="form-header">
        <h3>Create New List</h3>
        <button @click="toggleForm" class="close-btn" title="Close">✕</button>
      </div>

      <form @submit.prevent="createList" class="form">
        <div class="form-group">
          <label for="listName">List Name *</label>
          <input
            id="listName"
            v-model="formData.name"
            type="text"
            placeholder="Enter list name"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="listDescription">Description</label>
          <textarea
            id="listDescription"
            v-model="formData.description"
            placeholder="Enter list description"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="listDueDate">Due Date</label>
          <input
            id="listDueDate"
            v-model="formData.dueDate"
            type="date"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <TagInput
            v-model="formData.tags"
            label="Tags"
            placeholder="Add tags like 'work', 'home', 'urgent'..."
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            <span>✅</span>
            Create List
          </button>
          <button type="button" @click="toggleForm" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.list-form-container {
  margin-bottom: 2rem;
}

.add-list-btn {
  width: 100%;
  padding: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.add-list-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.list-form {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--border-color);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.form-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-sm);
  transition: var(--transition);
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--light-bg);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .list-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
