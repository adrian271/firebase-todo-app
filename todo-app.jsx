// todo-app.jsx — Root TodoApp component, sidebar, project sections, quick add.

const { useState: useStateApp, useEffect: useEffectApp, useRef: useRefApp, useMemo: useMemoApp } = React;

// ── Custom traffic lights (so chrome respects theme) ──────────
function TrafficLights({ accent = false }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0 4px' }}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
        <span key={i} style={{
          width: 12, height: 12, borderRadius: '50%',
          background: c, boxShadow: 'inset 0 0 0 .5px rgba(0,0,0,.18)',
        }} />
      ))}
    </div>
  );
}

// ── Sync indicator ────────────────────────────────────────────
function SyncIndicator({ theme, user }) {
  const [state, setState] = useStateApp('synced'); // synced | syncing | offline
  // Simulate occasional sync activity
  useEffectApp(() => {
    const id = setInterval(() => {
      setState('syncing');
      setTimeout(() => setState('synced'), 900);
    }, 18000 + Math.random() * 10000);
    return () => clearInterval(id);
  }, []);
  const t = theme.tokens;
  const dotColor = state === 'syncing' ? '#eab308' : state === 'offline' ? '#ef4444' : '#22c55e';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderTop: `1px solid ${t.border}`,
      fontSize: 11, color: t.textMuted,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: dotColor,
        boxShadow: state === 'syncing' ? `0 0 0 3px ${dotColor}33` : 'none',
        animation: state === 'syncing' ? 'todoPulse 1s ease-in-out infinite' : 'none',
        flexShrink: 0,
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.25 }}>
        <span style={{ color: t.text, fontWeight: 500, fontSize: 11 }}>
          {state === 'syncing' ? 'Syncing…' : state === 'offline' ? 'Offline' : 'Synced'}
        </span>
        <span style={{
          fontSize: 10, color: t.textDim, fontFamily: t.monoFont,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{user.email}</span>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({
  theme, projects, tasks, user, onAddProject,
  dragOverProjectId, onProjectDragOver, onProjectDrop, onScrollToProject,
  variant,
}) {
  const t = theme.tokens;
  const [newName, setNewName] = useStateApp('');
  const [adding, setAdding] = useStateApp(false);

  const counts = useMemoApp(() => {
    const c = {};
    projects.forEach(p => { c[p.id] = 0; });
    tasks.forEach(t => { if (!t.done) c[t.project] = (c[t.project] || 0) + 1; });
    return c;
  }, [projects, tasks]);

  // Aggregate badges
  const overdueCount = tasks.filter(t => !t.done && heatBucket(t.due) === 'overdue').length;
  const todayCount = tasks.filter(t => !t.done && heatBucket(t.due) === 'today').length;

  return (
    <div style={{
      width: 200, flexShrink: 0,
      background: t.surface, borderRight: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      fontFamily: t.sansFont,
    }}>
      {/* Smart inboxes */}
      <div style={{ padding: '14px 8px 4px' }}>
        <SidebarItem theme={theme} icon="flame" label="Today"
          count={todayCount} onClick={() => onScrollToProject('__today')} />
        <SidebarItem theme={theme} icon="calendar" label="Overdue"
          count={overdueCount} highlight={overdueCount > 0}
          onClick={() => onScrollToProject('__overdue')} />
      </div>

      <div style={{
        padding: '12px 14px 6px', fontSize: 9.5, fontWeight: 700,
        letterSpacing: '.08em', textTransform: 'uppercase', color: t.textDim,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>Projects</span>
        <button
          onClick={() => setAdding(true)}
          style={{
            background: 'none', border: 0, color: t.textMuted, cursor: 'pointer',
            padding: 2, display: 'flex', borderRadius: 3,
          }}
          title="New project (P)"
        ><Icon name="plus" size={12} /></button>
      </div>

      <div style={{ padding: '0 8px', flex: 1, overflowY: 'auto' }}>
        {projects.map(p => (
          <SidebarItem
            key={p.id}
            theme={theme}
            color={p.color}
            label={p.name}
            count={counts[p.id]}
            dropActive={dragOverProjectId === p.id}
            onDragOver={(e) => onProjectDragOver(e, p.id)}
            onDragLeave={() => onProjectDragOver(null, null)}
            onDrop={(e) => onProjectDrop(e, p.id)}
            onClick={() => onScrollToProject(p.id)}
          />
        ))}
        {adding && (
          <div style={{ padding: '4px 6px' }}>
            <input
              autoFocus
              placeholder="New project…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => {
                if (newName.trim()) onAddProject(newName.trim());
                setNewName(''); setAdding(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.target.blur(); }
                if (e.key === 'Escape') { setNewName(''); setAdding(false); }
              }}
              style={{
                width: '100%', padding: '4px 8px', borderRadius: 5,
                border: `1px solid ${t.borderStrong}`,
                background: t.surfaceAlt, color: t.text,
                font: 'inherit', fontSize: 12, outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      <SyncIndicator theme={theme} user={user} />
    </div>
  );
}

function SidebarItem({
  theme, icon, color, label, count, highlight,
  onClick, onDragOver, onDragLeave, onDrop, dropActive,
}) {
  const t = theme.tokens;
  const [hover, setHover] = useStateApp(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
        background: dropActive ? t.selBg : (hover ? t.surface2 : 'transparent'),
        color: t.text, fontSize: 12.5, fontWeight: 500,
        marginBottom: 1, position: 'relative',
        outline: dropActive ? `1.5px dashed ${t.accent}` : 'none',
        transition: 'background .12s',
      }}
    >
      {icon ? (
        <span style={{ color: highlight ? '#ef4444' : t.textMuted, display: 'flex' }}>
          <Icon name={icon} size={13} />
        </span>
      ) : (
        <span style={{
          width: 9, height: 9, borderRadius: 3,
          background: color || t.borderStrong, flexShrink: 0,
        }} />
      )}
      <span style={{
        flex: 1, minWidth: 0, whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{label}</span>
      {count > 0 && (
        <span style={{
          fontSize: 10, fontFamily: t.monoFont, color: highlight ? '#ef4444' : t.textDim,
          minWidth: 16, textAlign: 'right',
        }}>{count}</span>
      )}
    </div>
  );
}

// ── ProjectSection ────────────────────────────────────────────
function ProjectSection({
  project, tasks, theme, variant, collapsed, expandedTaskId,
  onToggleCollapse, onToggleTask, onExpandTask, onUpdateTask, onDeleteTask,
  onAddTask, dragInfo, setDragInfo,
}) {
  const t = theme.tokens;
  const isCards = variant === 'cards';
  const dense = variant === 'compact';
  const [addingTask, setAddingTask] = useStateApp(false);
  const [draft, setDraft] = useStateApp('');

  const handleAdd = () => {
    if (draft.trim()) onAddTask(project.id, draft.trim());
    setDraft(''); setAddingTask(false);
  };

  // Drag handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/task-id', taskId);
    setDragInfo({ id: taskId, sourceProject: project.id, overTask: null, overPos: null });
  };
  const handleDragOver = (e, taskId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const before = (e.clientY - rect.top) < rect.height / 2;
    setDragInfo(d => d ? { ...d, overTask: taskId, overPos: before ? 'before' : 'after' } : d);
  };
  const handleDrop = (e, taskId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/task-id');
    if (draggedId && dragInfo && dragInfo.overTask) {
      const before = dragInfo.overPos === 'before';
      window.__todoMutate.reorderTask(draggedId, taskId, before, project.id);
    }
    setDragInfo(null);
  };
  const handleDragEnd = () => setDragInfo(null);

  // Section drop (empty area)
  const handleSectionDragOver = (e) => {
    if (dragInfo) e.preventDefault();
  };
  const handleSectionDrop = (e) => {
    const draggedId = e.dataTransfer.getData('text/task-id');
    if (draggedId) window.__todoMutate.moveToProject(draggedId, project.id);
    setDragInfo(null);
  };

  const projectColor = project.color || t.accent;
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;

  return (
    <section
      id={`proj-${project.id}`}
      onDragOver={handleSectionDragOver}
      onDrop={handleSectionDrop}
      style={{
        marginBottom: isCards ? 24 : 18,
        scrollMarginTop: 12,
      }}
    >
      {/* Project header */}
      <div
        onClick={() => onToggleCollapse(project.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: dense ? '5px 12px' : '8px 12px',
          cursor: 'pointer', position: 'sticky', top: 0,
          background: t.bg, zIndex: 2,
          borderBottom: collapsed ? `1px solid ${t.border}` : 'none',
        }}
      >
        <Icon name={collapsed ? 'chevronRight' : 'chevronDown'} size={11}
          style={{ color: t.textMuted }} />
        <span style={{
          width: 9, height: 9, borderRadius: 3, background: projectColor,
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: dense ? 13 : 14, fontWeight: 600, color: t.text,
          letterSpacing: '-.005em',
        }}>{project.name}</span>
        <span style={{
          fontSize: 10.5, color: t.textDim, fontFamily: t.monoFont, marginLeft: 4,
        }}>{done}/{total}</span>
        <span style={{ flex: 1 }} />
        <button
          onClick={(e) => { e.stopPropagation(); setAddingTask(true); }}
          style={{
            background: 'none', border: 0, color: t.textMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 11, padding: '2px 6px', borderRadius: 4,
          }}
          title="Add task (n)"
        >
          <Icon name="plus" size={11} /> Add
        </button>
      </div>

      {/* Tasks */}
      {!collapsed && (
        <div style={{
          padding: isCards ? '4px 12px 0' : 0,
          borderLeft: isCards ? 'none' : `1px solid ${t.border}`,
          borderRight: isCards ? 'none' : `1px solid ${t.border}`,
          borderBottom: isCards ? 'none' : `1px solid ${t.border}`,
          margin: isCards ? '4px 0 0' : '0 12px',
          background: isCards ? 'transparent' : t.surface,
          borderRadius: isCards ? 0 : 6,
        }}>
          {tasks.length === 0 && !addingTask && (
            <div style={{
              padding: '14px 16px', fontSize: 11.5, color: t.textDim, fontStyle: 'italic',
            }}>No tasks. Drop one here or click Add.</div>
          )}
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              project={project}
              theme={theme}
              variant={variant}
              expanded={expandedTaskId === task.id}
              onToggle={onToggleTask}
              onExpand={onExpandTask}
              onUpdate={(patch) => onUpdateTask(task.id, patch)}
              onDelete={() => onDeleteTask(task.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              isDragging={dragInfo && dragInfo.id === task.id}
              dragOverPos={dragInfo && dragInfo.overTask === task.id ? dragInfo.overPos : null}
            />
          ))}
          {addingTask && (
            <div style={{
              padding: isCards ? '8px 0' : '8px 16px',
              borderTop: isCards ? 'none' : `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                border: `1.5px dashed ${t.borderStrong}`, flexShrink: 0,
              }} />
              <input
                autoFocus
                placeholder="Task name — try '!1' for P1, '@today', '~30m', '#tag'"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={handleAdd}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { handleAdd(); }
                  if (e.key === 'Escape') { setDraft(''); setAddingTask(false); }
                }}
                style={{
                  flex: 1, background: 'transparent', border: 0, outline: 0,
                  color: t.text, font: 'inherit', fontSize: 13, padding: 0, minWidth: 0,
                }}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ── QuickAdd (top bar) ────────────────────────────────────────
function QuickAdd({ theme, projects, onAdd, search, onSearch, allCollapsed, onToggleAll }) {
  const t = theme.tokens;
  const [draft, setDraft] = useStateApp('');
  const [projectId, setProjectId] = useStateApp(projects[0]?.id || 'p_inbox');
  const [mode, setMode] = useStateApp('add'); // 'add' | 'search'
  const inputRef = useRefApp(null);

  const submit = () => {
    if (mode === 'search') { return; }
    if (draft.trim()) {
      onAdd(projectId, draft.trim());
      setDraft('');
    }
  };

  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'center',
      padding: '8px 12px', borderBottom: `1px solid ${t.border}`,
      background: t.chrome,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        flex: 1, background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 6, padding: '5px 10px',
        boxShadow: 'inset 0 1px 0 rgba(0,0,0,.02)',
      }}>
        <span style={{ color: t.textMuted, display: 'flex' }}>
          <Icon name={mode === 'search' ? 'search' : 'plus'} size={13} />
        </span>
        <input
          ref={inputRef}
          placeholder={mode === 'search' ? 'Search all tasks…' : 'Add task to…'}
          value={mode === 'search' ? search : draft}
          onChange={(e) => mode === 'search' ? onSearch(e.target.value) : setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && mode === 'add') submit();
            if (e.key === 'Escape') { setDraft(''); onSearch(''); setMode('add'); }
          }}
          style={{
            flex: 1, background: 'transparent', border: 0, outline: 0,
            color: t.text, font: 'inherit', fontSize: 13, minWidth: 0,
          }}
        />
        {mode === 'add' && (
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            style={{
              background: 'transparent', border: 0, color: t.textMuted,
              font: 'inherit', fontSize: 11, outline: 0, cursor: 'pointer',
              maxWidth: 110,
            }}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}
      </div>
      <button
        onClick={() => {
          setMode(m => m === 'search' ? 'add' : 'search');
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        title="Search (/)"
        style={{
          background: mode === 'search' ? t.selBg : 'transparent',
          color: mode === 'search' ? t.selText : t.textMuted,
          border: `1px solid ${t.border}`,
          borderRadius: 6, padding: '5px 8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
        }}
      >
        <Icon name="search" size={12} />
      </button>
      <button
        onClick={onToggleAll}
        title={allCollapsed ? 'Expand all projects' : 'Collapse all projects'}
        style={{
          background: 'transparent', color: t.textMuted,
          border: `1px solid ${t.border}`,
          borderRadius: 6, padding: '5px 8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5,
          fontFamily: t.monoFont, whiteSpace: 'nowrap',
        }}
      >
        <Icon name={allCollapsed ? 'chevronRight' : 'chevronDown'} size={11} />
        {allCollapsed ? 'Expand' : 'Collapse'} all
      </button>
    </div>
  );
}

// ── Parse quick-add tokens: '!1' '@today' '~30m' '#tag' ──────
function parseQuickAdd(input) {
  let title = input;
  let priority = 'P3';
  let due = null;
  let estimate = 0;
  const tags = [];
  // !1..!4
  title = title.replace(/(?:^|\s)!([1-4])\b/g, (_, n) => { priority = `P${n}`; return ' '; });
  // ~30m, ~2h
  title = title.replace(/(?:^|\s)~(\d+)(m|h)\b/gi, (_, n, u) => {
    estimate = parseInt(n, 10) * (u.toLowerCase() === 'h' ? 60 : 1); return ' ';
  });
  // #tag
  title = title.replace(/(?:^|\s)#([a-z0-9_-]+)/gi, (_, t) => { tags.push(t); return ' '; });
  // @today @tomorrow @Nd
  title = title.replace(/(?:^|\s)@(today|tomorrow|(\d+)d)\b/gi, (_, w, n) => {
    if (w === 'today') due = Date.now();
    else if (w === 'tomorrow') due = Date.now() + DAY;
    else due = Date.now() + parseInt(n, 10) * DAY;
    return ' ';
  });
  return { title: title.trim().replace(/\s+/g, ' '), priority, due, estimate, tags };
}

// ── Main TodoApp root ─────────────────────────────────────────
function TodoApp({ variant = 'list', theme, onToggleDark }) {
  const t = theme.tokens;
  const [data, setData] = useStateApp(() => {
    // Deep clone seed
    return JSON.parse(JSON.stringify(SEED_DATA));
  });
  const [collapsed, setCollapsed] = useStateApp(() => {
    const m = {};
    SEED_DATA.projects.forEach(p => { m[p.id] = !!p.collapsed; });
    return m;
  });
  const [expandedTaskId, setExpandedTaskId] = useStateApp(null);
  const [search, setSearch] = useStateApp('');
  const [dragInfo, setDragInfo] = useStateApp(null);
  const [dragOverProjectId, setDragOverProjectId] = useStateApp(null);
  const containerRef = useRefApp(null);

  // Mutations
  const toggleTask = (id) => setData(d => ({
    ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
  }));
  const updateTask = (id, patch) => setData(d => ({
    ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, ...patch } : t),
  }));
  const deleteTask = (id) => setData(d => ({
    ...d, tasks: d.tasks.filter(t => t.id !== id),
  }));
  const addTask = (projectId, raw) => {
    const parsed = parseQuickAdd(raw);
    const newTask = {
      id: 't' + Math.random().toString(36).slice(2, 8),
      project: projectId, title: parsed.title || raw,
      priority: parsed.priority, due: parsed.due,
      created: Date.now(), done: false,
      tags: parsed.tags, notes: '', subtasks: [], estimate: parsed.estimate,
    };
    setData(d => ({ ...d, tasks: [...d.tasks, newTask] }));
  };
  const addProject = (name) => {
    const colors = ['#5b9bff', '#a78bfa', '#84cc16', '#f97316', '#22c55e', '#ec4899'];
    const newP = {
      id: 'p_' + Math.random().toString(36).slice(2, 8),
      name, color: colors[Math.floor(Math.random() * colors.length)],
      collapsed: false,
    };
    setData(d => ({ ...d, projects: [...d.projects, newP] }));
    setCollapsed(c => ({ ...c, [newP.id]: false }));
  };
  const reorderTask = (draggedId, targetId, before, projectId) => {
    setData(d => {
      const dragged = d.tasks.find(t => t.id === draggedId);
      const others = d.tasks.filter(t => t.id !== draggedId);
      const targetIdx = others.findIndex(t => t.id === targetId);
      const movedTask = { ...dragged, project: projectId };
      const insertAt = before ? targetIdx : targetIdx + 1;
      const next = [...others.slice(0, insertAt), movedTask, ...others.slice(insertAt)];
      return { ...d, tasks: next };
    });
  };
  const moveToProject = (taskId, projectId) => {
    setData(d => ({
      ...d, tasks: d.tasks.map(t => t.id === taskId ? { ...t, project: projectId } : t),
    }));
  };
  // Expose for child reuse
  window.__todoMutate = { reorderTask, moveToProject };

  const toggleCollapse = (id) => setCollapsed(c => ({ ...c, [id]: !c[id] }));
  // "All collapsed" = every project's collapsed flag is true. Mixed state
  // counts as expanded so the first click of the button collapses everything.
  const allCollapsed = data.projects.length > 0 && data.projects.every(p => collapsed[p.id]);
  const toggleAll = () => {
    const next = {};
    data.projects.forEach(p => { next[p.id] = !allCollapsed; });
    setCollapsed(next);
  };
  const handleProjectDragOver = (e, projectId) => {
    if (!projectId) { setDragOverProjectId(null); return; }
    e.preventDefault();
    setDragOverProjectId(projectId);
  };
  const handleProjectDrop = (e, projectId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/task-id');
    if (draggedId) moveToProject(draggedId, projectId);
    setDragOverProjectId(null);
    setDragInfo(null);
  };
  const scrollToProject = (projectId) => {
    if (projectId === '__today' || projectId === '__overdue') return; // smart filter (future)
    const el = containerRef.current?.querySelector(`#proj-${projectId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (collapsed[projectId]) toggleCollapse(projectId);
  };

  // Keyboard shortcuts (scoped: only when our root is in focus / hovered)
  useEffectApp(() => {
    const handler = (e) => {
      // Only respond when this prototype's container has hover or focus
      const root = containerRef.current?.parentElement;
      if (!root || !root.matches(':hover')) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === '/') {
        e.preventDefault();
        const input = containerRef.current?.querySelector('input[placeholder*="Search"], input[placeholder*="Add task"]');
        // Not perfect — flip the quick-add to search mode would need a ref handle.
      }
      if (e.key === 'n') {
        e.preventDefault();
        const firstAdd = containerRef.current?.querySelector('button[title^="Add"]');
        firstAdd?.click();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Filtered tasks
  const filterRegex = search.trim() ? new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
  const projectsToShow = data.projects;

  return (
    <div ref={containerRef} style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'row',
      background: t.bg, color: t.text,
      fontFamily: t.sansFont, fontSize: 13,
      overflow: 'hidden', borderRadius: 'inherit',
    }}>
      <Sidebar
        theme={theme}
        projects={data.projects}
        tasks={data.tasks}
        user={data.user}
        onAddProject={addProject}
        dragOverProjectId={dragOverProjectId}
        onProjectDragOver={handleProjectDragOver}
        onProjectDrop={handleProjectDrop}
        onScrollToProject={scrollToProject}
        variant={variant}
      />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
        background: t.bg,
      }}>
        <QuickAdd
          theme={theme}
          projects={data.projects}
          onAdd={addTask}
          search={search}
          onSearch={setSearch}
          allCollapsed={allCollapsed}
          onToggleAll={toggleAll}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0 24px' }}>
          {projectsToShow.map(project => {
            const projectTasks = data.tasks
              .filter(t => t.project === project.id)
              .filter(t => !filterRegex || filterRegex.test(t.title) || (t.tags || []).some(tg => filterRegex.test(tg)));
            // If searching and no matches and project is empty for the search, skip
            if (filterRegex && projectTasks.length === 0) return null;
            return (
              <ProjectSection
                key={project.id}
                project={project}
                tasks={projectTasks}
                theme={theme}
                variant={variant}
                collapsed={collapsed[project.id] && !filterRegex}
                expandedTaskId={expandedTaskId}
                onToggleCollapse={toggleCollapse}
                onToggleTask={toggleTask}
                onExpandTask={(id) => setExpandedTaskId(x => x === id ? null : id)}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddTask={addTask}
                dragInfo={dragInfo}
                setDragInfo={setDragInfo}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TodoApp, TrafficLights, SyncIndicator, Sidebar, ProjectSection, QuickAdd, parseQuickAdd });
