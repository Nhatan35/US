import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/app/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ModulesPage } from '@/pages/ModulesPage';
import { ModuleDetailPage } from '@/pages/ModuleDetailPage';
import { LessonPage } from '@/pages/LessonPage';
import { QuizPage } from '@/pages/QuizPage';
import { GlossaryPage } from '@/pages/GlossaryPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { LabsHubPage } from '@/pages/LabsHubPage';
import { StoryWriterLab } from '@/labs/story-writer/StoryWriterLab';
import { GherkinBuilderLab } from '@/labs/gherkin/GherkinBuilderLab';
import { SplittingTrainerLab } from '@/labs/splitting/SplittingTrainerLab';
import { PersonaEmpathyJourneyLab } from '@/labs/persona/PersonaEmpathyJourneyLab';
import { PrioritizationLab } from '@/labs/prioritization/PrioritizationLab';
import { PlanningPokerLab } from '@/labs/planning-poker/PlanningPokerLab';
import { VelocityForecasterLab } from '@/labs/velocity/VelocityForecasterLab';
import { StoryMapLab } from '@/labs/story-map/StoryMapLab';
import { AntiPatternHunterLab } from '@/labs/antipattern/AntiPatternHunterLab';
import { CasesPage } from '@/pages/CasesPage';
import { RolePlayPage } from '@/pages/RolePlayPage';
import { Module8Page } from '@/pages/Module8Page';
import { CapstonePage } from '@/pages/CapstonePage';
import { ReviewPage } from '@/pages/ReviewPage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { Module9ExamPage } from '@/pages/Module9ExamPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/m0" element={<Navigate to="/onboarding" replace />} />
          <Route path="/modules/m8" element={<Module8Page />} />
          <Route path="/modules/m9" element={<Module9ExamPage />} />
          <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
          <Route path="/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/modules/:moduleId/quiz" element={<QuizPage />} />
          <Route path="/labs" element={<LabsHubPage />} />
          <Route path="/labs/story-writer" element={<StoryWriterLab />} />
          <Route path="/labs/gherkin" element={<GherkinBuilderLab />} />
          <Route path="/labs/splitting" element={<SplittingTrainerLab />} />
          <Route path="/labs/persona" element={<PersonaEmpathyJourneyLab />} />
          <Route path="/labs/prioritization" element={<PrioritizationLab />} />
          <Route path="/labs/planning-poker" element={<PlanningPokerLab />} />
          <Route path="/labs/velocity" element={<VelocityForecasterLab />} />
          <Route path="/labs/story-map" element={<StoryMapLab />} />
          <Route path="/labs/antipattern" element={<AntiPatternHunterLab />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/roleplay" element={<RolePlayPage />} />
          <Route path="/capstone" element={<CapstonePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/exam" element={<Module9ExamPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
