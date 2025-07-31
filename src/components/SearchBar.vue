<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useListsStore } from '../stores/lists';
import { useListItemsStore } from '../stores/listItems';

interface SearchResult {
  type: 'list' | 'item';
  id: string;
  title: string;
  description?: string;
  listId?: string;
  listName?: string;
  isComplete?: boolean;
  matchedText: string;
}

const router = useRouter();
const listsStore = useListsStore();
const listItemsStore = useListItemsStore();

const searchQuery = ref('');
const isSearchOpen = ref(false);
const searchTimeout = ref<number | null>(null);
const debouncedQuery = ref('');

// Debounce search input by 500ms
watch(searchQuery, (newQuery) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = setTimeout(() => {
    debouncedQuery.value = newQuery;
  }, 500);
});

// Close search when clicking outside
const searchContainer = ref<HTMLElement>();

const handleClickOutside = (event: Event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    isSearchOpen.value = false;
  }
};

watch(isSearchOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

// Highlight matching text
const highlightMatch = (text: string, query: string): string => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Search logic
const searchResults = computed((): SearchResult[] => {
  const query = debouncedQuery.value.trim().toLowerCase();
  if (!query) return [];

  const results: SearchResult[] = [];
  const lists = listsStore.getAllLists();

  // Search through lists
  lists.forEach(list => {
    const listNameMatch = list.name.toLowerCase().includes(query);
    const listDescMatch = list.description.toLowerCase().includes(query);
    
    if (listNameMatch || listDescMatch) {
      let matchedText = '';
      if (listNameMatch) {
        matchedText = highlightMatch(list.name, query);
      } else if (listDescMatch) {
        matchedText = highlightMatch(list.description, query);
      }

      results.push({
        type: 'list',
        id: list.id,
        title: list.name,
        description: list.description,
        matchedText
      });
    }

    // Search through items in this list
    const listItems = listItemsStore.getItemsByListId(list.id);
    listItems.forEach(item => {
      const itemNameMatch = item.name.toLowerCase().includes(query);
      
      if (itemNameMatch) {
        results.push({
          type: 'item',
          id: item.id,
          title: item.name,
          listId: list.id,
          listName: list.name,
          isComplete: item.isComplete,
          matchedText: highlightMatch(item.name, query)
        });
      }
    });
  });

  return results.slice(0, 10); // Limit to 10 results
});

const handleFocus = () => {
  isSearchOpen.value = true;
};

const handleResultClick = (result: SearchResult) => {
  if (result.type === 'list') {
    router.push(`/list/${result.id}`);
  } else {
    router.push(`/list/${result.listId}`);
  }
  isSearchOpen.value = false;
  searchQuery.value = '';
};

const clearSearch = () => {
  searchQuery.value = '';
  debouncedQuery.value = '';
  isSearchOpen.value = false;
};
</script>

<template>
  <div class="search-container" ref="searchContainer">
    <div class="search-input-wrapper">
      <input
        v-model="searchQuery"
        @focus="handleFocus"
        type="text"
        placeholder="Search lists and items..."
        class="search-input"
      />
      <div class="search-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-button"
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div v-if="isSearchOpen && debouncedQuery" class="search-dropdown">
      <div v-if="searchResults.length === 0" class="no-results">
        No results found for "{{ debouncedQuery }}"
      </div>
      
      <div v-else class="search-results">
        <div
          v-for="result in searchResults"
          :key="`${result.type}-${result.id}`"
          @click="handleResultClick(result)"
          class="search-result"
        >
          <div class="result-icon">
            <svg v-if="result.type === 'list'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
              <path d="M21 19c.552 0 1-.448 1-1v-6c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,11 12,14 22,4"></polyline>
              <path d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"></path>
            </svg>
          </div>
          
          <div class="result-content">
            <div class="result-title" v-html="result.matchedText"></div>
            <div v-if="result.type === 'item'" class="result-meta">
              <span class="list-name">in {{ result.listName }}</span>
              <span v-if="result.isComplete" class="completion-status complete">✓ Complete</span>
              <span v-else class="completion-status pending">⏳ Pending</span>
            </div>
            <div v-if="result.type === 'list' && result.description" class="result-description">
              {{ result.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  width: 300px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  font-size: 0.875rem;
  transition: var(--transition);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
}

.clear-button {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: var(--transition);
}

.clear-button:hover {
  color: var(--white);
  background: rgba(255, 255, 255, 0.1);
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.5rem;
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
}

.search-results {
  padding: 0.5rem 0;
}

.search-result {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 1px solid var(--border-color);
}

.search-result:last-child {
  border-bottom: none;
}

.search-result:hover {
  background: var(--light-bg);
}

.result-icon {
  color: var(--text-muted);
  margin-top: 0.125rem;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.result-title :deep(mark) {
  background: rgba(102, 126, 234, 0.2);
  color: var(--primary-color);
  padding: 0.125rem 0.25rem;
  border-radius: 0.125rem;
  font-weight: 400;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.list-name {
  color: var(--text-secondary);
}

.completion-status {
  font-weight: 500;
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;
}

.completion-status.complete {
  background-color: var(--success-color);
  color: var(--white);
}

.completion-status.pending {
  background-color: var(--warning-color);
  color: var(--text-primary);
}

.result-description {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .search-container {
    width: 250px;
  }
  
  .search-input {
    font-size: 0.8rem;
    padding: 0.6rem 2.25rem 0.6rem 2.25rem;
  }
}
</style>
