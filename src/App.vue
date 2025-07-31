<script setup lang="ts">
import { RouterView } from 'vue-router';
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
