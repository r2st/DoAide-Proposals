import { Routes, Route, Navigate } from 'react-router-dom';
import Protected from './components/Protected';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import TemplateEditor from './pages/TemplateEditor';
import Proposals from './pages/Proposals';
import ProposalEditor from './pages/ProposalEditor';
import Clients from './pages/Clients';
import ClientView from './pages/ClientView';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import PublicProposal from './pages/PublicProposal';
import GeneratorPage from './pages/GeneratorPage';
import CostCalculatorPage from './pages/CostCalculatorPage';
import TemplatesGalleryPage from './pages/TemplatesGalleryPage';
import EmbedPage from './pages/EmbedPage';
import BlogLayout, { ARTICLES, BlogIndex } from './pages/BlogLayout';
import ToolsIndexPage from './pages/ToolsIndexPage';
import WinRateEstimatorPage from './pages/WinRateEstimatorPage';
import PricingCalculatorPage from './pages/PricingCalculatorPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/p/:token" element={<PublicProposal />} />

      {/* Free tools */}
      <Route path="/generator" element={<GeneratorPage />} />
      <Route path="/calculator" element={<CostCalculatorPage />} />
      <Route path="/templates-gallery" element={<TemplatesGalleryPage />} />
      <Route path="/embed" element={<EmbedPage />} />
      <Route path="/tools" element={<ToolsIndexPage />} />
      <Route path="/tools/win-rate" element={<WinRateEstimatorPage />} />
      <Route path="/tools/pricing-calculator" element={<PricingCalculatorPage />} />
      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogIndex />} />
        {ARTICLES.map(a => <Route key={a.slug} path={a.slug} element={<a.component />} />)}
      </Route>

      <Route
        path="/dashboard"
        element={
          <Protected>
            <Layout><Dashboard /></Layout>
          </Protected>
        }
      />
      <Route
        path="/templates"
        element={
          <Protected>
            <Layout><Templates /></Layout>
          </Protected>
        }
      />
      <Route
        path="/templates/new"
        element={
          <Protected>
            <Layout><TemplateEditor /></Layout>
          </Protected>
        }
      />
      <Route
        path="/templates/:id"
        element={
          <Protected>
            <Layout><TemplateEditor /></Layout>
          </Protected>
        }
      />
      <Route
        path="/proposals"
        element={
          <Protected>
            <Layout><Proposals /></Layout>
          </Protected>
        }
      />
      <Route
        path="/proposals/new"
        element={
          <Protected>
            <Layout><ProposalEditor /></Layout>
          </Protected>
        }
      />
      <Route
        path="/proposals/:id"
        element={
          <Protected>
            <Layout><ProposalEditor /></Layout>
          </Protected>
        }
      />
      <Route
        path="/clients"
        element={
          <Protected>
            <Layout><Clients /></Layout>
          </Protected>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <Protected>
            <Layout><ClientView /></Layout>
          </Protected>
        }
      />
      <Route
        path="/settings"
        element={
          <Protected>
            <Layout><Settings /></Layout>
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
