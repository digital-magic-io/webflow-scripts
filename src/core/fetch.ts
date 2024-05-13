import type { FN, Handler, NullableType } from './types'
import { hasValue } from './utils'

export class ApiError extends Error {
  public readonly status: number
  public readonly url: string
  public readonly method: string
  public readonly cause: string
  public readonly response: Response

  constructor(response: Response, cause: string) {
    super(`Failed to fetch ${response.url}: ${response.status} ${response.statusText}: ${cause}`)
    this.status = response.status
    this.url = response.url
    this.method = response.statusText
    this.cause = cause
    this.response = response
  }
}

export const getErrorFromResponse = async <T>(response: Response): Promise<T> => {
  const responseText = await response.text()
  if (!responseText || responseText.length === 0) {
    return undefined as unknown as T
  } else {
    return JSON.parse(responseText) as T
  }
}

export const fetchTyped = async <T>(url: string, init: RequestInit = { method: 'GET' }): Promise<T> => {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw new ApiError(response, 'Unsuccessful HTTP status')
  } else {
    const responseText = await response.text()
    if (!responseText || responseText.length === 0) {
      return undefined as unknown as Promise<T>
    } else {
      return JSON.parse(responseText) as Promise<T>
    }
  }
}

export const getTyped = async <T>(url: string): Promise<T> => fetchTyped(url)

export const postTyped = async <T, R>(url: string, body: T): Promise<R> =>
  fetchTyped(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })

export const uploadTyped =
  <R>(url: string) =>
  (file: File): Promise<R> => {
    const data = new FormData()
    data.append('file', file)

    return fetchTyped<R>(url, {
      method: 'POST',
      body: data
    })
  }

export const fromFileList = (files: NullableType<FileList>): Array<File> => {
  const result: Array<File> = []
  if (hasValue(files)) {
    for (const file of files) {
      result.push(file)
    }
  }
  return result
}

export const uploadFilesList =
  <TUploadResult>(
    upload: FN<File, Promise<TUploadResult>>,
    onFileUploadSuccess?: Handler<void>,
    onFileUploadError?: Handler<unknown>
  ): FN<Array<File>, Promise<Array<TUploadResult>>> =>
  (files) =>
    Promise.all(
      files.map((file) =>
        upload(file)
          .then((result) => {
            onFileUploadSuccess?.()
            return result
          })
          .catch((e: unknown) => {
            // eslint-disable-next-line no-console
            console.error('File upload error', e)
            onFileUploadError?.(e)
            throw e
          })
      )
    ).then((result) => result.filter(hasValue))

export const uploadTypedArray = <R>(url: string, files: Array<File>): Promise<Array<R>> =>
  uploadFilesList<R>(uploadTyped<R>(url))(files)

export const uploadTypedFileList = <R>(url: string, files: FileList): Promise<Array<R>> =>
  uploadTypedArray<R>(url, fromFileList(files))
