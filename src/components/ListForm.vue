<script setup lang="ts">
import { ref } from 'vue';
import { useListsStore } from '../stores';

const listsStore = useListsStore();

const showForm = ref(false);
const formData = ref({
  name: '',
  description: '',
  dueDate: '',
});

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    dueDate: '',
  };
};

const createList = () => {
  if (!formData.value.name.trim()) return;

  listsStore.createList({
    name: formData.value.name.trim(),
    description: formData.value.description.trim(),
    dueDate: formData.value.dueDate || null,
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
      + Create New List
    </button>

    <div v-else class="list-form">
      <h3>Create New List</h3>

      <form @submit.prevent="createList" class="form">
        <div class="form-group">
          <label for="listName">List Name *</label>
          <input
            id="listName"
            v-model="formData.name"
            type="text"
            placeholder="Enter list name"
            required
          />
        </div>

        <div class="form-group">
          <label for="listDescription">Description</label>
          <textarea
            id="listDescription"
            v-model="formData.description"
            placeholder="Enter list description"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="listDueDate">Due Date</label>
          <input id="listDueDate" v-model="formData.dueDate" type="date" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create List</button>
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
  padding: 1rem;
  font-size: 1.1rem;
}

.list-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #e1e5e9;
}

.list-form h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
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
