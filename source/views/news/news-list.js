// @flow
import * as React from 'react'
import {StyleSheet, SectionList} from 'react-native'
import * as c from '@frogpond/colors'
import type {StoryType} from './types'
import {ListSeparator, ListSectionHeader} from '@frogpond/lists'
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

	groupNewsData = (args: {
		filters: Array<FilterType>,
		categoryLabels: Array<String>,
		newsStories: Array<StoryType>,
		applyFilters: FilterFunc,
	}) => {
		let {filters, categoryLabels, newsStories, applyFilters} = args

		let dereferenceNewsStories = stories =>
			stories.filter(item => item && applyFilters(filters, item))

		let allCategoriesWithStoriesWithItems: Array<{
			title: string,
			data: Array<StoryType>,
		}> = categoryLabels
			// We're grouping the story entries in a [label, Array<items>] tuple.
			.map(category => [category, dereferenceNewsStories(newsStories)])
			// We only want to show categories with at least one item in them
			.filter(([_, items]) => items.length)
			// We need to map the tuples into objects for SectionList // todo: ???
			.map(([title, data]) => ({title, data}))

		return allCategoriesWithStoriesWithItems
	}

	renderSeparator = () => (
		<ListSeparator
			spacing={{left: this.props.thumbnail === false ? undefined : 101}}
		/>
	)

	renderSectionHeader = ({section: {title}}: any) => {
		return <ListSectionHeader title={title} />
	}

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

		const categoryLabels = uniq(
			flatten(newsStories.map(item => item.categories)),
		)

		let groupedNewsData = this.groupNewsData({
			filters,
			categoryLabels,
			newsStories,
			applyFilters,
		})

		let header = (
			<FilterToolbar
				filters={filters}
				isOpen={isOpen}
				onPopoverDismiss={this.updateFilter}
				title={this.props.title}
			/>
		)

		return (
			<SectionList
				ItemSeparatorComponent={this.renderSeparator}
				ListEmptyComponent={<NoticeView text="No news." />}
				ListHeaderComponent={header}
				data={filters}
				keyExtractor={this.keyExtractor}
				onRefresh={this.props.onRefresh}
				refreshing={this.props.loading}
				renderItem={this.renderItem}
				renderSectionHeader={this.renderSectionHeader}
				sections={(groupedNewsData: any)}
				style={styles.listContainer}
			/>
		)
	}
}
