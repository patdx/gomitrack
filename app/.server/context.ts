import { AsyncLocalStorage } from 'node:async_hooks'
import { createContext, RouterContextProvider } from 'react-router'

export const MyAsyncContext = new AsyncLocalStorage<RouterContextProvider>()

export interface MyRequestContext {
	request: Request
	env: Cloudflare.Env
	executionCtx: ExecutionContext
}

export const myRequestContext = createContext<MyRequestContext>()

export function getMyRequestContext(): Partial<MyRequestContext> {
	const ctx = MyAsyncContext.getStore()

	const requestContext = ctx?.get(myRequestContext) as
		| MyRequestContext
		| undefined

	return requestContext ?? {}
}
