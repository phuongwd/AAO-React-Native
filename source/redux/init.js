// @flow
// Functions to initialize bits of the global state, as appropriate

import NetInfo from '@react-native-community/netinfo'
import {getEnabledTools} from './parts/help'
import {loadFavoriteBuildings} from './parts/buildings'
import {loadAcknowledgement} from './parts/settings'
import {loadRecentSearches, loadRecentFilters} from './parts/courses'

export async function init(store: {dispatch: (any) => any}) {
	// this function runs in two parts: the things that don't care about
	// network, and those that do.

	// kick off the parts that don't care about network in parallel
	await Promise.all([
		store.dispatch(loadAcknowledgement()),
		store.dispatch(loadFavoriteBuildings()),
		store.dispatch(loadRecentSearches()),
		store.dispatch(loadRecentFilters()),
	])

	// wait for our first connection check to happen
	await NetInfo.fetch()

	// then go do the network stuff in parallel
	await Promise.all([store.dispatch(getEnabledTools())])
}
