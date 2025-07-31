<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>✨ Suggest New Items</h3>
        <button @click="closeModal" class="close-btn" title="Close">✕</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="aiPrompt" class="form-label">
            Describe what kind of items you need:
          </label>
          <textarea
            id="aiPrompt"
            v-model="prompt"
            placeholder="e.g., 'Plan a trip to the zoo', 'Organize my home office', 'Prepare for vacation'..."
            class="prompt-input"
            rows="3"
            maxlength="255"
            :disabled="isLoading"
          ></textarea>
          <div class="char-counter">
            {{ prompt.length }}/255 characters
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="suggestedItems.length > 0" class="suggestions-section">
          <h4>Suggested Items:</h4>
          <div class="suggestions-list">
            <div
              v-for="item in suggestedItems"
              :key="item.id"
              class="suggestion-item"
              :class="{ selected: selectedItems.includes(item.id) }"
              @click="toggleItemSelection(item.id)"
            >
              <div class="item-content">
                <div class="item-name">{{ item.name }}</div>
                <div v-if="item.description" class="item-description">
                  {{ item.description }}
                </div>
                <div v-if="item.tags && item.tags.length > 0" class="item-tags">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="tag"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <div class="item-checkbox">
                <span v-if="selectedItems.includes(item.id)">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          v-if="suggestedItems.length === 0"
          @click="generateSuggestions"
          class="btn btn-secondary"
          :disabled="!prompt.trim() || isLoading"
        >
          <span v-if="isLoading">🔄</span>
          <span v-else>✨</span>
          {{ isLoading ? 'Generating...' : 'Generate' }}
        </button>

        <template v-else>
          <button
            @click="addSelectedItems"
            class="btn btn-secondary"
            :disabled="selectedItems.length === 0"
          >
            <span>➕</span>
            Add Selected ({{ selectedItems.length }})
          </button>
          <button @click="generateSuggestions" class="btn btn-secondary">
            <span>🔄</span>
            Generate New
          </button>
        </template>

        <button @click="closeModal" class="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useListItemsStore } from '../stores';

interface SuggestedItem {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
}

const props = defineProps<{
  listId: string;
  isVisible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  itemsAdded: [count: number];
}>();

const listItemsStore = useListItemsStore();

const prompt = ref('');
const isLoading = ref(false);
const error = ref('');
const suggestedItems = ref<SuggestedItem[]>([]);
const selectedItems = ref<string[]>([]);

const closeModal = () => {
  emit('close');
  resetModal();
};

const resetModal = () => {
  prompt.value = '';
  error.value = '';
  suggestedItems.value = [];
  selectedItems.value = [];
  isLoading.value = false;
};

const validatePrompt = (text: string): string | null => {
  if (!text.trim()) {
    return 'Please enter a description for the items you need.';
  }
  
  if (text.length > 255) {
    return 'Description must be 255 characters or less.';
  }

  return null;
};

const generateSuggestions = async () => {
  const validationError = validatePrompt(prompt.value);
  if (validationError) {
    error.value = validationError;
    return;
  }

  isLoading.value = true;
  error.value = '';
  suggestedItems.value = [];
  selectedItems.value = [];

  try {
    const response = await fetch('/.netlify/functions/generate-list-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listId: props.listId,
        prompt: prompt.value.trim(),
        count: 5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate suggestions');
    }

    const data = await response.json();
    
    if (data.items && Array.isArray(data.items)) {
      suggestedItems.value = data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        tags: item.tags || [],
      }));
      
      // Auto-select all items by default
      selectedItems.value = suggestedItems.value.map(item => item.id);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    console.error('Error generating suggestions:', err);
    error.value = err instanceof Error ? err.message : 'Failed to generate suggestions. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const toggleItemSelection = (itemId: string) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(itemId);
  }
};

const addSelectedItems = () => {
  const itemsToAdd = suggestedItems.value.filter(item => 
    selectedItems.value.includes(item.id)
  );

  for (const item of itemsToAdd) {
    listItemsStore.createListItem({
      listId: props.listId,
      name: item.name,
      isComplete: false,
      dueDate: null,
    });
  }

  emit('itemsAdded', itemsToAdd.length);
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid var(--border-color);
}

.modal-header h3 {
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

.modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.prompt-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: var(--transition);
}

.prompt-input:focus {
  outline: none;
  border-color: var(--primary);
}

.prompt-input:disabled {
  background: var(--light-bg);
  color: var(--text-muted);
}

.char-counter {
  text-align: right;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 0.75rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid #fed7d7;
  margin-bottom: 1rem;
}

.suggestions-section {
  margin-top: 1.5rem;
}

.suggestions-section h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.suggestion-item:hover {
  border-color: var(--primary);
  background: var(--light-bg);
}

.suggestion-item.selected {
  border-color: var(--primary);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.item-content {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.item-description {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.item-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #e1e5e9;
  background: #e1e5e9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  color: #6c757d;
}

.suggestion-item.selected .item-checkbox {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 2px solid var(--border-color);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--text-muted);
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
