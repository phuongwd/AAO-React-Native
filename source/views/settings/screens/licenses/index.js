// @flow
import * as React from 'react'
import {View, StyleSheet} from 'react-native'
import {LicensesList} from './list'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import toPairs from 'lodash/toPairs'
import {type LicenseType} from './types'
import {type SortedLicenseType} from './types'
import {type NavigationScreenProp} from 'react-navigation'

import licenseData from '../../../../../docs/licenses.json'

type Props = {
	navigation: NavigationScreenProp<*>,
}

export class LicensesView extends React.Component<Props> {
	static navigationOptions = {
		title: 'Open Source Licenses',
	}

	extractNameFromGithubUrl = (url: string) => {
		if (!url) {
			return null
		}

		const reg = /((https?:\/\/)?(www\.)?github\.com\/)?(@|#!\/)?([A-Za-z0-9_]{1,15})(\/([-a-z]{1,20}))?/iu
		const components = reg.exec(url)

		if (components && components.length > 5) {
			return components[5]
		}
		return null
	}

	sortDataByKey = (data: Array<LicenseType>, key: string) => {
		data.sort((a, b) => {
			return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0
		})
		return data
	}

	sortAndGroupResults = (
		licenses: Array<LicenseType>,
	): Array<SortedLicenseType> => {
		let sorted: Array<LicenseType> = sortBy(licenses, license =>
			license.name.toLowerCase(),
		)
		let byTerm = groupBy(sorted, r => r.username && r.username.toLowerCase())

		let forSectionList = toPairs(byTerm).map(([key, value]) => ({
			title: key,
			data: value,
		}))

		let sortedAgain: Array<{title: string, data: Array<LicenseType>}> = sortBy(
			forSectionList,
			license => license.title,
		)

		return sortedAgain
	}

	render() {
		const {navigation} = this.props

		let data = licenseData.data.filter(item => Object.keys(item).length)
		let nonEmptyData = data[1] // TODO: don't do this

		let licenses: Array<LicenseType> = Object.keys(nonEmptyData).map(key => {
			let {licenses, ...license} = nonEmptyData[key]

			let cleanKey = key.replace(/^@/u, '')
			let [name, version] = cleanKey.split('@')

			let username = this.extractNameFromGithubUrl(license.repository)

			return {
				key,
				username,
				licenses,
				name,
				version,
				...license,
			}
		})

		let sortedGroupedLicenses = this.sortAndGroupResults(licenses)

		return (
			<View style={styles.container}>
				<LicensesList
					licenses={sortedGroupedLicenses}
					navigation={navigation}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
