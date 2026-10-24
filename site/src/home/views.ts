import AuthView from './AuthView.vibe';
import CardsView from './CardsView.vibe';
import ChatView from './ChatView.vibe';
import DashboardView from './DashboardView.vibe';

/** The composed screens shown on the homepage and the examples page. */
export const views = [
  {
    value: 'cards',
    label: 'Cards',
    description: 'Forms, settings and stats built from Card, Field, Select and Switch.',
    component: CardsView,
    inset: true,
  },
  {
    value: 'dashboard',
    label: 'Dashboard',
    description: 'A workspace overview with KPIs, a chart and a selectable table.',
    component: DashboardView,
    inset: false,
  },
  {
    value: 'chat',
    label: 'Chat',
    description: 'An assistant conversation with streaming replies and attachments.',
    component: ChatView,
    inset: false,
  },
  {
    value: 'auth',
    label: 'Sign in',
    description: 'An email sign-in flow with a one-time code step.',
    component: AuthView,
    inset: false,
  },
];
