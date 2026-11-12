import type { Messages } from './index'

export const en = {
  archiveTitle: 'Your Reddit archive',
  votedPosts: 'Posts you voted on',
  votedComments: 'Comments you voted on',
  savedComments: 'Saved comments',
  savedPosts: 'Saved posts',
  hiddenPosts: 'Hidden posts',
  settingsTitle: 'Reddit preferences',
  statistics: 'Statistics',

  posts: 'Posts',
  comments: 'Comments',
  mine: 'Mine',
  ownPosts: 'My posts',
  ownComments: 'My comments',
  rated: 'Voted',
  saved: 'Saved',
  hidden: 'Hidden',
  account: 'Account',
  settings: 'Preferences',
  other: 'Other',
  messages: 'Messages',
  savedPostHint: 'Posts you saved',
  savedCommentHint: 'Comments you saved',
  ratedPostHint: 'Upvoted and downvoted posts',
  ratedCommentHint: 'Upvoted and downvoted comments',
  menuHint: 'Data from the opened file is available',
  menuEmptyHint: 'Menu items become available after opening a CSV or ZIP',

  theme: 'Page theme',
  changeTheme: 'Change page theme',
  light: 'L',
  dark: 'D',
  reading: 'Reading file…',
  localNote: 'Your data stays on your device',
  controls: 'Controls',
  sections: 'Archive sections',

  intro: 'Open your archive to browse your data',
  uploadTitle: 'Drop your archive here',
  uploadDescription: 'or select a file on your computer',
  chooseArchive: 'Choose archive',
  openFile: 'Open file',
  openedFile: 'Opened file',

  toolbar: 'Search and filters',
  search: 'Search',
  filters: 'Filters',
  reset: 'Reset',
  communities: 'Subreddits',
  votesTitle: 'Votes',
  all: 'All',
  unknownCommunity: 'Subreddit not specified',
  empty: 'No results match the selected conditions',
  emptyPosts: 'The file contains no posts',
  emptyComments: 'The file contains no comments',
  emptyRecords: 'The file contains no records',
  searchPosts: 'Search by title, URL or post ID',
  searchComments: 'Search by comment ID, URL or post title',
  searchProperties: 'Search by name or value',
  missingBody: 'Comment text is not included in this file',

  pagination: 'Pagination',
  previous: 'Previous page',
  current: 'Current page',
  next: 'Next page',
  page: 'Page',
  of: 'of',

  banner: 'Banner placeholder',
  description: 'An app for viewing your Reddit archive locally',
  footer: 'View Reddit data on your device',
  footerNote: 'exdata stands for exported data',
  language: 'Interface language',

  results: (found: number, total: number) => `Found: ${found} of ${total}`,
  range: (first: number, last: number, total: number) =>
    `Records: ${first}–${last} of ${total}`,
  postTitle: (id: string) => `Post #${id}`,
  commentTitle: (id: string) => `Comment #${id}`,
  parentPost: (title: string) => `On post: ${title}`,
  yourVote: (label: string) => `Your vote: ${label}`,
  votes: { up: 'Upvoted', down: 'Downvoted', none: 'Not specified' },

  errors: {
    unexpected: () => 'An unexpected error occurred while opening your data.',
    invalidCsv: () => 'Could not parse the CSV. Check delimiters and quotes.',
    invalidVote: () => 'A CSV record is missing an ID, URL or vote.',
    invalidLink: () => 'A CSV record is missing an ID or URL.',
    invalidPreference: () =>
      'A CSV record is missing a preference name or value field.',
    invalidStatistic: () =>
      'A CSV record is missing a statistic name or value field.',
    readFile: () => 'Could not read the file. Select it again.',
    openZip: () => 'Could not open the ZIP archive. Check the selected file.',
    columns: ([columns]: readonly string[]) =>
      `Expected CSV columns: ${columns}.`,
    selectSource: ([names]: readonly string[]) =>
      `Select ${names} or a ZIP archive of your Reddit data.`,
    unsupported: ([name]: readonly string[]) =>
      `File ${name} is not supported.`,
    duplicate: ([name]: readonly string[]) =>
      `The ZIP contains multiple ${name} files. Open the desired CSV separately.`,
    noSupported: ([names]: readonly string[]) =>
      `No supported files found in the ZIP: ${names}.`,
    extract: ([name]: readonly string[]) =>
      `Could not extract ${name} from the ZIP archive.`,
    fileContext: ([name, detail]: readonly string[]) =>
      `File ${name}: ${detail}`,
  },
} satisfies Messages
