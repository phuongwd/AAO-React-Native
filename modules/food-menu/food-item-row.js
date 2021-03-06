// @flow
import * as React from 'react'
import {View, StyleSheet, Platform} from 'react-native'
import {DietaryTags} from './dietary-tags'
import {Row, Column} from '@frogpond/layout'
import {ListRow, Detail, Title} from '@frogpond/lists'
import type {MenuItemType, MasterCorIconMapType} from './types'
import * as c from '@frogpond/colors'
import Icon from 'react-native-vector-icons/Ionicons'

const specialsIcon = Platform.OS === 'ios' ? 'ios-star' : 'md-star'

type FoodItemPropsType = {|
	corIcons: MasterCorIconMapType,
	data: MenuItemType,
	style?: any,
	badgeSpecials?: boolean,
	spacing: {left: number},
	onPress: () => any,
|}

export function FoodItemRow({
	data,
	corIcons,
	badgeSpecials = true,
	onPress,
	...props
}: FoodItemPropsType) {
	let {left = 0} = props.spacing
	return (
		<ListRow
			arrowPosition="center"
			fullWidth={true}
			onPress={onPress}
			style={[styles.container, props.style]}
		>
			<Row alignItems="center">
				<View style={[styles.badge, {width: left}]}>
					{badgeSpecials && data.special ? (
						<Icon name={specialsIcon} style={styles.badgeIcon} />
					) : null}
				</View>

				<Column flex={1}>
					<Title bold={false}>{data.label}</Title>
					{data.description ? <Detail>{data.description}</Detail> : null}
				</Column>

				<DietaryTags
					corIcons={corIcons}
					dietary={data.cor_icon}
					style={styles.iconContainer}
				/>
			</Row>
		</ListRow>
	)
}

const styles = StyleSheet.create({
	container: {
		minHeight: 36,
		flexDirection: 'row',
		alignItems: 'center',
	},
	badge: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	badgeIcon: {
		fontSize: 16,
		color: c.iosDisabledText,
	},
	iconContainer: {
		marginLeft: 10,
		marginRight: 4,
	},
})
