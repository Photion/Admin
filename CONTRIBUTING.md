# Contributing

Thanks for taking interest in Photion!

In order to contribute to Photion, we recommend you to join our Slack workspace ([https://photion.slack.com](https://photion.slack.com)) by contacting wdp@dipasqualew.com for an invite.

## Getting Started

**Clone this repository**
```bash
# Recommended: create a photion folder
# to keep photion repositories together
mkdir photion && cd photion

git clone git@github.com/photion/web-admin.git
```

**Install project dependencies**
```bash
# If you haven't installed yarn:
npm install --global yarn

yarn install
```

**Populate your environment variables**
```bash
# direnv is advised but you can use any tool you prefer
# `.envrc.example.sh` contains a copy of all environment variables
# but none of them is actually required to get the app starting
cp .envrc.example.sh .envrc
```

**Use `vue-cli-service` for a hot-reload development server**
```bash
yarn serve
```

**Build the production-optimised static website**
```bash
yarn build --modern
```

**Run unit tests**
```bash
# These are tests without side-effects
# They are safe to repeat and require no external setup
yarn test:unit
```

**Run feature tests**
```bash
# These are tests causing side-effects
# They are not safe to repeat and may require
# external setup and external clean up.
# You will also need environment variables for auth and more.
# If you can't run feature tests, don't worry.
# They will be executed by the pipeline at each PR.
yarn test:feat
```

**Run E2E tests**
```bash
# E2E tests assume a server pointing at http://localhost:8080
# This behaviour can be personalised via environment variable.
# Generally speaking, you are safe using `yarn serve`.

# With GUI
yarn cypress open

# Without GUI
yarn cypress run
```

## What should I do?

That's up to you! Just share with the team what you are looking to do and how do you plan to tackle your issue. This allows us to assign issues, avoid duplicated work and to share insight about problems.

Think about picking up issues like an asynchronous daily stand up. We discuss what we plan we did, what we plan to do and whether there are any blockers.

## Where is everything?

Good question!

- `cypress`: Our E2E tests go here. `src/integrations` contain one test file mirroring the page components found in `/src/vue/pages`
- `public`: Only uncompiled assets should be placed here. We should avoid to populate this folder as it will not be processed by Webpack
- `src/api`: API integration specific code lives here. API integrations are swappable, so they all extend a common interface (`src/api/AbstractClient.ts`)
- `src/assets`: Static assets that will be processed by Webpack
- `src/errors`: Common errors
- `src/files`: In-browser file processing utilities and functions
- `src/models`: Model declaration (the shape of our data)
- `src/plugins` Plugin to be executed at Vue init
- `src/state`: Handles global reactive properties (think about it a simpler Redux/Vuex global, reactive data store)
- `src/vue/components`: Reusable Single File Component `.vue` files
- `src/vue/pages`: Route-specific Single Fiel Component `.vue` files
- `src/vue/router.ts`: The application router
- `src/App.vue`: The Vue application entry point
- `src/main.ts`: The application entry point

## Workflow

1. We try to work on branches based on issues. Branch names starting with the issue number are preferred.

2. Issues labelled with `good first issue` should be ideal to get started as they will be either small tasks or tasks that should be easy to implement and cover multiple areas of the site.

3. You can choose to work on any open, unassigned issue, but it is better to let the team know, so we can avoid two or more persons trying to solve the same issue. Talking with the team about the team gives us the opportunity to share knowledge regarding the issue rationale and possible solutions. Some issues may seem daunting but there may already be an easy solution for them.

4. The `master` branch is protected. This means changes goes through `master` via Pull Request only.

5. Feel free to commit often. Commits will be rebased and squashed at the end of the Pull Request review process anyway.

6. In order to merge it, a PR needs to be reviewed and all pipeline steps must pass. We aim to never merge to `master` the application in a broken state. Code reviews are the occasion to share knowledge between contributors and not a place to judge "quality of code". There is no such thing as perfect code, but everyone is constantly learning and improving.

7. Even thought coverage is not a metric for testing quality, we should aim for a 90%+ coverage as we focus against edge scenarios and we try to execute most of the code. This means that coverage must always go up. Since we are using TypeScript we shouldn't worry about un-executable code as `tsc` will fail to run. However, runtime errors are easily catched by a good coverage.

8. Commits to `master` are automatically build as a step of the Github Action Workflow defined for master. This means that `master` is an effective copy of the build produced on the last commit pipeline. You can verify this by looking at our [actions](https://github.com/photion/web-admin/actions)

9. Finally, when in doubt, just pop a question on Slack. We will try to answer at the best of our knowledge. There are no wrong questions, as each questions gives us the opportunity of rethinking an issue.

## Standards

### Linting

We use TypeScript, ESLint and Vetur.

Updating `.eslintrc` requires a conversation with the team. We should have a strong reason for disabling a rule.

If a rule is disabled in a specific source file, expect a code review conversation about it, unless a detail comment explanation is provided. This is not to say that overriding the linter is bad. We just need a good reason.

### Tests

Tests are the most important documenting tool we have as developers. Well-tested code explains features and edge case scenarios better than any wall of text. The machine will tell you whether your code is doing what it is supposed to, and will easily complain.

We have 4 tests strategies in place, each building on the previous. Test driven development is strongly encouraged.

1. **Unit Tests**: These should be side-effects free, extremely fast to execute and think about the code as small units to which we feedback inputs and expect outputs. External dependencies need to be mocked and ideally you would need to be able to execute them in `--watch` mode. They will guide your development.

2. **Feature Tests**: They test integrations between units and perform side effects, such as real API Requests. They create, update and delete resources. They require setups and teardowns. We should be able to repeat feature tests as a clean-up strategy needs to be planned, but we expect them to have a costs and to run slower.

3. **Build**: We build each commit in our PR because a webapp that doesn't build is not really helpful! The build will assure us that the code can produce an optimised app.

4. **E2E Tests**: The last and most important testing step. With E2E tests we actually try to replicate user activity and UX and we check application features are really working.

We cannot merge a new feature that doesn't include a reasonable amount of tests. That means, a combination of Unit, Feature and E2E tests, as it will be hard for reviewers and future maintainers to know how the feature works, what are its limits, and how it can break.

Our pipeline runs all the 4 steps above before deploying to production. The production app is the exact build generated in the build step and tested in the E2E tests step. This guarantees us that we are not deploying a broken application.
