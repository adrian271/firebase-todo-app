// seed.js — Initial project + task data for the prototype.
// Dates are computed relative to "now" so the heat ramp lights up correctly
// whenever someone opens the file.

const _now = Date.now();
const _day = 86400000;
const inDays = (d) => _now + d * _day;

const SEED_DATA = {
  user: { name: 'Alex Reyes', email: 'alex@studio.dev' },
  projects: [
    {
      id: 'p_inbox', name: 'Inbox', icon: 'inbox', color: '#5b9bff',
      collapsed: false, system: true,
    },
    {
      id: 'p_app', name: 'Mobile App v2', icon: 'phone', color: '#a78bfa',
      collapsed: false,
    },
    {
      id: 'p_marketing', name: 'Marketing Site', icon: 'globe', color: '#84cc16',
      collapsed: false,
    },
    {
      id: 'p_personal', name: 'Personal', icon: 'leaf', color: '#f97316',
      collapsed: true,
    },
  ],
  tasks: [
    // Inbox
    { id: 't1', project: 'p_inbox', title: 'Triage Slack threads from Monday',
      priority: 'P3', due: inDays(0), created: inDays(-1), done: false,
      tags: ['quick'], notes: '', subtasks: [], estimate: 15 },
    { id: 't2', project: 'p_inbox', title: 'Reply to Figma comment from Priya',
      priority: 'P4', due: inDays(2), created: inDays(-2), done: false,
      tags: [], notes: '', subtasks: [], estimate: 10 },

    // Mobile App v2
    { id: 't3', project: 'p_app',
      title: 'Wire up Firebase Auth for the new onboarding',
      priority: 'P1', due: inDays(-1), created: inDays(-4), done: false,
      tags: ['firebase', 'auth'],
      notes: 'Use the modular SDK. Need to handle the anonymous → linked flow when a user signs up after starting trial.',
      subtasks: [
        { id: 's1', title: 'Anonymous sign-in', done: true },
        { id: 's2', title: 'Email + password', done: true },
        { id: 's3', title: 'Apple Sign In', done: false },
        { id: 's4', title: 'Link anonymous → permanent', done: false },
      ],
      estimate: 240,
    },
    { id: 't4', project: 'p_app', title: 'Design empty state for Activity tab',
      priority: 'P2', due: inDays(1), created: inDays(-2), done: false,
      tags: ['design'], notes: 'Illustration + CTA. Ask James for icon set.',
      subtasks: [], estimate: 90 },
    { id: 't5', project: 'p_app', title: 'Migrate analytics events to GA4 schema',
      priority: 'P2', due: inDays(3), created: inDays(-3), done: false,
      tags: ['firebase', 'analytics'], notes: '', subtasks: [
        { id: 's5', title: 'Audit current events', done: true },
        { id: 's6', title: 'Map to GA4 params', done: false },
        { id: 's7', title: 'Update SDK calls', done: false },
      ], estimate: 180 },
    { id: 't6', project: 'p_app',
      title: 'Fix iPad split-view layout in Settings',
      priority: 'P3', due: inDays(6), created: inDays(-1), done: false,
      tags: ['ios', 'bug'], notes: '', subtasks: [], estimate: 60 },
    { id: 't7', project: 'p_app',
      title: 'Crash on launch when offline + cold start',
      priority: 'P1', due: inDays(0), created: inDays(-1), done: false,
      tags: ['bug', 'firebase'], notes: 'Repro: airplane mode → kill app → relaunch. Stack trace points at Firestore listener attach.',
      subtasks: [], estimate: 120 },
    { id: 't8', project: 'p_app', title: 'Set up release candidate build pipeline',
      priority: 'P3', due: inDays(12), created: inDays(-5), done: true,
      tags: ['ci'], notes: '', subtasks: [], estimate: 240 },

    // Marketing Site
    { id: 't9', project: 'p_marketing', title: 'Draft pricing page copy v3',
      priority: 'P2', due: inDays(2), created: inDays(-3), done: false,
      tags: ['copy'], notes: '', subtasks: [
        { id: 's8', title: 'Hero headline', done: true },
        { id: 's9', title: 'Tier comparison', done: false },
        { id: 's10', title: 'FAQ', done: false },
      ], estimate: 120 },
    { id: 't10', project: 'p_marketing',
      title: 'Replace hero illustration with product shot',
      priority: 'P3', due: inDays(5), created: inDays(-2), done: false,
      tags: ['design'], notes: '', subtasks: [], estimate: 45 },
    { id: 't11', project: 'p_marketing',
      title: 'Schedule launch tweet thread',
      priority: 'P4', due: inDays(8), created: inDays(-1), done: false,
      tags: ['social'], notes: '', subtasks: [], estimate: 30 },

    // Personal
    { id: 't12', project: 'p_personal', title: 'Renew passport',
      priority: 'P2', due: inDays(14), created: inDays(-10), done: false,
      tags: ['admin'], notes: '', subtasks: [], estimate: 60 },
    { id: 't13', project: 'p_personal', title: 'Dentist — six month checkup',
      priority: 'P4', due: inDays(21), created: inDays(-5), done: false,
      tags: ['health'], notes: '', subtasks: [], estimate: 60 },
    { id: 't14', project: 'p_personal', title: 'Book flights for Lisbon trip',
      priority: 'P2', due: inDays(4), created: inDays(-7), done: false,
      tags: ['travel'], notes: '', subtasks: [
        { id: 's11', title: 'Compare dates', done: true },
        { id: 's12', title: 'Book outbound', done: false },
        { id: 's13', title: 'Book return', done: false },
      ], estimate: 45 },
  ],
};

Object.assign(window, { SEED_DATA });
