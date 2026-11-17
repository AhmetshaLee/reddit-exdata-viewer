/* global localStorage, document, console */

function setupTheme() {
  try {
    const savedTheme = localStorage.getItem('reddit-exdata-viewer-theme')
    document.documentElement.dataset.theme =
      savedTheme === 'dark' ? 'dark' : 'light'
  } catch (error) {
    console.warn('Не удалось восстановить сохранённую тему.', error)
  }
}

setupTheme()
