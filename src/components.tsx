import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Award,
  BookOpen,
  Bookmark,
  Brain,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Target,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useAppStore } from "./store";
import type { VocabularyWord } from "./types";
import { speak } from "./utils";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/learn", label: "Learn new words", icon: BookOpen },
  { to: "/review", label: "Due for review", icon: Brain },
  { to: "/flashcards", label: "Flashcards", icon: Bookmark },
  { to: "/quiz", label: "Quick quiz", icon: CircleHelp },
  { to: "/vocabulary", label: "My vocabulary", icon: GraduationCap },
  { to: "/categories", label: "Collections", icon: Compass },
  { to: "/progress", label: "Progress", icon: ChartNoAxesColumnIncreasing },
  { to: "/achievements", label: "Achievements", icon: Award },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { settings, setSettings, words } = useAppStore();
  const due = words.filter(
    (w) => new Date(w.nextReviewAt) <= new Date(),
  ).length;
  const location = useLocation();
  return (
    <div className={`app-shell ${settings.theme === "dark" ? "dark" : ""}`}>
      <aside
        className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      >
        <div className="brand">
          <div className="brand-mark">
            <Command size={21} />
          </div>
          {!collapsed && (
            <div>
              <b>Parday</b>
              <span>YOUR LEARNING SPACE</span>
            </div>
          )}
          <button
            className="icon-btn sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            {/* <X size={18} /> */}
          </button>
        </div>
        {/* {!collapsed && (
          <div className="workspace">
            <div className="avatar">M</div>
            <div>
              <strong>My English</strong>
              <small>Personal workspace</small>
            </div>
            <ChevronRight size={15} />
          </div>
        )} */}
        <div className="nav-caption">{!collapsed && "LEARN"}</div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.to === "/review" && due > 0 && <em>{due}</em>}
            </NavLink>
          ))}
        </nav>
        {/* {!collapsed && (
          <div className="sidebar-bottom">
            <div className="upgrade-icon">
              <Sparkles size={18} />
            </div>
            <strong>Small steps, big progress.</strong>
            <p>A few minutes a day can grow your vocabulary.</p>
            <div className="sidebar-progress">
              <span
                style={{
                  width: `${Math.min(100, (words.filter((w) => w.correctCount > 0).length / Math.max(1, useAppStore.getState().settings.dailyGoal)) * 100)}%`,
                }}
              />
            </div>
            <small>
              {words.filter((w) => w.correctCount > 0).length} words practiced
            </small>
          </div>
        )} */}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeftClose size={17} />
          {!collapsed && "Collapse sidebar"}
        </button>
      </aside>
      {mobileOpen && (
        <div className="mobile-scrim" onClick={() => setMobileOpen(false)} />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              {navItems.find((n) => n.to === location.pathname)?.label ||
                "Collection"}
            </strong>
          </div>
          <div className="top-actions">
            <label className="top-search">
              <Search size={16} />
              <input
                placeholder="Search anything..."
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    window.location.href = `/vocabulary?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                }}
              />
              <kbd>⌘ K</kbd>
            </label>
            <button
              className="icon-btn theme-toggle"
              onClick={() =>
                setSettings({
                  theme: settings.theme === "dark" ? "light" : "dark",
                })
              }
              aria-label="Toggle theme"
            >
              {settings.theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
            <div className="top-avatar">M</div>
          </div>
        </header>
        <div className="page-content">{children}</div>
        <footer className="footer">
          <span>Made for curious minds.</span>
          <p>
        © {new Date().getFullYear()} Murtaza Hakimi.
        All rights reserved.
      </p>
          <span>
            <span className="status-dot" /> Your progress is saved on this
            device
          </span>
        </footer>
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="header-action">{action}</div>}
    </div>
  );
}
export function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} className={`btn btn-${variant}`}>
      {icon}
      {children}
    </button>
  );
}
export function StatCard({
  label,
  value,
  caption,
  icon,
  tint = "violet",
}: {
  label: string;
  value: string | number;
  caption: string;
  icon: ReactNode;
  tint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className="stat-top">
        <span>{label}</span>
        <div className={`stat-icon ${tint}`}>{icon}</div>
      </div>
      <strong>{value}</strong>
      <small>{caption}</small>
    </motion.div>
  );
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`}>{children}</section>;
}
export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon || <BookOpen />}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function WordRow({
  word,
  onEdit,
  onDelete,
}: {
  word: VocabularyWord;
  onEdit?: (w: VocabularyWord) => void;
  onDelete?: (w: VocabularyWord) => void;
}) {
  const cat = useAppStore((s) =>
    s.categories.find((c) => c.id === word.categoryId),
  );
  const updateWord = useAppStore((s) => s.updateWord);
  return (
    <div className="word-row">
      <div className="word-letter">{word.word.charAt(0).toUpperCase()}</div>
      <div className="word-main">
        <div className="word-title">
          {word.word}
          <span className="phonetic">{word.phonetic}</span>
          {word.isSample && <span className="sample-pill">Sample</span>}
        </div>
        <p>{word.definition}</p>
      </div>
      <div className="word-translation">{word.translation}</div>
      <div className="word-category">
        <span className={`category-dot ${cat?.color || "violet"}`} />
        {cat?.name || "General"}
      </div>
      <div className="word-level">{word.difficulty}</div>
      <div className="word-actions">
        <button
          className="icon-btn"
          onClick={() => speak(word.word)}
          aria-label={`Pronounce ${word.word}`}
        >
          <Volume2 size={16} />
        </button>
        <button
          className={`icon-btn ${word.favorite ? "favorited" : ""}`}
          onClick={() => updateWord(word.id, { favorite: !word.favorite })}
          aria-label="Toggle favorite"
        >
          <Bookmark size={16} />
        </button>
        {onEdit && (
          <button
            className="icon-btn"
            onClick={() => onEdit(word)}
            aria-label="Edit word"
          >
            ✎
          </button>
        )}
        {onDelete && (
          <button
            className="icon-btn"
            onClick={() => onDelete(word)}
            aria-label="Delete word"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
export function ProgressBar({
  value,
  color = "violet",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div className="progress-track">
      <span
        className={color}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
export function MiniBadge({ children }: { children: ReactNode }) {
  return <span className="mini-badge">{children}</span>;
}
export { Activity, ChevronLeft, ChevronRight, Plus, Target, Zap };
