<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useListItemsStore } from '../stores';

const props = defineProps<{
  listId: string;
}>();

const listItemsStore = useListItemsStore();

const newItemName = ref('');
const isAdding = ref(false);

const addItem = () => {
  if (!newItemName.value.trim()) return;

  listItemsStore.createListItem({
    listId: props.listId,
    name: newItemName.value.trim(),
    isComplete: false,
  });

  newItemName.value = '';
  isAdding.value = false;
};

const toggleAddForm = () => {
  isAdding.value = !isAdding.value;
  if (isAdding.value) {
    // Focus the input after a brief delay to ensure it's rendered
    setTimeout(() => {
      const input = document.getElementById('newItemInput');
      if (input) input.focus();
    }, 100);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addItem();
  } else if (event.key === 'Escape') {
    newItemName.value = '';
    isAdding.value = false;
  }
};

const handleOpenAddItemForm = (): void => {
  // Always open the form (don't toggle if already open)
  if (!isAdding.value) {
    isAdding.value = true;
    // Focus the input after a brief delay to ensure it's rendered
    setTimeout(() => {
      const input = document.getElementById('newItemInput');
      if (input) {
        input.focus();
      }
    }, 100);
  }
};

const handleCancelAction = (): void => {
  if (isAdding.value) {
    newItemName.value = '';
    isAdding.value = false;
  }
};

onMounted(() => {
  document.addEventListener('open-add-item-form', handleOpenAddItemForm);
  document.addEventListener('open-add-item-form-trigger', handleOpenAddItemForm);
  document.addEventListener('cancel-action-trigger', handleCancelAction);
});

onUnmounted(() => {
  document.removeEventListener('open-add-item-form', handleOpenAddItemForm);
  document.removeEventListener('open-add-item-form-trigger', handleOpenAddItemForm);
  document.removeEventListener('cancel-action-trigger', handleCancelAction);
});
</script>

<template>
  <div class="add-item-container">
    <button
      v-if="!isAdding"
      @click="toggleAddForm"
      class="btn btn-primary add-item-btn"
    >
      + Add New Item
    </button>

    <div v-else class="add-item-form">
      <div class="form-group">
        <input
          id="newItemInput"
          v-model="newItemName"
          @keydown="handleKeydown"
          @blur="addItem"
          type="text"
          placeholder="Enter item name..."
          class="item-input"
        />
      </div>

      <div class="form-actions">
        <button @click="addItem" class="btn btn-primary">Add</button>
        <button @click="toggleAddForm" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-item-container {
  margin-bottom: 2rem;
}

.add-item-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
}

.add-item-form {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #e1e5e9;
}

.form-group {
  margin-bottom: 1rem;
}

.item-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  font-family: inherit;
}

.item-input:focus {
  outline: none;
  border-color: #667eea;
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
