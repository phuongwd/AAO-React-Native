// @flow

import type {StoryType} from './types'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import type {FilterType} from '@frogpond/filter'
import {entities} from '@frogpond/html-lib'

export function buildFilters(newsItems: StoryType[]): FilterType[] {
	// Format the items for the categories filter
	const categories = flatten(newsItems.map(item => item.categories))
	const categoryLabels = uniq(categories)
	const allCategories = categoryLabels.map(label => ({
		title: entities.decode(label),
	}))

	return [
		{
			type: 'list',
			key: 'stations',
			enabled: false,
			spec: {
				title: 'Categories',
				options: allCategories,
				mode: 'OR',
				selected: allCategories,
				displayTitle: true,
			},
			apply: {
				key: 'station',
			},
		},
	]
}
