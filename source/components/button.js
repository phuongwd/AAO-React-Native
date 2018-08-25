// @flow
import * as React from 'react'
import {StyleSheet, Platform} from 'react-native'
import BasicButton from 'react-native-button'
import noop from 'lodash/noop'
import {material, iOSUIKit} from 'react-native-typography'

import * as c from './colors'

const styles = StyleSheet.create({
	button: {
		backgroundColor: c.buttonBackground,
		alignSelf: 'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginVertical: 10,
		borderRadius: 6,
		overflow: 'hidden',
	},
	disabled: {
		backgroundColor: c.iosLightBackground,
	},
	text: {
		...Platform.select({
			ios: iOSUIKit.calloutWhiteObject,
			android: material.buttonWhiteObject,
		}),
		color: c.buttonForeground,
	},
	textDisabled: {
		color: c.iosDisabledText,
	},
})

type Props = {
	title?: string,
	onPress?: () => any,
	disabled?: boolean,
	buttonStyle?: any,
	textStyle?: any,
}

export function Button({
	title = 'Push me!',
	onPress = noop,
	disabled = false,
	buttonStyle = null,
	textStyle = null,
}: Props) {
	return (
		<BasicButton
			containerStyle={[styles.button, buttonStyle]}
			disabled={disabled}
			disabledContainerStyle={styles.disabled}
			onPress={onPress}
			style={[styles.text, textStyle]}
			styleDisabled={styles.textDisabled}
		>
			{Platform.OS === 'android' ? title.toUpperCase() : title}
		</BasicButton>
	)
}