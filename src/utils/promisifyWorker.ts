// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const promisifyWorker = (worker: Worker): Promise<any> => {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      resolve(event.data)
    }
    worker.onerror = (error) => {
      reject(error)
    }
  })
}
