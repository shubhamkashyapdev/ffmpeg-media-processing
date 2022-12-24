/* eslint-disable no-console */
export const download = (e: any, type: any) => {
  fetch(e.target.href, {
    method: 'GET',
    headers: {}
  })
    .then((response) => {
      response.arrayBuffer().then((buffer) => {
        const url = window.URL.createObjectURL(new Blob([buffer]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', type)
        document.body.appendChild(link)
        link.click()
      })
    })
    .catch((err) => {
      console.error(err)
    })
}
