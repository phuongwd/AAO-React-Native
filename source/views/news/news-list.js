// @flow
import * as React from 'react'
import {StyleSheet, FlatList} from 'react-native'
import * as c from '@frogpond/colors'
import type {StoryType} from './types'
import {ListSeparator} from '@frogpond/lists'
import {applyFiltersToItem, type FilterType} from '@frogpond/filter'
import {NoticeView} from '@frogpond/notice'
import type {TopLevelViewPropsType} from '../types'
import {NewsRow} from './news-row'
import {openUrl} from '@frogpond/open-url'
import {FilterNewsToolbar as FilterToolbar} from './filter-news-toolbar'
import {buildFilters} from './lib/build-filters'
import values from 'lodash/values'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
})

type FilterFunc = (filters: Array<FilterType>, item: StoryType) => boolean

type Props = TopLevelViewPropsType & {
	name: string,
	onRefresh: () => any,
	entries: StoryType[],
	loading: boolean,
	thumbnail: false | number,
}

type DefaultProps = {
	applyFilters: FilterFunc,
}

type Props = Props & DefaultProps

type State = {
	entries: StoryType[],
	filters: Array<FilterType>,
}

export class NewsList extends React.PureComponent<Props> {
	static defaultProps = {
		applyFilters: applyFiltersToItem,
	}

	state = {
		entries: [],
		filters: [],
	}

	static getDerivedStateFromProps(props: Props, prevState: State) {
		// we only need to do this when the news items have changed; this avoids
		// us overriding our changes from FilterView.onDismiss
		if (!prevState.entries || props.entries !== prevState.entries) {
			let {entries} = props
			const filters =
				prevState.filters.length !== 0
					? prevState.filters
					: buildFilters(values(entries))
			return {filters, entries: props.entries}
		}
		return null
	}

	onPressNews = (url: string) => {
		return openUrl(url)
	}

	// 	groupNewsData = (args: {
	// 		filters: Array<FilterType>,
	// 		categories: Array<String>,
	// 		entries: Array<StoryType>,
	// 		applyFilters: FilterFunc,
	// 	}) => {
	// 		let {applyFilters, entries, categories, filters} = args
	//
	// 		let dereferenceNewsStories = story =>
	// 			story.categories
	// 				// Dereference each news item
	// 				.map(id => entries[id])
	// 				// Ensure that the referenced story items exist,
	// 				// and apply the selected filters to the stories in the feed
	// 				.filter(item => item && applyFilters(filters, item))
	//
	// 		let storiesWithItems: Array<{title: string, data: Array<StoryType>}> = categories
	// 			// We're grouping the story entries in a [label, Array<items>] tuple.
	// 			.map(category => [category.label, dereferenceNewsStories(category)])
	// 			// We only want to show categories with at least one item in them
	// 			.filter(([_, items]) => items.length)
	// 			// We need to map the tuples into objects for SectionList // todo: ???
	// 			.map(([title, data]) => ({title, data}))
	//
	// 		return storiesWithItems
	// 	}

	renderSeparator = () => (
		<ListSeparator
			spacing={{left: this.props.thumbnail === false ? undefined : 101}}
		/>
	)

	renderItem = ({item}: {item: StoryType}) => (
		<NewsRow
			onPress={this.onPressNews}
			story={item}
			thumbnail={this.props.thumbnail}
		/>
	)

	keyExtractor = (item: StoryType) => item.title

	updateFilter = (filter: FilterType) => {
		this.setState(state => {
			let edited = state.filters.map(f => (f.key !== filter.key ? f : filter))
			return {filters: edited}
		})
	}

	render() {
		const {filters} = this.state
		let {applyFilters, entries} = this.props

		// remove all entries with blank excerpts
		// remove all entries with a <form from the list
		const newsStories = this.props.entries
			.filter(entry => entry.excerpt.trim() !== '')
			.filter(entry => !entry.content.includes('<form'))

		const isOpen = Object.keys(this.state.entries).length !== 0

		// const categories = flatten(entries.map(item => item.categories))
		// const categoryLabels = uniq(categories)

		// let groupedNewsData = this.groupNewsData({
		// 	categoryLabels,
		// 	filters,
		// 	applyFilters,
		// 	entries,
		// })

		let header = (
			<FilterToolbar
				filters={filters}
				isOpen={isOpen}
				onPopoverDismiss={this.updateFilter}
				title={this.props.title}
			/>
		)

		return (
			<FlatList
				ItemSeparatorComponent={this.renderSeparator}
				ListEmptyComponent={<NoticeView text="No news." />}
				ListHeaderComponent={header}
				data={newsStories}
				keyExtractor={this.keyExtractor}
				onRefresh={this.props.onRefresh}
				refreshing={this.props.loading}
				renderItem={this.renderItem}
				style={styles.listContainer}
			/>
		)
	}
}
