/**
 * useDownloadFileFromURL Composable
 *
 * These composables are intended for utility or helper functions related to files
 */
const useDownloadFileFromURL = () => {
  /**
   * Download File From Url
   *
   * @param {{
   *  url: string
   *  fileName: string
   * }} params
   */
  const downloadFileFromUrl = ({ url, fileName }) => {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'

    a.href = url
    a.download = fileName
    a.click()
  }

  return {
    downloadFileFromUrl
  }
}

export { useDownloadFileFromURL }
