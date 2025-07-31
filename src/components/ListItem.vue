<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useListItemsStore } from '../stores';
import type { ListItem } from '../stores';

const props = defineProps<{
  item: ListItem;
  isSelected?: boolean;
}>();

const listItemsStore = useListItemsStore();

const isEditing = ref(false);
const editName = ref(props.item.name);

const toggleComplete = () => {
  listItemsStore.toggleItemComplete(props.item.id);
};

const startEditing = () => {
  editName.value = props.item.name;
  isEditing.value = true;
};

const saveEdit = () => {
  if (editName.value.trim()) {
    listItemsStore.updateListItem(props.item.id, {
      name: editName.value.trim(),
    });
    isEditing.value = false;
  }
};

const cancelEdit = () => {
  editName.value = props.item.name;
  isEditing.value = false;
};

const deleteItem = () => {
  if (confirm('Are you sure you want to delete this item?')) {
    listItemsStore.deleteListItem(props.item.id);
  }
};

const handleStartEditItem = (event: CustomEvent): void => {
  const { itemId } = event.detail;
  if (itemId === props.item.id) {
    startEditing();
  }
};

const handleCancelAction = (): void => {
  if (isEditing.value) {
    cancelEdit();
  }
};

onMounted(() => {
  document.addEventListener(
    'start-edit-item',
    handleStartEditItem as EventListener
  );
  document.addEventListener('cancel-action-trigger', handleCancelAction);
});

onUnmounted(() => {
  document.removeEventListener(
    'start-edit-item',
    handleStartEditItem as EventListener
  );
  document.removeEventListener('cancel-action-trigger', handleCancelAction);
});
</script>

<template>
  <div
    class="list-item"
    :class="{ completed: item.isComplete, selected: isSelected }"
  >
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
        <div v-if="!isEditing" class="item-name" @dblclick="startEditing">
          {{ item.name }}
        </div>
        <input
          v-else
          v-model="editName"
          @blur="saveEdit"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          class="edit-input"
          ref="editInput"
          @focus="(event) => (event.target as HTMLInputElement)?.select()"
        />
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

.list-item.selected {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
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
