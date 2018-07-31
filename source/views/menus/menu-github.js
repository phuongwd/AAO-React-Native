// @flow
import * as React from 'react'
import LoadingView from '../components/loading'
import {NoticeView} from '../components/notice'
import {FancyMenu} from './components/fancy-menu'
import type {TopLevelViewPropsType} from '../types'
import sample from 'lodash/sample'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'
import moment from 'moment'
import type {
	MasterCorIconMapType,
	MenuItemType,
	ProcessedMealType,
	MenuItemContainerType,
} from './types'
import {upgradeMenuItem, upgradeStation} from './lib/process-menu-shorthands'

import {aaoGh} from '@app/fetch'
import {age} from '@frogpond/age'
import {Timer} from '@frogpond/timer'
import {DataFetcher} from '@frogpond/data-fetcher'

type Props = TopLevelViewPropsType & {
	name: string,
	loadingMessage: Array<string>,
}

type DataFetcherProps = {
	menu: {
		data: {
			foodItems: Array<MenuItemType>,
			stationMenus: Array<ProcessedMealType>,
			corIcons: MasterCorIconMapType,
		},
		error: ?Error,
		loading: boolean,
		refresh: () => any,
	},
}

export class GitHubHostedMenu extends React.Component<Props> {
	renderMenu = ({menu}: DataFetcherProps) => {
		let {refresh, data} = menu

		let {foodItems, corIcons, stationMenus} = data
		foodItems = foodItems.map(upgradeMenuItem).map(item => [item.id, item])

		let food: MenuItemContainerType = fromPairs(foodItems)
		stationMenus = stationMenus.map((menu, index) => ({
			...upgradeStation(menu, index),
			items: filter(food, item => item.station === menu.label).map(
				item => item.id,
			),
		}))

		let meals = [
			{
				label: 'Menu',
				stations: stationMenus,
				starttime: '0:00',
				endtime: '23:59',
			},
		]

		return (
			<Timer
				interval={age.minute(1)}
				render={ts => (
					<FancyMenu
						foodItems={food}
						meals={meals}
						menuCorIcons={corIcons}
						name={this.props.name}
						navigation={this.props.navigation}
						now={moment(ts)}
						onRefresh={refresh}
					/>
				)}
			/>
		)
	}

	render() {
		let menu = aaoGh({file: 'pause-menu.json'})

		return (
			<DataFetcher
				error={NoticeView}
				loading={() => <LoadingView text={sample(this.props.loadingMessage)} />}
				render={this.renderMenu}
				resources={{menu}}
			/>
		)
	}
}
