<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isVisible = ref(false);

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? '⌘' : 'Ctrl';

const shortcuts = computed(() => {
  const currentRoute = route.name as string;
  
  const baseShortcuts = [
    { key: 'Esc', description: 'Cancel current action', context: 'global' }
  ];

  if (currentRoute === 'home') {
    return [
      ...baseShortcuts,
      { key: `${modKey} + Shift + N`, description: 'Create new list', context: 'home' }
    ];
  }

  if (currentRoute === 'list-detail') {
    return [
      ...baseShortcuts,
      { key: `${modKey} + Shift + A`, description: 'Add new item', context: 'list-detail' },
      { key: '↑ / ↓', description: 'Navigate items', context: 'list-detail' },
      { key: 'Enter / F2', description: 'Edit selected item', context: 'list-detail' },
      { key: `${modKey} + Enter`, description: 'Complete selected item', context: 'list-detail' },
      { key: `${modKey} + Shift + D`, description: 'Delete current list', context: 'list-detail' }
    ];
  }

  return baseShortcuts;
});

const toggleHelp = (): void => {
  isVisible.value = !isVisible.value;
};

const closeHelp = (): void => {
  isVisible.value = false;
};

const handleToggleHelp = (): void => {
  toggleHelp();
};

onMounted(() => {
  document.addEventListener('toggle-shortcuts-help', handleToggleHelp);
});

onUnmounted(() => {
  document.removeEventListener('toggle-shortcuts-help', handleToggleHelp);
});
</script>

<template>
  <div class="keyboard-shortcuts-help">
    <!-- Help trigger button -->
    <button 
      @click="toggleHelp"
      class="help-trigger"
      title="Keyboard shortcuts (Press ? to toggle)"
      aria-label="Show keyboard shortcuts"
    >
      ⌨️
    </button>

    <!-- Help overlay -->
    <div 
      v-if="isVisible" 
      class="help-overlay"
      @click="closeHelp"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div class="help-content" @click.stop>
        <div class="help-header">
          <h3 id="shortcuts-title">Keyboard Shortcuts</h3>
          <button 
            @click="closeHelp"
            class="close-btn"
            aria-label="Close shortcuts help"
          >
            ✕
          </button>
        </div>
        
        <div class="shortcuts-list">
          <div 
            v-for="shortcut in shortcuts" 
            :key="shortcut.key"
            class="shortcut-item"
          >
            <kbd class="shortcut-key">{{ shortcut.key }}</kbd>
            <span class="shortcut-description">{{ shortcut.description }}</span>
          </div>
        </div>
        
        <div class="help-footer">
          <p class="help-note">Press <kbd>?</kbd> to toggle this help</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.keyboard-shortcuts-help {
  position: relative;
}

.help-trigger {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all 0.2s;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-trigger:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.help-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.help-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e1e5e9;
}

.help-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f3f4;
  color: #333;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.2s;
}

.shortcut-item:hover {
  background: #e9ecef;
}

.shortcut-key {
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 0 #dee2e6;
}

.shortcut-description {
  color: var(--text-primary);
  font-weight: 500;
}

.help-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;
  text-align: center;
}

.help-note {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.help-note kbd {
  background: #f1f3f4;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-family: inherit;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .help-trigger {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .help-content {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .shortcut-key {
    min-width: 100px;
    font-size: 0.8rem;
  }
}
</style>
