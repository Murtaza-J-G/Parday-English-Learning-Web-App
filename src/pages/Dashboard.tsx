import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Play,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Card, PageHeader, ProgressBar, StatCard, Button } from "../components";
import { useAppStore } from "../store";
import { isDue } from "../utils";

export default function Dashboard() {
  const { words, categories, sessions, settings } = useAppStore();
  const due = words.filter((w) => isDue(w));
  const learned = words.filter((w) => w.correctCount > 0).length;
  const totalReviews = words.reduce(
    (n, w) => n + w.correctCount + w.incorrectCount,
    0,
  );
  const correct = words.reduce((n, w) => n + w.correctCount, 0);
  const goalCount = sessions
    .filter(
      (s) => s.date.slice(0, 10) === new Date().toISOString().slice(0, 10),
    )
    .reduce((n, s) => n + s.wordsReviewed, 0);
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const key = d.toISOString().slice(0, 10);
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      words: sessions
        .filter((s) => s.date.slice(0, 10) === key)
        .reduce((n, s) => n + s.wordsReviewed, 0),
    };
  });
  const greeting =
    new Date().getHours() < 12
      ? "Good Afternoon"
      : new Date().getHours() < 18
        ? "Good morning"
        : "Good evening";
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="MONDAY, YOUR LEARNING SPACE"
        title={`${greeting}, Dear User 👋`}
        description="A little progress each day adds up to big results."
        action={
          <Button
            onClick={() => (window.location.href = "/learn")}
            icon={<Play size={16} fill="currentColor" />}
          >
            Start learning
          </Button>
        }
      />
      <div className="hero-banner">
        <div className="hero-copy">
          <div className="hero-kicker">
            <Sparkles size={14} /> YOUR DAILY MOMENT
          </div>
          <h2>
            Make today
            <br />a <span>word better.</span>
          </h2>
          <p>Build a stronger vocabulary, one thoughtful review at a time.</p>
          <div className="hero-actions">
            <Link className="btn btn-white" to="/learn">
              Learn new words <ArrowRight size={16} />
            </Link>
            <Link className="hero-text-link" to="/review">
              {due.length} words ready to review <ChevronRight size={15} />
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="float-word float-a">
            curious <span>/ˈkjʊriəs/</span>
          </div>
          <div className="float-word float-b">✨</div>
          <div className="hero-book">
            <BookOpen size={52} />
          </div>
          <div className="float-word float-c">
            growth <span>noun</span>
          </div>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard
          label="Words in library"
          value={words.length}
          caption="Your growing collection"
          icon={<BookOpen size={19} />}
          tint="violet"
        />
        <StatCard
          label="Ready to review"
          value={due.length}
          caption={
            due.length ? "Keep your memory fresh" : "All caught up for now"
          }
          icon={<Brain size={19} />}
          tint="blue"
        />
        <StatCard
          label="Words practiced"
          value={learned}
          caption="Words you've reviewed"
          icon={<Check size={19} />}
          tint="green"
        />
        <StatCard
          label="Learning accuracy"
          value={`${totalReviews ? Math.round((correct / totalReviews) * 100) : 0}%`}
          caption="Based on your answers"
          icon={<Target size={19} />}
          tint="amber"
        />
      </div>
      <div className="dashboard-grid">
        <Card className="activity-card">
          <div className="card-heading">
            <div>
              <h3>Your activity</h3>
              <p>Words reviewed over the last 7 days</p>
            </div>
            <span className="subtle-pill">
              <Activity size={14} /> This week
            </span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={27}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 4"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: "var(--surface-soft)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                  }}
                />
                <Bar
                  dataKey="words"
                  name="Words reviewed"
                  fill="#6d62e8"
                  radius={[7, 7, 3, 3]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-foot">
            <span>
              <span className="legend-dot" /> Words reviewed
            </span>
            <strong>
              {chartData.reduce((n, d) => n + d.words, 0)}{" "}
              <small>total this week</small>
            </strong>
          </div>
        </Card>
        <Card className="goal-card">
          <div className="card-heading">
            <div>
              <h3>Daily goal</h3>
              <p>Consistency is your superpower</p>
            </div>
            <div className="goal-icon">
              <Target size={20} />
            </div>
          </div>
          <div className="goal-number">
            {goalCount}
            <span> / {settings.dailyGoal} words</span>
          </div>
          <ProgressBar value={(goalCount / settings.dailyGoal) * 100} />
          <div className="goal-footer">
            <span>
              {goalCount >= settings.dailyGoal ? (
                <>
                  <Check size={14} /> Goal complete — well done!
                </>
              ) : (
                `${Math.max(0, settings.dailyGoal - goalCount)} more to reach your goal`
              )}
            </span>
            <span>
              {Math.min(
                100,
                Math.round((goalCount / settings.dailyGoal) * 100),
              )}
              %
            </span>
          </div>
          <div className="goal-tip">
            <Zap size={16} />
            <span>
              <strong>Little and often.</strong> A short session today helps
              build a lasting habit.
            </span>
          </div>
          <Link to="/settings" className="subtle-link">
            Adjust daily goal <ArrowUpRight size={14} />
          </Link>
        </Card>
      </div>
      <div className="lower-grid">
        <Card>
          <div className="card-heading">
            <div>
              <h3>Explore collections</h3>
              <p>Choose a topic that interests you</p>
            </div>
            <Link className="text-link" to="/categories">
              All collections <ArrowRight size={14} />
            </Link>
          </div>
          <div className="collection-list">
            {categories.slice(0, 4).map((c) => {
              const count = words.filter((w) => w.categoryId === c.id).length;
              const done = words.filter(
                (w) => w.categoryId === c.id && w.correctCount > 0,
              ).length;
              return (
                <Link
                  to={`/categories/${c.id}`}
                  className="collection-item"
                  key={c.id}
                >
                  <div className={`collection-icon ${c.color}`}>{c.icon}</div>
                  <div className="collection-info">
                    <strong>{c.name}</strong>
                    <span>
                      {count} words · {done} practiced
                    </span>
                    <ProgressBar
                      value={count ? (done / count) * 100 : 0}
                      color={c.color}
                    />
                  </div>
                  <ChevronRight size={17} />
                </Link>
              );
            })}
          </div>
        </Card>
        <Card>
          <div className="card-heading">
            <div>
              <h3>Keep your momentum</h3>
              <p>Your next best steps</p>
            </div>
            <div className="sparkle-icon">
              <Sparkles size={19} />
            </div>
          </div>
          <div className="recommendations">
            <Link to="/review" className="recommendation">
              <div className="recommendation-icon blue">
                <Brain size={18} />
              </div>
              <div>
                <strong>Review due words</strong>
                <span>
                  {due.length
                    ? `${due.length} words are ready for review`
                    : "Your review queue is clear"}
                </span>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/quiz" className="recommendation">
              <div className="recommendation-icon amber">
                <Zap size={18} />
              </div>
              <div>
                <strong>Take a quick quiz</strong>
                <span>Check what you've remembered</span>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/vocabulary" className="recommendation">
              <div className="recommendation-icon green">
                <Plus size={18} />
              </div>
              <div>
                <strong>Add a new word</strong>
                <span>Save something you learned today</span>
              </div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
