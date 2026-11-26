import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  FileText,
  Flame,
  GraduationCap,
  Home,
  Layers,
  Menu,
  MessageSquare,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  User,
  Wrench,
  X,
} from 'lucide-react';
import { getLevelForXp, useProgressStore } from '@/lib/store/progressStore';

const NAV_MAIN = [
  { to: '/', label: 'Tổng quan', icon: Home, end: true },
  { to: '/modules', label: 'Lộ trình 10 Module', icon: BookOpen },
  { to: '/labs', label: 'Phòng thực hành (Labs)', icon: Wrench, badge: '9' },
  { to: '/cases', label: 'Case Study', icon: Briefcase, badge: '4' },
  { to: '/roleplay', label: 'Nhập vai Stakeholder', icon: MessageSquare, badge: '2' },
  { to: '/capstone', label: 'Capstone MediBook', icon: Layers, badge: '8 bước' },
];

const NAV_RESOURCES = [
  { to: '/review', label: 'Ôn tập Flashcard', icon: RotateCcw, badge: 'SM-2' },
  { to: '/glossary', label: 'Thuật ngữ Việt–Anh', icon: GraduationCap },
  { to: '/templates', label: 'Templates & Cheat sheets', icon: FileText, badge: '7' },
  { to: '/profile', label: 'Hồ sơ & Sao lưu', icon: User },
];

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const theme = useProgressStore((s) => s.theme);
  const toggleTheme = useProgressStore((s) => s.toggleTheme);
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const setLastVisitedPath = useProgressStore((s) => s.setLastVisitedPath);

  const level = getLevelForXp(xp);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setDrawerOpen(false);
    if (location.pathname.startsWith('/modules/')) {
      setLastVisitedPath(location.pathname);
    }
  }, [location.pathname, setLastVisitedPath]);

  return (
    <div className="app-shell">
      <div
        className={`sidebar-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={`sidebar ${drawerOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">US</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>User Story Craft</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Theo sách Christopher Lee
            </div>
          </div>
          <button
            type="button"
            className="icon-btn mobile-menu-btn"
            style={{ marginLeft: 'auto' }}
            aria-label="Đóng menu"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Điều hướng chính">
          <div className="nav-section-label">Học & Thực hành</div>
          {NAV_MAIN.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
            </NavLink>
          ))}

          <div className="nav-section-label">Tài nguyên & Cá nhân</div>
          {NAV_RESOURCES.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div>
            <strong>{level.name}</strong> · {xp} XP
          </div>
          <div style={{ marginTop: 4, fontSize: '0.74rem' }}>
            Bản hoàn chỉnh v1.0 · Lưu cục bộ
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-btn mobile-menu-btn"
              aria-label="Mở menu"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={18} />
            </button>
            <span className="muted" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              The Art of Crafting User Stories · Học & Thực hành
            </span>
          </div>

          <div className="topbar-right">
            <span className="stat-pill" title="Điểm kinh nghiệm">
              <Sparkles size={15} color="var(--primary)" />
              {xp} XP
            </span>
            <span className="stat-pill" title="Chuỗi ngày học liên tiếp">
              <Flame size={15} color="var(--warning)" />
              {streak} ngày
            </span>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label="Chuyển giao diện sáng/tối"
              title="Chuyển giao diện sáng/tối"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
