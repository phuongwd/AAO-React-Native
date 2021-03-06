// @flow
import * as React from 'react'
import {Text, StyleSheet, Platform, FlatList} from 'react-native'
import type {BusTimetableEntry, UnprocessedBusLine, BusSchedule} from './types'
import {
	processBusLine,
	getScheduleForNow,
	getCurrentBusIteration,
	type BusStateEnum,
} from './lib'
import moment from 'moment-timezone'
import find from 'lodash/find'
import findLast from 'lodash/findLast'
import {Separator} from '@frogpond/separator'
import {BusStopRow} from './components/bus-stop-row'
import {ListSectionHeader, ListFooter, ListRow} from '@frogpond/lists'
import {InfoHeader} from '@frogpond/info-header'

const styles = StyleSheet.create({
	separator: {
		marginLeft: 45,
		// erase the gap in the bar caused by the separators' block-ness
		marginTop: -1,
	},
})

const isTruthy = (x) => Boolean(x)
const BusLineSeparator = () => <Separator style={styles.separator} />
const EMPTY_SCHEDULE_MESSAGE = (
	<ListRow>
		<Text>This line is not running today.</Text>
	</ListRow>
)

type Props = {
	+line: UnprocessedBusLine,
	+now: moment,
	+openMap: () => any,
}

type State = {|
	subtitle: string,
	schedule: ?BusSchedule,
	currentBusIteration: null | number,
	status: BusStateEnum,
|}

function startsIn(now, start: ?moment) {
	if (!start) {
		return 'Error'
	}

	let nowCopy = now.clone()
	return `Starts ${nowCopy.seconds(0).to(start)}`
}

function deriveFromProps({line, now}: Props) {
	// Finds the stuff that's shared between FlatList and renderItem
	let processedLine = processBusLine(line, now)

	let scheduleForToday = getScheduleForNow(processedLine.schedules, now)
	let {times, status, index, nextStart} = getCurrentBusIteration(
		scheduleForToday,
		now,
	)

	let isLastBus = index === scheduleForToday.times.length - 1

	let subtitle = 'Error'
	switch (status) {
		case 'none':
			subtitle = 'Not running today'
			break
		case 'before-start':
		case 'between-rounds':
			subtitle = startsIn(now, nextStart)
			break
		case 'after-end':
			subtitle = 'Over for today'
			break
		case 'running': {
			if (isLastBus) {
				subtitle = 'Last Bus'
			} else {
				let first = find(times, isTruthy)
				let last = findLast(times, isTruthy)
				if (!first || !last) {
					subtitle = 'Not running today'
				} else if (now.isBefore(first)) {
					subtitle = startsIn(now, first)
				} else if (now.isAfter(last)) {
					subtitle = 'Running'
				} else {
					subtitle = 'Running'
				}
			}
			break
		}
		default: {
			;(status: empty)
		}
	}

	if (process.env.NODE_ENV !== 'production') {
		// for debugging
		subtitle += ` (${now.format('dd h:mma')})`
	}

	return {
		subtitle: subtitle,
		status: status,
		schedule: scheduleForToday,
		currentBusIteration: index,
	}
}

export class BusLine extends React.Component<Props, State> {
	state = deriveFromProps(this.props)

	static getDerivedStateFromProps(nextProps: Props) {
		return deriveFromProps(nextProps)
	}

	keyExtractor = (item: BusTimetableEntry, index: number) => index.toString()

	renderItem = ({item, index}: {index: number, item: BusTimetableEntry}) => (
		<BusStopRow
			barColor={this.props.line.colors.bar}
			currentStopColor={this.props.line.colors.dot}
			departureIndex={this.state.currentBusIteration}
			isFirstRow={index === 0}
			isLastRow={
				this.state.schedule
					? index === this.state.schedule.timetable.length - 1
					: true
			}
			now={this.props.now}
			status={this.state.status}
			stop={item}
		/>
	)

	render() {
		let {line} = this.props
		let {schedule, subtitle} = this.state

		let INFO_EL = (
			<ListSectionHeader
				subtitle={subtitle}
				title={line.line}
				titleStyle={Platform.OS === 'android' ? {color: line.colors.bar} : null}
			/>
		)

		let LINE_MSG = line.notice || ''
		let FOOTER_MSG =
			'Bus routes and times subject to change without notice\n\nData collected by the humans of All About Olaf'
		let FOOTER_EL = <ListFooter title={FOOTER_MSG} />

		let HEADER_EL = LINE_MSG ? (
			<React.Fragment>
				<InfoHeader message={LINE_MSG} title={`About ${line.line}`} />
				{INFO_EL}
			</React.Fragment>
		) : (
			INFO_EL
		)

		return (
			<FlatList
				ItemSeparatorComponent={BusLineSeparator}
				ListEmptyComponent={EMPTY_SCHEDULE_MESSAGE}
				ListFooterComponent={FOOTER_EL}
				ListHeaderComponent={HEADER_EL}
				data={schedule ? schedule.timetable : []}
				extraData={this.state}
				keyExtractor={this.keyExtractor}
				renderItem={this.renderItem}
			/>
		)
	}
}
