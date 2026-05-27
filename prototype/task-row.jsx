// todo-app.jsx — The interactive prototype
// Components: TodoApp (root), Sidebar, ProjectSection, TaskRow,
//             QuickAdd, SearchBar, SyncIndicator
// Three layout variants share state: 'list' | 'compact' | 'cards'

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ── Date helpers ──────────────────────────────────────────────
const DAY = 86400000;
function fmtDue(ms) {
  if (!ms) return '';
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(ms); d.setHours(0,0,0,0);
  const diff = Math.round((d - today) / DAY);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff <= 6) return d.toLocaleDateString(undefined, { weekday: 'short' });
  if (diff < -1 && diff >= -6) return `${-diff}d late`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function fmtDueCompact(ms) {
  if (!ms) return '';
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(ms); d.setHours(0,0,0,0);
  const diff = Math.round((d - today) / DAY);
  if (diff === 0) return 'today';
  if (diff > 0) return `${diff}d`;
  return `${-diff}d!`;
}
function fmtCreated(ms) {
  const diff = Math.round((Date.now() - ms) / DAY);
  if (diff === 0) return 'today';
  if (diff === 1) return 'yesterday';
  return `${diff}d ago`;
}
function fmtEstimate(min) {
  if (!min) return '';
  if (min < 60) return `${min}m`;
  const h = Math.floor(min/60), m = min%60;
  return m ? `${h}h${m}m` : `${h}h`;
}

// ── Priority pill ─────────────────────────────────────────────
function PriorityPill({ priority, theme, dense }) {
  const p = theme.priority[priority];
  if (!p) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: dense ? '0 4px' : '1px 6px',
      fontSize: dense ? 9 : 10, fontWeight: 600, fontFamily: theme.tokens.monoFont,
      lineHeight: dense ? '14px' : '16px',
      borderRadius: 4, background: p.bg, color: p.fg,
      letterSpacing: '.02em',
    }}>{p.label}</span>
  );
}

// ── Due pill (heat-colored) ──────────────────────────────────
function DuePill({ due, theme, dense, pulse }) {
  if (!due) return null;
  const bucket = heatBucket(due);
  const h = theme.heat[bucket];
  const label = dense ? fmtDueCompact(due) : fmtDue(due);
  const isHot = bucket === 'overdue' || bucket === 'today';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: dense ? '0 4px' : '1px 6px',
      fontSize: dense ? 9 : 10.5, fontWeight: 600,
      lineHeight: dense ? '14px' : '16px',
      fontFamily: theme.tokens.monoFont,
      borderRadius: 4,
      background: h.bg, color: h.fg,
      animation: (pulse && bucket === 'overdue') ? 'todoPulse 1.6s ease-in-out infinite' : 'none',
    }}>
      {isHot && <Icon name="flame" size={dense?9:11} />}
      {label}
    </span>
  );
}

// ── Tag chip ──────────────────────────────────────────────────
function TagChip({ tag, theme, dense }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: dense ? '0 4px' : '0 6px',
      fontSize: dense ? 9 : 10.5,
      lineHeight: dense ? '14px' : '16px',
      borderRadius: 3,
      background: theme.tokens.surface2,
      color: theme.tokens.textMuted,
      fontFamily: theme.tokens.monoFont,
    }}>#{tag}</span>
  );
}

// ── Custom checkbox ──────────────────────────────────────────
function TaskCheck({ done, priority, theme, dense, onToggle }) {
  const size = dense ? 14 : 17;
  const p = theme.priority[priority] || {};
  const ringColor = done ? theme.tokens.accent : (p.fg || theme.tokens.borderStrong);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={done ? 'Mark incomplete' : 'Mark complete'}
      style={{
        width: size, height: size, borderRadius: '50%',
        border: `1.5px solid ${ringColor}`,
        background: done ? theme.tokens.accent : 'transparent',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0, flexShrink: 0,
        transition: 'all .15s ease', color: theme.tokens.accentText,
      }}
    >
      {done && <Icon name="check" size={size - 6} />}
    </button>
  );
}

// ── Heat stripe (left edge accent) ───────────────────────────
function HeatStripe({ due, theme, height }) {
  if (!due) return null;
  const bucket = heatBucket(due);
  const h = theme.heat[bucket];
  if (h.stripe === 'transparent') return null;
  const pulse = bucket === 'overdue';
  return (
    <span style={{
      position: 'absolute', left: 0, top: 4, bottom: 4, width: 3,
      borderRadius: '0 2px 2px 0', background: h.stripe,
      animation: pulse ? 'todoStripePulse 1.6s ease-in-out infinite' : 'none',
    }} />
  );
}

// ── TaskRow — main interactive row ───────────────────────────
function TaskRow({
  task, project, theme, variant, expanded,
  onToggle, onExpand, onUpdate, onDelete, onDragStart, onDragOver, onDrop, onDragEnd, isDragging, dragOverPos,
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  useEffect(() => { setTitleDraft(task.title); }, [task.title]);

  const dense = variant === 'compact';
  const isCards = variant === 'cards';
  const t = theme.tokens;

  const overdue = heatBucket(task.due) === 'overdue';
  const sub = task.subtasks || [];
  const subDone = sub.filter(s => s.done).length;

  const containerStyle = isCards ? {
    position: 'relative', borderRadius: 10,
    background: t.surface,
    border: `1px solid ${task.done ? t.border : t.border}`,
    padding: '10px 12px 10px 16px',
    marginBottom: 6,
    boxShadow: t.shadow,
    opacity: isDragging ? 0.4 : (task.done ? 0.6 : 1),
    transition: 'opacity .15s, transform .15s',
    cursor: 'pointer',
  } : {
    position: 'relative',
    padding: dense ? '4px 10px 4px 14px' : '7px 10px 7px 16px',
    borderBottom: `1px solid ${t.border}`,
    background: 'transparent',
    opacity: isDragging ? 0.4 : (task.done ? 0.55 : 1),
    transition: 'opacity .15s, background .12s',
    cursor: 'pointer',
  };

  // ── drag handlers — attach to row, drag identified by task id
  const dragProps = {
    draggable: !editingTitle,
    onDragStart: (e) => onDragStart(e, task.id),
    onDragOver: (e) => onDragOver(e, task.id),
    onDrop: (e) => onDrop(e, task.id),
    onDragEnd,
  };

  // Drop indicator line
  const dropIndicator = dragOverPos && (
    <span style={{
      position: 'absolute', left: 16, right: 12, height: 2,
      background: t.accent, borderRadius: 1, pointerEvents: 'none',
      top: dragOverPos === 'before' ? -1 : 'auto',
      bottom: dragOverPos === 'after' ? -1 : 'auto',
    }} />
  );

  // Title
  const titleEl = editingTitle ? (
    <input
      autoFocus
      value={titleDraft}
      onChange={(e) => setTitleDraft(e.target.value)}
      onBlur={() => { onUpdate({ title: titleDraft.trim() || task.title }); setEditingTitle(false); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.target.blur(); }
        if (e.key === 'Escape') { setTitleDraft(task.title); setEditingTitle(false); }
      }}
      style={{
        background: 'transparent', border: 0, outline: 0, color: t.text,
        font: 'inherit', flex: 1, padding: 0, minWidth: 0,
      }}
      onClick={(e) => e.stopPropagation()}
    />
  ) : (
    <span style={{
      flex: 1, minWidth: 0,
      textDecoration: task.done ? 'line-through' : 'none',
      textDecorationColor: t.textMuted,
      color: task.done ? t.textMuted : t.text,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      transition: 'color .2s, text-decoration-color .2s',
    }}>{task.title}</span>
  );

  return (
    <div
      {...dragProps}
      onClick={() => onExpand(task.id)}
      onMouseEnter={(e) => { if (!isCards) e.currentTarget.style.background = t.surface2; }}
      onMouseLeave={(e) => { if (!isCards) e.currentTarget.style.background = 'transparent'; }}
      style={containerStyle}
    >
      <HeatStripe due={task.due} theme={theme} />
      {dropIndicator}

      {/* main row */}
      <div style={{
        display: 'flex', alignItems: isCards ? 'flex-start' : 'center',
        gap: dense ? 8 : 10, minWidth: 0,
      }}>
        <TaskCheck done={task.done} priority={task.priority} theme={theme} dense={dense}
          onToggle={() => onToggle(task.id)} />

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* title row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, minWidth: 0,
            fontSize: dense ? 12.5 : 13.5, fontWeight: 500,
          }}
          onDoubleClick={(e) => { e.stopPropagation(); setEditingTitle(true); }}>
            {titleEl}
            {sub.length > 0 && !isCards && (
              <span style={{
                fontSize: 10, color: t.textDim, fontFamily: t.monoFont, flexShrink: 0,
              }}>{subDone}/{sub.length}</span>
            )}
          </div>

          {/* meta row (cards or list variant) */}
          {(isCards || !dense) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
              color: t.textMuted, fontSize: 11,
            }}>
              <PriorityPill priority={task.priority} theme={theme} dense={dense} />
              <DuePill due={task.due} theme={theme} dense={dense} pulse />
              {task.estimate ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 2,
                  fontSize: 10.5, color: t.textMuted, fontFamily: t.monoFont,
                }}>
                  <Icon name="clock" size={10} />{fmtEstimate(task.estimate)}
                </span>
              ) : null}
              {(task.tags || []).map(tag => <TagChip key={tag} tag={tag} theme={theme} dense={dense} />)}
              {sub.length > 0 && isCards && (
                <span style={{
                  fontSize: 10.5, color: t.textMuted, fontFamily: t.monoFont,
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                }}>
                  <Icon name="check" size={10} />{subDone}/{sub.length}
                </span>
              )}
              <span style={{ flex: 1 }} />
              <span style={{
                fontSize: 10, color: t.textDim, fontFamily: t.monoFont,
              }}>{fmtCreated(task.created)}</span>
            </div>
          )}

          {/* compact meta row */}
          {dense && !isCards && (
            <div style={{ display: 'none' }} />
          )}
        </div>

        {/* trailing meta for compact */}
        {dense && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            fontSize: 10, fontFamily: t.monoFont,
          }}>
            {task.tags && task.tags[0] && (
              <span style={{ color: t.textDim }}>#{task.tags[0]}{task.tags.length > 1 ? `+${task.tags.length-1}` : ''}</span>
            )}
            <PriorityPill priority={task.priority} theme={theme} dense />
            <DuePill due={task.due} theme={theme} dense pulse />
          </div>
        )}
      </div>

      {/* expanded detail */}
      {expanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: 8, paddingTop: 8, paddingLeft: dense ? 22 : 27,
            borderTop: `1px dashed ${t.border}`,
            display: 'flex', flexDirection: 'column', gap: 8,
            fontSize: 12, color: t.text,
          }}>
          {task.notes && (
            <div style={{ color: t.textMuted, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {task.notes}
            </div>
          )}
          {sub.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sub.map(s => (
                <div key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ subtasks: sub.map(x => x.id === s.id ? { ...x, done: !x.done } : x) });
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: 3,
                    border: `1.5px solid ${s.done ? t.accent : t.borderStrong}`,
                    background: s.done ? t.accent : 'transparent',
                    color: t.accentText,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {s.done && <Icon name="check" size={8} />}
                  </span>
                  <span style={{
                    textDecoration: s.done ? 'line-through' : 'none',
                    color: s.done ? t.textDim : t.text,
                  }}>{s.title}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 4, color: t.textDim, fontSize: 10.5, fontFamily: t.monoFont }}>
            <span>created {fmtCreated(task.created)}</span>
            <span>·</span>
            <span>P{task.priority.slice(1)}</span>
            {task.estimate && (<><span>·</span><span>{fmtEstimate(task.estimate)}</span></>)}
            <span style={{ flex: 1 }} />
            <button onClick={() => onDelete(task.id)} title="Delete"
              style={{ background:'none', border:0, color:t.textDim, cursor:'pointer', padding: 2 }}>
              <Icon name="trash" size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TaskRow, DAY, fmtDue, fmtDueCompact, fmtCreated, fmtEstimate, PriorityPill, DuePill, TagChip, TaskCheck, HeatStripe });
