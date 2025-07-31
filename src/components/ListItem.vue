<script setup lang="ts">
import { ref, computed } from 'vue';
import { useListItemsStore, useListsStore } from '../stores';
import type { ListItem } from '../stores';

const props = defineProps<{
  item: ListItem;
}>();

const listItemsStore = useListItemsStore();
const listsStore = useListsStore();

const isEditing = ref(false);
const editName = ref(props.item.name);
const editDueDate = ref(props.item.dueDate || '');

// Get parent list for validation
const parentList = computed(() => listsStore.getListById(props.item.listId));
const parentDueDate = computed(() => parentList.value?.dueDate || null);

// Format due date for display
const formatDueDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

// Check if due date is overdue
const isOverdue = computed(() => {
  if (!props.item.dueDate || props.item.isComplete) return false;
  const today = new Date();
  const dueDate = new Date(props.item.dueDate);
  return dueDate < today;
});

const toggleComplete = () => {
  listItemsStore.toggleItemComplete(props.item.id);
};

const startEditing = () => {
  editName.value = props.item.name;
  editDueDate.value = props.item.dueDate || '';
  isEditing.value = true;
};

const saveEdit = () => {
  if (editName.value.trim()) {
    listItemsStore.updateListItem(props.item.id, {
      name: editName.value.trim(),
      dueDate: editDueDate.value || null,
    });
    isEditing.value = false;
  }
};

const cancelEdit = () => {
  editName.value = props.item.name;
  editDueDate.value = props.item.dueDate || '';
  isEditing.value = false;
};

const selectInputText = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input) input.select();
};

const deleteItem = () => {
  if (confirm('Are you sure you want to delete this item?')) {
    listItemsStore.deleteListItem(props.item.id);
  }
};
</script>

<template>
  <div class="list-item" :class="{ completed: item.isComplete }">
    <div class="item-content">
      <div class="item-checkbox">
        <input
          type="checkbox"
          :checked="item.isComplete"
          @change="toggleComplete"
          class="checkbox"
        />
      </div>

      <div class="item-text">
        <div v-if="!isEditing" class="item-display" @dblclick="startEditing">
          <div class="item-name" :class="{ overdue: isOverdue }">
            {{ item.name }}
          </div>
          <div v-if="item.dueDate" class="item-due-date" :class="{ overdue: isOverdue }">
            📅 Due: {{ formatDueDate(item.dueDate) }}
          </div>
        </div>
        <div v-else class="item-edit-form">
          <div class="edit-group">
            <label class="edit-label">Name</label>
            <input
              v-model="editName"
              @keyup.enter="saveEdit"
              @keyup.esc="cancelEdit"
              class="edit-input"
              ref="editInput"
              @focus="selectInputText"
            />
          </div>
          <div class="edit-group">
            <label class="edit-label">Due Date</label>
            <input
              v-model="editDueDate"
              type="date"
              class="edit-input"
              :max="parentDueDate || undefined"
            />
          </div>
          <div class="edit-actions">
            <button @click="saveEdit" class="btn btn-sm btn-primary">Save</button>
            <button @click="cancelEdit" class="btn btn-sm btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <div class="item-actions">
        <button
          v-if="!isEditing"
          @click="startEditing"
          class="btn btn-sm btn-secondary"
          title="Edit"
        >
          ✏️
        </button>
        <button
          @click="deleteItem"
          class="btn btn-sm btn-danger"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-item {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  padding: 1rem;
  transition: all 0.2s;
}

.list-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-item.completed {
  opacity: 0.7;
  background: #f8f9fa;
}

.list-item.completed .item-name {
  text-decoration: line-through;
  color: #666;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-checkbox {
  flex-shrink: 0;
}

.checkbox {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  accent-color: #667eea;
}

.item-text {
  flex: 1;
  min-width: 0;
}

.item-display {
  width: 100%;
}

.item-due-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.overdue {
  color: #dc2626 !important;
  font-weight: 600;
}

.item-edit-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.edit-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.item-name {
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  word-break: break-word;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #667eea;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-sm {
  padding: 0.5rem;
  font-size: 0.875rem;
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
