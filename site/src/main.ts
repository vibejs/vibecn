import { createApp } from '@usevibejs/ui';
import App from './App.vibe';
import { router } from './router.ts';
import './styles.css';

createApp(App).use(router).mount('#app');
