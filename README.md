# reddit-exdata-viewer

## About

A local viewer for personal Reddit data exports. **Exdata** stands for **exported data**.

I built this app for myself because Reddit's interface limits how far I can browse older saved and voted-on content. Posts I had kept for later became difficult to find again. Reading the data export lets me browse the entries included in my archive with search and filters.

Files are processed in your browser without uploading them to a server. No Reddit API access is required.

## Supported Data

Open a Reddit ZIP export or one of these CSV files:

| File                   | Contents                   |
| ---------------------- | -------------------------- |
| `post_votes.csv`       | Voted-on posts             |
| `saved_posts.csv`      | Saved posts                |
| `hidden_posts.csv`     | Hidden posts               |
| `comment_votes.csv`    | Voted-on comments          |
| `saved_comments.csv`   | Saved comments             |
| `user_preferences.csv` | Reddit account preferences |
| `statistics.csv`       | Account statistics         |

The app currently reads the files I find useful; other files in a ZIP are ignored. I plan to support the rest of the export in the future.

## Get Your Reddit Data

1. Sign in to Reddit and open the [data request form](https://www.reddit.com/settings/data-request) in a desktop browser
2. Select **General Data Protection Regulation (GDPR)** as the request type, complete the form and submit your request
3. Download the ZIP when Reddit sends you a download link, then open it in the app

In my case, the export was ready in about two hours.

## Stack

- Minista, React and TypeScript
- CSS, CSS Modules and `@a1rth/css-normalize`
- pnpm

## Quick Start

```sh
pnpm install
pnpm dev
```
