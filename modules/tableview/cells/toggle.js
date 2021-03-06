// @flow
import * as React from 'react'
import {Switch} from 'react-native'
import {Cell} from 'react-native-tableview-simple'
import {type AppTheme} from '@frogpond/app-theme'
import {useTheme} from '@frogpond/app-theme'

type PropsType = {
	label: string,
	value: boolean,
	onChange: (val: boolean) => any,
	detail?: string,
	disabled?: boolean,
}

export function CellToggle(props: PropsType) {
	let theme: AppTheme = useTheme()

	let {value, onChange, label, detail, disabled} = props

	let toggle = (
		<Switch
			disabled={disabled}
			onValueChange={onChange}
			trackColor={{true: theme.switchTintOn, false: theme.switchTintOff}}
			value={value}
		/>
	)

	return (
		<Cell
			cellAccessoryView={toggle}
			cellStyle={detail ? 'Subtitle' : 'Basic'}
			detail={detail}
			title={label}
		/>
	)
}
