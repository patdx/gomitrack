import { createRequestHandler, RouterContextProvider } from 'react-router'
import {
	MyAsyncContext,
	myRequestContext,
	type MyRequestContext,
} from '~/.server/context'

const requestHandler = createRequestHandler(
	() => import('virtual:react-router/server-build'),
	import.meta.env.MODE,
)
export default {
	fetch(request, env, executionCtx) {
		const reactRouterContext = new RouterContextProvider()

		reactRouterContext.set(myRequestContext, {
			request,
			env,
			executionCtx,
		} satisfies MyRequestContext)

		return MyAsyncContext.run(reactRouterContext, () =>
			requestHandler(request, reactRouterContext),
		)
	},
} satisfies ExportedHandler<Cloudflare.Env>
