import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CategoryQuestionsPage from "./pages/CategoryQuestionsPage";
import LoginPage from "./pages/LoginPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import ProfilePage from "./pages/ProfilePage"; // Adjust path if needed
import EditProfilePage from "./pages/EditProfilePage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import TickerForm from "./pages/TickerForm";
import LeaderboardPage from "./pages/LeaderboardPage";
import PredictionInsightPage from "./pages/PredictionInsightPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateQuestion from "./pages/AdminCreateQuestion";
import AdminSetOutcome from "./pages/AdminSetOutcome";
import AdminUpdateTicker from "./pages/AdminUpdateTicker";
import DeleteQuestionPage from "./pages/DeleteQuestionPage";
import UnsetOutcomePage from "./pages/UnsetOutcomePage";
import DeleteTickerPage from "./pages/DeleteTickerPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";
import DeleteCategoryPage from "./pages/DeleteCategoryPage";
import AdminCreateArticlePage from "./pages/AdminCreateArticlePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import RelatedArticlesPage from "./pages/RelatedArticlesPage";
import EditQuestionForm from "./pages/EditQuestionForm";
import EditQuestionList from "./pages/EditQuestionList";
import CategoryListPage from "./pages/CategoryListPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import CreateRichArticlePage from './pages/CreateRichArticlePage';
import OurAnalysisPage from "./pages/OurAnalysisPage";
import AdminArticlesManage from "./pages/AdminArticleManage";
// Add these imports with your other imports
import EditArticlePage from './pages/EditArticlePage';
import BulkDeleteArticles from './pages/BulkDeleteArticles';
import LeadersPage from "./pages/LeadersPage";
import LeaderTimelinePage from "./pages/LeaderTimelinePage";
import DeleteLeaderPage from "./pages/DeleteLeaderPage";
import CreateLeaderPage from "./pages/CreateLeaderPage";
import EditLeaderPage from "./pages/EditLeaderPage";
import TimelineKeywordSearchPage from "./pages/TimelineKeywordSearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/categories/:categorySlug" element={<CategoryQuestionsPage />} />
        <Route path="/questions/create" element={<CreateQuestionPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
        <Route path="/admin/ticker" element={<TickerForm />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/questions/:questionId/insight" element={<PredictionInsightPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/questions/create" element={<AdminCreateQuestion />} />
        <Route path="/admin/questions/resolve" element={<AdminSetOutcome />} />
        <Route path="/admin/tickers/update" element={<AdminUpdateTicker />} />
        <Route path="/admin/delete-question" element={<DeleteQuestionPage />} />
        <Route path="/admin/unset-outcome" element={<UnsetOutcomePage />} />
        <Route path="/admin/delete-ticker" element={<DeleteTickerPage />} />
        <Route path="/admin/category/create" element={<CreateCategoryPage />} />
        <Route path="/admin/category/delete" element={<DeleteCategoryPage />} />
        <Route path="/admin/create-article" element={<AdminCreateArticlePage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/questions/:questionId/related-articles" element={<RelatedArticlesPage />} />
        <Route path="/admin/questions/edit" element={<EditQuestionList />} />
        <Route path="/admin/questions/edit/:id" element={<EditQuestionForm />} />
        <Route path="/admin/categories" element={<CategoryListPage />} />
        <Route path="/admin/category/edit/:id" element={<EditCategoryPage />} />
        <Route path="/admin/articles/create-rich" element={<CreateRichArticlePage />} />
        <Route path="/questions/:questionId/related-articles" element={<RelatedArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path = "/analysis" element = {<OurAnalysisPage />} />
        <Route path = "/admin/articles/manage" element = {<AdminArticlesManage />} />
        <Route path = "/admin/articles/edit/:id" element = {<EditArticlePage />} />
        <Route path = "/admin/articles/delete" element = {<BulkDeleteArticles />} />
        <Route path="/leaders" element={<LeadersPage />} />
        
        <Route path = "/admin/leader/create" element = {<CreateLeaderPage />} />
        <Route path = "/admin/delete-leader" element = {<DeleteLeaderPage />} />
        <Route path = "/admin/leader/edit" element = {<EditLeaderPage />} />
        <Route path="/leader-timeline/:leaderName" element={<LeaderTimelinePage />} />
        <Route path="/timeline-search" element={<TimelineKeywordSearchPage />} />

      </Routes>
    </Router>
  );
}

export default App;
