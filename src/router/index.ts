import { createRouter, createWebHistory } from 'vue-router';
import ListsList from '../components/ListsList.vue';
import ListDetail from '../components/ListDetail.vue';
import UserProfile from '../components/UserProfile.vue';
import TestFunction from '../components/TestFunction.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ListsList,
    },
    {
      path: '/list/:id',
      name: 'list-detail',
      component: ListDetail,
      props: true,
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile,
    },
    {
      path: '/test-function',
      name: 'test-function',
      component: TestFunction,
    },
  ],
});

export default router;
