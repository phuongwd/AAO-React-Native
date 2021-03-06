// @flow

import * as Sentry from '@sentry/react-native'
import {type NavigationState} from 'react-navigation'

// gets the current screen from navigation state
function getCurrentRouteName(navigationState: NavigationState): ?string {
	if (!navigationState) {
		return null
	}
	let route = navigationState.routes[navigationState.index]
	// dive into nested navigators
	if (route.routes) {
		return getCurrentRouteName(route)
	}
	return route.routeName
}

export function trackScreenChanges(
	prevState: NavigationState,
	currentState: NavigationState,
) {
	let currentScreen = getCurrentRouteName(currentState)
	let prevScreen = getCurrentRouteName(prevState)

	if (!currentScreen) {
		return
	}

	if (currentScreen !== prevScreen) {
		Sentry.addBreadcrumb({
			message: `Navigated to ${currentScreen}`,
			category: 'navigation',
			data: {
				prev: prevScreen,
			},
		})
	}
}
