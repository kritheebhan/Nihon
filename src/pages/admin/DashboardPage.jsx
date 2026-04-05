import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

/* ── tiny helpers ───────────────────────────────────── */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const days  = [];
  // pad start
  for (let i = 0; i < first.getDay(); i++) {
    const d = new Date(year, month, -first.getDay() + i + 1);
    days.push({ d: d.getDate(), faded: true, date: d });
  }
  for (let i = 1; i <= last.getDate(); i++) {
    days.push({ d: i, faded: false, date: new Date(year, month, i) });
  }
  // pad end
  const rem = 7 - (days.length % 7);
  if (rem < 7) {
    for (let i = 1; i <= rem; i++) {
      days.push({ d: i, faded: true, date: new Date(year, month + 1, i) });
    }
  }
  return days;
}

/* ── Donut label ──────────────────────────────────── */
const DonutLabel = ({ viewBox, value, label }) => {
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} y={cy - 6} style={{ fontSize: 22, fontWeight: 800, fill: '#1e293b' }}>{value}</tspan>
      <tspan x={cx} y={cy + 14} style={{ fontSize: 9, fontWeight: 600, fill: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</tspan>
    </text>
  );
};

/* ── Styles object ────────────────────────────────── */
const S = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  // stat cards row
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  statCard: (bg) => ({
    background: bg,
    borderRadius: 16,
    padding: '18px 18px 16px',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 110,
  }),
  statBadge: (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: 3,
    padding: '3px 8px', borderRadius: 8,
    background: 'rgba(255,255,255,0.6)',
    fontSize: '0.58rem', fontWeight: 700, color,
    backdropFilter: 'blur(4px)',
  }),
  statValue: {
    fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', lineHeight: 1.1, margin: '10px 0 2px',
  },
  statLabel: {
    fontSize: '0.72rem', fontWeight: 600, color: '#475569',
  },
  statDots: {
    position: 'absolute', top: 14, right: 14, display: 'flex', gap: 3,
  },
  dot: {
    width: 4, height: 4, borderRadius: '50%', background: 'rgba(0,0,0,0.15)',
  },
  // cards
  card: {
    background: '#fff', borderRadius: 18, border: '1px solid #e8ecf1',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  cardHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 18px 0',
  },
  cardTitle: {
    fontSize: '0.82rem', fontWeight: 700, color: '#1e293b',
  },
  cardBody: {
    padding: '12px 18px 18px',
  },
  // calendar
  calHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 16px 10px',
  },
  calMonth: {
    fontSize: '0.82rem', fontWeight: 700, color: '#1e293b',
  },
  calArrow: {
    width: 28, height: 28, borderRadius: 8, border: '1px solid #e2e8f0',
    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#64748b', fontSize: '0.75rem',
  },
  calGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0,
    padding: '0 12px 14px', textAlign: 'center',
  },
  calDayLabel: {
    fontSize: '0.55rem', fontWeight: 700, color: '#94a3b8', padding: '4px 0',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  calDay: (isToday, faded) => ({
    fontSize: '0.7rem', fontWeight: isToday ? 700 : 500,
    color: faded ? '#cbd5e1' : isToday ? '#fff' : '#334155',
    background: isToday ? '#7c6cf6' : 'transparent',
    borderRadius: isToday ? 8 : 0,
    padding: '6px 0',
    cursor: 'default',
    lineHeight: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }),
  // agenda
  agendaItem: (color) => ({
    display: 'flex', gap: 12, alignItems: 'flex-start',
    padding: '10px 14px', borderRadius: 12,
    background: color, marginBottom: 8,
  }),
  agendaTime: {
    fontSize: '0.62rem', fontWeight: 700, color: '#64748b',
    whiteSpace: 'nowrap', paddingTop: 2,
  },
  agendaTag: {
    fontSize: '0.55rem', fontWeight: 700, color: '#6366f1',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  agendaTitle: {
    fontSize: '0.72rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3,
  },
  // filters row
  filterPill: (active) => ({
    padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0',
    background: active ? '#f1f5f9' : '#fff', fontSize: '0.62rem',
    fontWeight: 600, color: '#475569', cursor: 'pointer',
    fontFamily: 'inherit',
  }),
  // recent table
  tableWrap: {
    overflowX: 'auto',
  },
  th: {
    textAlign: 'left', padding: '10px 16px', fontSize: '0.6rem',
    fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.08em', borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '12px 16px', fontSize: '0.78rem', color: '#334155',
    borderBottom: '1px solid #f8fafc',
  },
};

/* ── Custom tooltip ─────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
      padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>{payload[0].value}</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear]   = useState(now.getFullYear());
  const [chartPeriod, setChartPeriod] = useState('weekly');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setUsers(data);
      setLoading(false);
    })();
  }, []);

  const total    = users.length;
  const admins   = users.filter(u => u.role === 'admin').length;
  const regular  = users.filter(u => u.role !== 'admin').length;
  const today    = new Date().toDateString();
  const newToday = users.filter(u => u.created_at && new Date(u.created_at).toDateString() === today).length;
  const recent   = users.slice(0, 5);

  /* chart data */
  const regByDate = users.reduce((acc, u) => {
    const d = new Date(u.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' });
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(regByDate).slice(0, 7).reverse()
    .map(([date, count]) => ({ date, Users: count }));
  if (chartData.length === 0) chartData.push({ date: 'Today', Users: 0 });

  const BAR_COLORS = ['#fbbf24', '#a78bfa', '#34d399', '#60a5fa', '#f472b6', '#fb923c', '#38bdf8'];

  /* donut data */
  const donutData = [
    { name: 'Regular', value: regular, fill: '#fbbf24' },
    { name: 'Admins',  value: admins,  fill: '#a78bfa' },
  ];

  /* calendar */
  const calDays = useMemo(() => getCalendarDays(calYear, calMonth), [calYear, calMonth]);
  const todayStr = now.toDateString();

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  /* agenda (contextual for a study app admin) */
  const AGENDA = [
    { time: 'Today', tag: 'System', title: 'Review new user signups', color: '#eef2ff' },
    { time: 'Tomorrow', tag: 'Content', title: 'Add N2 Vocabulary batch', color: '#fef3c7' },
    { time: 'Apr 8', tag: 'Maintenance', title: 'Database backup & cleanup', color: '#fce7f3' },
  ];

  /* stat cards config */
  const STATS = [
    { label: 'Total Users',   value: total,    bg: '#fef9c3', badge: '+' + newToday + ' today', badgeColor: '#854d0e', up: true  },
    { label: 'Regular Users', value: regular,  bg: '#fce7f3', badge: Math.round((regular/Math.max(total,1))*100) + '%', badgeColor: '#9d174d', up: true  },
    { label: 'Admin Users',   value: admins,   bg: '#d1fae5', badge: admins > 0 ? 'Active' : '—', badgeColor: '#065f46', up: false },
    { label: 'New Today',     value: newToday, bg: '#e0e7ff', badge: newToday > 0 ? '↑ New' : '0 new', badgeColor: '#3730a3', up: newToday > 0 },
  ];

  const isOnline = (dateString) => {
    if (!dateString) return false;
    return (Date.now() - new Date(dateString).getTime()) / 60000 < 15;
  };

  return (
    <div>
      {/* style tag for responsive */}
      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .dash-stats-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .dash-stats-row { grid-template-columns: 1fr !important; }
        }
        .dash-stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .dash-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
        .dash-card-anim { animation: dashFadeUp 0.4s ease both; }
        @keyframes dashFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-d1 { animation-delay: 0.05s; }
        .dash-d2 { animation-delay: 0.12s; }
        .dash-d3 { animation-delay: 0.19s; }
        .dash-d4 { animation-delay: 0.26s; }
        .dash-d5 { animation-delay: 0.33s; }
        .dash-table-row:hover td { background: #f8fafc; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 22 }} className="dash-card-anim dash-d1">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Overview</h2>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
          Welcome back! Here's what's happening with your study platform.
        </p>
      </div>

      {/* ── Stats Cards ── */}
      <div style={S.statsRow} className="dash-stats-row dash-card-anim dash-d1">
        {STATS.map((s, i) => (
          <div key={i} style={S.statCard(s.bg)} className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={S.statBadge(s.badgeColor)}>
                {s.up && <span style={{ fontSize: '0.55rem' }}>▲</span>}
                {s.badge}
              </span>
              <div style={S.statDots}>
                <span style={S.dot} /><span style={S.dot} /><span style={S.dot} />
              </div>
            </div>
            <div style={S.statValue}>{loading ? '—' : s.value.toLocaleString()}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main two-column grid ── */}
      <div style={{ ...S.grid, marginTop: 20 }} className="dash-grid">

        {/* ═══ LEFT COLUMN ═══ */}
        <div style={S.leftCol}>

          {/* Users donut + Registration bar side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 16 }}>

            {/* Donut chart */}
            <div style={S.card} className="dash-card-anim dash-d2">
              <div style={S.cardHead}>
                <span style={S.cardTitle}>Users</span>
                <div style={S.statDots}><span style={S.dot} /><span style={S.dot} /><span style={S.dot} /></div>
              </div>
              <div style={{ ...S.cardBody, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 150, height: 150 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%" cy="50%"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {donutData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      {/* center label */}
                      <Pie
                        data={[{ value: 1 }]}
                        cx="50%" cy="50%"
                        innerRadius={0} outerRadius={0}
                        dataKey="value"
                      >
                        <Cell fill="transparent" />
                        <DonutLabel viewBox={{ cx: 75, cy: 75 }} value={total} label="TOTAL" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* legend */}
                <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                  {donutData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.fill }} />
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#64748b' }}>{d.name}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1e293b' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar chart — Registrations */}
            <div style={S.card} className="dash-card-anim dash-d3">
              <div style={S.cardHead}>
                <span style={S.cardTitle}>Registrations</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['weekly', 'monthly'].map(p => (
                    <button key={p} onClick={() => setChartPeriod(p)} style={S.filterPill(chartPeriod === p)}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ ...S.cardBody, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="Users" radius={[6, 6, 0, 0]} barSize={28}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Users table */}
          <div style={S.card} className="dash-card-anim dash-d4">
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Recent Users</span>
              <button style={{ ...S.filterPill(false), color: '#6366f1', borderColor: '#c7d2fe' }}>View All →</button>
            </div>
            <div style={{ ...S.cardBody, padding: '0 0 6px' }}>
              {loading ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>Loading...</div>
              ) : (
                <div style={S.tableWrap}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={S.th}>User</th>
                        <th style={S.th}>Status</th>
                        <th style={S.th}>Role</th>
                        <th style={S.th}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.length === 0 && (
                        <tr><td colSpan={4} style={{ ...S.td, textAlign: 'center', color: '#94a3b8' }}>No users</td></tr>
                      )}
                      {recent.map((u, i) => {
                        const online = isOnline(u.updated_at || u.created_at);
                        return (
                          <tr key={i} className="dash-table-row" style={{ cursor: 'default' }}>
                            <td style={S.td}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ position: 'relative' }}>
                                  <div style={{
                                    width: 32, height: 32, borderRadius: 10,
                                    background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                                  }}>
                                    {u.name?.[0]?.toUpperCase() || '?'}
                                  </div>
                                  <span style={{
                                    position: 'absolute', bottom: -2, right: -2,
                                    width: 10, height: 10, borderRadius: '50%',
                                    border: '2px solid #fff',
                                    background: online ? '#22c55e' : '#cbd5e1',
                                  }} />
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1e293b' }}>{u.name || 'Anonymous'}</div>
                                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 500 }}>{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={S.td}>
                              <span style={{
                                fontSize: '0.62rem', fontWeight: 700,
                                color: online ? '#16a34a' : '#94a3b8',
                              }}>
                                {online ? '● Online' : '○ Offline'}
                              </span>
                            </td>
                            <td style={S.td}>
                              <span style={{
                                padding: '3px 10px', borderRadius: 8, fontSize: '0.6rem', fontWeight: 700,
                                background: u.role === 'admin' ? '#fee2e2' : '#dbeafe',
                                color: u.role === 'admin' ? '#dc2626' : '#2563eb',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                              }}>
                                {u.role || 'user'}
                              </span>
                            </td>
                            <td style={{ ...S.td, fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
                              {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ═══ RIGHT COLUMN (sidebar) ═══ */}
        <div style={S.rightCol}>

          {/* Calendar widget */}
          <div style={S.card} className="dash-card-anim dash-d2">
            <div style={S.calHeader}>
              <button style={S.calArrow} onClick={prevMonth}>◂</button>
              <span style={S.calMonth}>{MONTHS[calMonth]} {calYear}</span>
              <button style={S.calArrow} onClick={nextMonth}>▸</button>
            </div>
            <div style={S.calGrid}>
              {DAYS.map(d => <span key={d} style={S.calDayLabel}>{d}</span>)}
              {calDays.map((day, i) => {
                const isToday = day.date.toDateString() === todayStr && !day.faded;
                return <span key={i} style={S.calDay(isToday, day.faded)}>{day.d}</span>;
              })}
            </div>
          </div>

          {/* Agenda */}
          <div style={S.card} className="dash-card-anim dash-d3">
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Agenda</span>
              <div style={S.statDots}><span style={S.dot} /><span style={S.dot} /><span style={S.dot} /></div>
            </div>
            <div style={S.cardBody}>
              {AGENDA.map((item, i) => (
                <div key={i} style={S.agendaItem(item.color)}>
                  <span style={S.agendaTime}>{item.time}</span>
                  <div>
                    <div style={S.agendaTag}>{item.tag}</div>
                    <div style={S.agendaTitle}>{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={S.card} className="dash-card-anim dash-d4">
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Quick Actions</span>
            </div>
            <div style={{ ...S.cardBody, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '👥', label: 'Manage Users',  color: '#eef2ff' },
                { icon: '📚', label: 'Edit Content',  color: '#fef3c7' },
                { icon: '🔑', label: 'API Keys',      color: '#fce7f3' },
                { icon: '📊', label: 'View Analytics', color: '#d1fae5' },
              ].map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 12, background: a.color,
                  cursor: 'pointer', transition: 'transform 0.15s ease',
                }}>
                  <span style={{ fontSize: '1rem' }}>{a.icon}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>{a.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#94a3b8' }}>→</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
