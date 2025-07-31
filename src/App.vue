<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts';
import { useRoute } from 'vue-router';

const route = useRoute();
const { registerShortcut } = useKeyboardShortcuts();

// Global keyboard shortcuts
const setupGlobalShortcuts = (): void => {
  // Create List shortcut (Ctrl/Cmd + Shift + N) - works on home page
  registerShortcut({
    shortcut: { key: 'n', ctrlKey: true, metaKey: true, shiftKey: true },
    handler: () => {
      const currentRoute = route.name as string;
      if (currentRoute === 'home') {
        // Trigger list form opening
        const event = new CustomEvent('open-list-form');
        document.dispatchEvent(event);
      }
    },
    context: 'home',
    description: 'Create new list'
  });

  // Add Item shortcut (Ctrl/Cmd + Shift + A) - works on list detail page
  registerShortcut({
    shortcut: { key: 'a', ctrlKey: true, metaKey: true, shiftKey: true },
    handler: () => {
      const currentRoute = route.name as string;
      if (currentRoute === 'list-detail') {
        // Trigger add item form opening
        const event = new CustomEvent('open-add-item-form');
        document.dispatchEvent(event);
      }
    },
    context: 'list-detail',
    description: 'Add new item'
  });

  // Delete List shortcut (Ctrl/Cmd + Shift + D) - works on list detail page
  registerShortcut({
    shortcut: { key: 'd', ctrlKey: true, metaKey: true, shiftKey: true },
    handler: () => {
      const currentRoute = route.name as string;
      if (currentRoute === 'list-detail') {
        // Trigger list deletion
        const event = new CustomEvent('delete-current-list');
        document.dispatchEvent(event);
      }
    },
    context: 'list-detail',
    description: 'Delete current list'
  });

  // Item navigation and actions (Arrow keys, Enter, Ctrl+Enter)
  registerShortcut({
    shortcut: { key: 'ArrowDown' },
    handler: () => {
      const currentRoute = route.name as string;
      if (currentRoute === 'list-detail') {
        const event = new CustomEvent('select-next-item');
        document.dispatchEvent(event);
      }
    },
    context: 'list-detail',
    description: 'Select next item'
  });

  registerShortcut({
    shortcut: { key: 'ArrowUp' },
    handler: () => {
      const currentRoute = route.name as string;
      if (currentRoute === 'list-detail') {
        const event = new CustomEvent('select-previous-item');
        document.dispatchEvent(event);
      }
    },
    context: 'list-detail',
    description: 'Select previous item'
  });

  registerShortcut({
    shortcut: { key: 'Enter' },
    handler: () => {
      const currentRoute = route.name as string;
      if (currentRoute === 'list-detail') {
        const event = new CustomEvent('edit-selected-item');
        document.dispatchEvent(event);
      }
    },
    context: 'list-detail',
    description: 'Edit selected item'
  });

  registerShortcut({
    shortcut: { key: 'F2' },
    handler: () => {
      const currentRoute = route.name as string;
      if (currentRoute === 'list-detail') {
        const event = new CustomEvent('edit-selected-item');
        document.dispatchEvent(event);
      }
    },
    context: 'list-detail',
    description: 'Edit selected item (F2)'
  });

  registerShortcut({
    shortcut: { key: 'Enter', ctrlKey: true, metaKey: true },
    handler: () => {
      const currentRoute = route.name as string;
      if (currentRoute === 'list-detail') {
        const event = new CustomEvent('complete-selected-item');
        document.dispatchEvent(event);
      }
    },
    context: 'list-detail',
    description: 'Complete selected item'
  });

  registerShortcut({
    shortcut: { key: 'Escape' },
    handler: () => {
      const event = new CustomEvent('cancel-current-action');
      document.dispatchEvent(event);
    },
    description: 'Cancel current action'
  });
};

// Initialize shortcuts
setupGlobalShortcuts();
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <h1>So Much Todo</h1>
          <nav class="header-nav">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
            <RouterLink to="/profile" class="nav-link">Profile</RouterLink>
            <RouterLink to="/test-function" class="nav-link"
              >Test API</RouterLink
            >
          </nav>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-header {
  background: var(--primary-gradient);
  color: var(--white);
  padding: 1rem 0;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--white);
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  transition: var(--transition);
  opacity: 0.9;
}

.nav-link:hover,
.nav-link.router-link-active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.app-main {
  flex: 1;
  padding: 2rem 0;
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .app-header h1 {
    font-size: 1.5rem;
  }

  .header-nav {
    gap: 1rem;
  }

  .app-main {
    padding: 1rem 0;
  }
}
</style>
