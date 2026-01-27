# Quiz and Test Generation Roadmap (UI)

Goal
- Add a quiz/test creation and taking flow to the React UI with three question types: multiple choice, open text with follow-ups, and coding questions with deterministic evaluation.

New routes and pages
1) `/quiz` (builder)
- Select book, chapter, and/or topic from the new topic index.
- Choose number of questions and distribution by type (MC/open/coding).
- Button to generate a quiz session.

2) `/quiz/:quizId` (session)
- Display current question, progress, and feedback.
- Provide answer input per question type.
- Show hints and allow follow-up for open text and coding.
- Show final summary when complete.

Data layer changes
1) API paths (edit `src/Api/Api.jsx`)
- Add paths: `getTopics`, `refreshTopics`, `generateQuiz`, `getQuiz`, `submitAnswer`, `getQuizSummary`.
- Ensure all calls use credentials and reuse `usePost` / `useGet` hooks.

2) New hooks (optional)
- `useTopics(book)` for caching index.
- `useQuizSession(quizId)` to poll or refetch after answer submission.

Components to add
1) `src/Quiz/QuizBuilder.jsx`
- Book dropdown + topic/chapter selectors.
- Sliders or numeric inputs for counts by type.
- Validate totals (sum equals total count).
- Calls `generateQuiz` and navigates to session.

2) `src/Quiz/QuizSession.jsx`
- State machine: idle -> loading -> answering -> evaluating -> completed.
- Render per question type:
  - MC: radio options.
  - Open text: textarea + follow-up display.
  - Coding: code editor textarea + run/submit.
- Call `submitAnswer`, display feedback, and advance when correct.

3) `src/Quiz/QuestionRenderer.jsx`
- Single renderer component that switches by `question.type`.

4) `src/Quiz/QuizSummary.jsx`
- Show score, correctness per question, and links to review.

5) `src/Quiz/TopicsBrowser.jsx`
- Optional panel to preview chapters/topics before generating.

Navigation and permissions
- Update `src/Utils/Navbar.jsx` to include a Quiz link for users with `generate_quiz` or `take_quiz`.
- Reuse existing `useCheckSession` flow for permission gating.

Styling
- Add styles to `src/assets/App.css` for quiz layout.
- Keep design consistent with existing cards/rows.
- Ensure mobile layout stacks inputs and summary cleanly.

Offline demo mode
- Add `src/Demo/DemoQuiz.jsx` sample questions mirroring API shape.
- In `QuizSession`, if API is unavailable, fall back to demo data similar to `DemoQuestions.jsx`.

Testing and verification
- Manual: generate quiz, answer each type, verify feedback and summary.
- UI edge cases: topic list empty, quiz generation errors, invalid counts.

Milestones
1) Add API paths, builder page, and session UI with demo data.
2) Wire live API integration for topics and quiz generation.
3) Add hints/follow-up handling and summary page.
