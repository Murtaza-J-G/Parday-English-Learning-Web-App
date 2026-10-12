import {
  lazy,
  Suspense,
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Learn = lazy(() => import("./pages/Learn"));
const Vocabulary = lazy(() => import("./pages/Vocabulary"));
const Categories = lazy(() => import("./pages/Categories"));
const CategoryDetail = lazy(() => import("./pages/CategoryDetail"));
const Progress = lazy(() => import("./pages/Progress"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Settings = lazy(() => import("./pages/Settings"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Flashcards = lazy(() => import("./pages/Flashcards"));

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application rendering error:", error, info);
  }
  render() {
    if (this.state.hasError)
      return (
        <div className="error-screen">
          <h1>Something went wrong</h1>
          <p>
            Your saved vocabulary is still stored locally. Try refreshing the
            page.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload application
          </button>
        </div>
      );
    return this.props.children;
  }
}
function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-mark">V</div>
      <span>Preparing your learning space…</span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<Learn mode="learn" />} />
            <Route path="/review" element={<Learn mode="review" />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}
