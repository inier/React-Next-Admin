import { StatusCodes } from 'http-status-codes'
import { requestCreator, G } from '@siyuan0215/easier-axios-dsl'



const ERROR_CODES = {
  REPEAT_LOGIN: '510',
  CASE_NO_OPERATION: '3005',
}

const TIMEOUT = {
  DEFAULT: 60000,
  UPLOADING: 5 * 60000,
}

export const request = requestCreator({
  baseURL: process.env.BASE_URL,
  timeout: TIMEOUT.DEFAULT,
  withCredentials: true,
  requestInterceptors: [
    (config) => {
      return {
        ...config,
        timeout:TIMEOUT.UPLOADING,
        headers: {
          ...config.headers,
          authorization:'1',
        },
      }
    },
    (error: any) => Promise.reject(error),
  ],
  responseInterceptors: [
    (response) => {
      const { data, status } = response

      if (status === StatusCodes.OK) {
        return response
      }
      return Promise.reject(response)
    },
    (error: string) => {
      return Promise.reject(error)
    },
  ],
})

export const generatorAPIS = <T extends {}>(apiConfig: T) => G<T>(request, apiConfig)