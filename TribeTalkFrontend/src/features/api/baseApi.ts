// features/api/baseApi.ts (UPDATED)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1",
    credentials: "include"
  })

  const result = await baseQuery(args, api, extraOptions)

  if (result.error) {
    const error = result.error as any
    
    if (typeof error.data === 'string' && error.data.includes('<!DOCTYPE html>')) {
      const match = error.data.match(/<pre>(.*?)<\/pre>/s)
      if (match) {
        const errorText = match[1]
          .replace(/<br>/g, '\n')
          .replace(/&nbsp;/g, ' ')
          .replace(/<[^>]*>/g, '')
          .trim()
        
        const firstLine = errorText.split('\n')[0].replace('Error: ', '')
        
        return {
          error: {
            status: error.status,
            data: { message: firstLine },
          }
        }
      }
      
      return {
        error: {
          status: error.status,
          data: { message: 'An error occurred on the server' }
        }
      }
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Servers", "Channels", "Messages"], // UPDATED: Added Messages
  endpoints: () => ({})
})