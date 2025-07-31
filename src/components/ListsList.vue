<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useListsStore } from '../stores';
import ListForm from './ListForm.vue';

const router = useRouter();
const route = useRoute();
const listsStore = useListsStore();

const selectedTag = ref<string | null>(null);

const allTags = computed(() => listsStore.getAllTags());

const filteredLists = computed(() => {
  const allLists = listsStore.getAllLists();
  if (!selectedTag.value) {
    return allLists;
  }
  return allLists.filter(list => list.tags.includes(selectedTag.value!));
});

const navigateToList = (listId: string) => {
  router.push(`/list/${listId}`);
};



const clearTagFilter = () => {
  selectedTag.value = null;
  // Remove tag query parameter from URL
  router.push({ path: '/', query: {} });
};

const selectTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag;
  // Update URL query parameter
  if (selectedTag.value) {
    router.push({ path: '/', query: { tag: selectedTag.value } });
  } else {
    router.push({ path: '/', query: {} });
  }
};

// Initialize selectedTag from URL query parameter
onMounted(() => {
  if (route.query.tag && typeof route.query.tag === 'string') {
    selectedTag.value = route.query.tag;
  }
});

// Watch for route changes to update selectedTag
watch(() => route.query.tag, (newTag) => {
  selectedTag.value = newTag && typeof newTag === 'string' ? newTag : null;
});
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

    <!-- Tags Filter Section -->
    <div v-if="allTags.length > 0" class="tags-filter-section">
      <div class="tags-filter-content">
        <div class="tags-filter-list">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectTag(tag)"
            class="tag-filter-chip"
            :class="{ 'active': selectedTag === tag }"
          >
            #{{ tag }}
          </button>
        </div>
        <button 
          v-if="selectedTag" 
          @click="clearTagFilter" 
          class="clear-filter-btn"
          title="Clear filters"
        >
          Clear Filters
        </button>
      </div>
      <div v-if="selectedTag" class="filter-status">
        Showing {{ filteredLists.length }} list(s) with tag "#{{ selectedTag }}"
      </div>
    </div>

    <div class="lists-grid" v-if="filteredLists.length > 0">
      <div
        v-for="list in filteredLists"
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
        
        <!-- Tags Display -->
        <div v-if="list.tags.length > 0" class="list-tags">
          <span
            v-for="tag in list.tags"
            :key="tag"
            @click.stop="selectTag(tag)"
            class="list-tag-chip"
            :class="{ 'selected': selectedTag === tag }"
            :title="`Filter by #${tag}`"
          >
            #{{ tag }}
          </span>
        </div>
        
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
      <h3 v-if="selectedTag">No lists found with tag "#{{ selectedTag }}"</h3>
      <h3 v-else>No lists yet</h3>
      <p v-if="selectedTag">
        Try selecting a different tag or 
        <button @click="clearTagFilter" class="inline-btn">clear the filter</button>
      </p>
      <p v-else>Create your first todo list above!</p>
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

/* Tags Filter Section */
.tags-filter-section {
  background: rgba(255, 255, 255, 0.6);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.clear-filter-btn {
  background: var(--light-bg);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
  align-self: flex-start;
}

.clear-filter-btn:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.tags-filter-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.tags-filter-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.tag-filter-chip {
  background: var(--light-bg);
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.tag-filter-chip:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.tag-filter-chip.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.filter-status {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius-sm);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.view-tag-page-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  transition: var(--transition);
}

.view-tag-page-btn:hover {
  color: var(--primary-hover);
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

/* List Tags Display */
.list-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.list-tag-chip {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
}

.list-tag-chip:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.list-tag-chip.selected {
  background: var(--secondary-color);
  border-color: var(--secondary-hover);
  box-shadow: var(--shadow-sm);
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

.inline-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  padding: 0;
  transition: var(--transition);
}

.inline-btn:hover {
  color: var(--primary-hover);
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

  .tags-filter-section {
    padding: 0.5rem;
  }

  .tags-filter-content {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .clear-filter-btn {
    align-self: center;
  }

  .filter-status {
    text-align: center;
    padding: 0.4rem;
  }

  .tag-filter-chip {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
