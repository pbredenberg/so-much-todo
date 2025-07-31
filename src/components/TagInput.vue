<template>
  <div class="tag-input-container">
    <label v-if="label" :for="inputId" class="tag-label">{{ label }}</label>
    
    <div class="tag-input-wrapper">
      <!-- Inline input with tags -->
      <div class="inline-tag-input" @click="focusInput">
        <!-- Display existing tags inline -->
        <span
          v-for="tag in modelValue"
          :key="tag"
          class="inline-tag-chip"
        >
          {{ tag }}
          <button
            type="button"
            @click.stop="removeTag(tag)"
            class="inline-tag-remove"
            :aria-label="`Remove ${tag} tag`"
          >
            ×
          </button>
        </span>
        
        <!-- Input for new tags -->
        <input
          ref="tagInput"
          :id="inputId"
          v-model="newTag"
          type="text"
          :placeholder="modelValue.length === 0 ? placeholder : ''"
          class="inline-input"
          @keydown.enter.prevent="addTag"
          @keydown.comma.prevent="addTag"
          @keydown.backspace="handleBackspace"
          @blur="addTag"
        />
      </div>
    </div>

    <div v-if="showSuggestions && suggestions.length > 0" class="tag-suggestions">
      <small class="suggestions-label">Suggestions:</small>
      <div class="suggestions-list">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          type="button"
          @click="addSuggestion(suggestion)"
          class="suggestion-chip"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useListsStore } from '../stores';

interface Props {
  modelValue: string[];
  label?: string;
  placeholder?: string;
  showSuggestions?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Add a tag...',
  showSuggestions: true,
});

const emit = defineEmits<Emits>();

const listsStore = useListsStore();
const newTag = ref('');
const tagInput = ref<HTMLInputElement>();
const inputId = `tag-input-${Math.random().toString(36).substr(2, 9)}`;

const suggestions = computed(() => {
  const allTags = listsStore.getAllTags();
  return allTags.filter(tag => 
    !props.modelValue.includes(tag) && 
    tag.toLowerCase().includes(newTag.value.toLowerCase())
  ).slice(0, 5);
});

const addTag = () => {
  const tag = newTag.value.trim().toLowerCase();
  if (tag && !props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag]);
    newTag.value = '';
  }
};

const addSuggestion = (tag: string) => {
  if (!props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag]);
  }
};

const removeTag = (tagToRemove: string) => {
  emit('update:modelValue', props.modelValue.filter(tag => tag !== tagToRemove));
};

const focusInput = () => {
  if (tagInput.value) {
    tagInput.value.focus();
  }
};

const handleBackspace = () => {
  if (newTag.value === '' && props.modelValue.length > 0) {
    // Remove the last tag if input is empty and backspace is pressed
    const lastTag = props.modelValue[props.modelValue.length - 1];
    removeTag(lastTag);
  }
};
</script>

<style scoped>
.tag-input-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tag-label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.tag-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.inline-tag-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--white);
  cursor: text;
  transition: var(--transition);
}

.inline-tag-input:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.inline-tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  flex-shrink: 0;
}

.inline-tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.25rem;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.inline-tag-remove:hover {
  background: rgba(255, 255, 255, 0.2);
}

.inline-input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  min-width: 120px;
  font-size: 0.875rem;
  color: var(--text-primary);
  padding: 0;
}

.inline-input::placeholder {
  color: var(--text-muted);
}

.tag-suggestions {
  margin-top: 0.5rem;
}

.suggestions-label {
  color: var(--text-muted);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  display: block;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.suggestion-chip {
  background: var(--light-bg);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition);
}

.suggestion-chip:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .inline-tag-input {
    min-height: 2.25rem;
    padding: 0.4rem;
  }
  
  .inline-input {
    min-width: 100px;
    font-size: 0.8rem;
  }
  
  .inline-tag-chip {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>
