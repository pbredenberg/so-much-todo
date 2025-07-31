<script setup lang="ts">
import { ref } from 'vue';

interface GeneratedItem {
  id: string;
  listId: string;
  name: string;
  isComplete: boolean;
  dueDate: string | null;
}

interface FunctionResponse {
  items: GeneratedItem[];
  count: number;
}

const isLoading = ref(false);
const result = ref<FunctionResponse | null>(null);
const error = ref<string | null>(null);

// Helper functions for due date formatting and overdue detection
const formatDueDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};



const testFunction = async () => {
  isLoading.value = true;
  error.value = null;
  result.value = null;

  try {
    const response = await fetch('/.netlify/functions/generate-list-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listId: 'test-list-id',
        count: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FunctionResponse = await response.json();
    result.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="test-function">
    <div class="page-header">
      <h2>Test Netlify Function</h2>
    </div>

    <div class="test-container">
      <button
        @click="testFunction"
        :disabled="isLoading"
        class="btn btn-primary"
      >
        <span v-if="isLoading" class="spinner"></span>
        {{ isLoading ? 'Testing...' : 'Test Generate List Items' }}
      </button>

      <div v-if="error" class="error-message">
        <h3>Error:</h3>
        <p>{{ error }}</p>
      </div>

      <div v-if="result" class="result-container">
        <h3>Function Response:</h3>
        <div class="result-info">
          <p><strong>Generated Items:</strong> {{ result.count }}</p>
        </div>

        <div class="items-list">
          <div v-for="item in result.items" :key="item.id" class="item">
            <span class="item-name" :class="{ completed: item.isComplete }">
              {{ item.name }}
            </span>
            <div class="item-info">
              <span class="item-status">
                {{ item.isComplete ? '✅ Complete' : '⏳ Pending' }}
              </span>
              <span v-if="item.dueDate" class="item-due-date">
                📅 {{ formatDueDate(item.dueDate) }}
              </span>
            </div>
          </div>
        </div>

        <details class="json-details">
          <summary>View Raw JSON</summary>
          <pre>{{ JSON.stringify(result, null, 2) }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-function {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.page-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
}

.test-container {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.test-container .btn {
  margin-bottom: 2rem;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: var(--border-radius-sm);
  padding: 1rem;
  margin-bottom: 1rem;
}

.error-message h3 {
  color: #c33;
  margin: 0 0 0.5rem 0;
}

.error-message p {
  margin: 0;
  color: #666;
}

.result-container {
  margin-top: 2rem;
}

.result-container h3 {
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.result-info {
  background: var(--light-bg);
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  margin-bottom: 1rem;
}

.result-info p {
  margin: 0;
  font-weight: 600;
}

.items-list {
  margin-bottom: 2rem;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  margin-bottom: 0.5rem;
  background: var(--white);
}

.item-name {
  font-weight: 500;
}

.item-name.completed {
  text-decoration: line-through;
  color: var(--text-muted);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-status {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.item-due-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.json-details {
  background: var(--light-bg);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.json-details summary {
  padding: 1rem;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--white);
  border-bottom: 1px solid var(--border-color);
}

.json-details pre {
  margin: 0;
  padding: 1rem;
  background: var(--light-bg);
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--white);
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
