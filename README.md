# Photion: Web Admin
![test-and-build](https://github.com/photion/web-admin/workflows/test-and-build/badge.svg)
[![codecov](https://codecov.io/gh/photion/web-admin/branch/master/graph/badge.svg)](https://codecov.io/gh/photion/web-admin)

Photion Web Admin is the admin UI for the Photion service. Its Creators can "soft login" by providing integration information, such as AWS IAM keys, or via OAuth with Google Drive.

Once they are "soft logged in" and Photion has read and write access to their files and metadata, they can retrieve, list, create, update and delete their files, or produce additional metadata.

## Core concepts and objectives

### You own it
- Upload your media to a safe space. Each media group can contain several files, grouping together preview quality (`.jpg`, `.mp3`, etc), high quality (`.png`, `.wav`, etc) and the original source files (`.cr2`, `.dng`, etc)
- Media creators should own their own files and metadata - This means Photion will act like a tool/service against media creators accounts and won't store user information directly.

### Easy and Cheap
- Make it dead easy to use (i.e. integrate with Google Drive), but allow more "nerdy" integrations (AWS, GCP, etc).
- Allow media creators to backup their files and metadata, while keeping costs as low as possible (especially when big files are involved).
- Allow media creators to search the files by date, tags, name, description like an intelligent file system.
- Automate file storage class lifecycles. Using S3 as an example, keep preview files in S3 Standard, high quality files in Standard IA, original files in Glacier Deep Archive.

### Keep your power
- Allow media creators to generate websites based on their contents, such as portfolio websites, explorable web archives, media license online shops, etc.
- Build social media integration, so media creators can publish on several channels from a centralised platform they control.

## Architecture
- Photion Website: Website presenting the Photion service.
- **Photion Web Admin: Allows creators to manage their media. <-- You are here**
- Integration: Amazon Web Services
- Integration: Google Cloud Platform
- Integration: Microsoft Azure

## Pipeline

- **Step 1: Simple tests**:
  - Run unit tests
  - Run feature tests
  - Generate production build of the website and upload it as GitHub artifact
- **Step 2: E2E tests**
  - Deploy artifact build to Netlify preview site
  - Run E2E tests against the preview build
- **Step 3: Production deployment (master only)**
  - Deploy artifact build to Netlify production site

## Contributing

Please refer to our [Contributing Guidelines](CONTRIBUTING.md)
