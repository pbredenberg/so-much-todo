<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores';

const userStore = useUserStore();

const userName = ref(userStore.user.userName);
const profileUrl = ref(userStore.user.profileUrl);

const saveProfile = () => {
  userStore.setUser({
    userName: userName.value,
    profileUrl: profileUrl.value,
  });
};
</script>

<template>
  <div class="user-profile">
    <h2>User Profile</h2>

    <form @submit.prevent="saveProfile" class="profile-form">
      <div class="form-group">
        <label for="userName">User Name:</label>
        <input
          id="userName"
          v-model="userName"
          type="text"
          placeholder="Enter your name"
          required
        />
      </div>

      <div class="form-group">
        <label for="profileUrl">Profile URL:</label>
        <input
          id="profileUrl"
          v-model="profileUrl"
          type="url"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <button type="submit" class="btn btn-primary">Save Profile</button>
    </form>
  </div>
</template>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-profile h2 {
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #555;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
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
</style>
