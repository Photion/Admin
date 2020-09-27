# Photion: Web Admin
![test-and-build](https://github.com/photion/web-admin/workflows/test-and-build/badge.svg)
[![codecov](https://codecov.io/gh/photion/web-admin/branch/master/graph/badge.svg)](https://codecov.io/gh/photion/web-admin)

Photion Web Admin is the admin UI for the Photion service. Creators can "soft login" by providing integration information, such as AWS IAM keys, or via OAuth with Google Drive.

Once they are "soft logged in" and Photion has read and write access to their files and metadata, they can retrieve, list, create, update and delete their files, or produce additional metadata.

## Core concepts and objectives

### You own it
- Media creators should own their own files and metadata - This means Photion will act like a tool/service against media creators accounts and won't store user information directly.

### Easy and Cheap
- Make it dead easy to use (i.e. integrate with Google Drive), but allow more "nerdy" integrations (AWS, GCP, etc).
- Allow media creators to backup their files and metadata, while keeping costs as low as possible (especially when big files are involved).

### Keep your power
- Allow media creators to generate websites based on their contents, such as portfolio websites, explorable web archives, media license online shops, etc.
- Build social media integration, so media creators can publish on several channels from a centralised platform they control.

## Architecture
- Photion Website: Website presenting the Photion service.
- **Photion Web Admin: Allows creators to manage their media. <-- you are here**
- Integration: AWS
- Integration: GCP
- Integration: Azure

## Pipeline

- In parallel:
  - Run unit tests
  - Run feature tests
  - Generate production build of the website and upload it as GitHub artifact
- If all previous steps are successful:
  - Deploy artifact build to Netlify preview site
  - Run E2E tests against the preview build
- If the previous step is successful and branch is `master`:
  - Deploy artifact build to Netlify production site

## Contributing

- Clone this repository and install its dependencies with yarn: `yarn install`
- Set your environment variables (`.envrc` with `direnv` is recommended, see `.envrc.example.sh` file)
- Use vue-cli-service's hot reload server: `yarn serve`
- Build a preview website: `yarn build`
- Build a production website: `yarn build --modern`
- Run unit tests: `yarn test:unit`
- Run feature tests (they require credentials): `yarn test:feat`
- Run E2E tests (they require the development server): `yarn cypress open`
