// @flow

import * as React from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import {Touchable} from '@frogpond/touchable'
import * as c from '@frogpond/colors'
import {images as webcamImages} from '../../../../images/webcams'
import {trackedOpenUrl} from '@frogpond/open-url'
import LinearGradient from 'react-native-linear-gradient'
import type {Webcam} from './types'

const transparentPixel = require('../../../../images/transparent.png')

type Props = {
	webcam: Webcam,
	viewportWidth: number,
}

export class StreamThumbnail extends React.PureComponent<Props> {
	handlePress = () => {
		let {name, pageUrl} = this.props.webcam
		trackedOpenUrl({url: pageUrl, id: `${name}WebcamView`})
	}

	render() {
		let {viewportWidth, webcam} = this.props
		let {name, thumbnail, accentColor, textColor, thumbnailUrl} = webcam

		let [r, g, b] = accentColor
		let baseColor = `rgba(${r}, ${g}, ${b}, 1)`
		let startColor = `rgba(${r}, ${g}, ${b}, 0.1)`

		let width = viewportWidth / 2 - CELL_MARGIN * 1.5
		let cellRatio = 2.15625
		let height = width / cellRatio

		let img = thumbnailUrl
			? {uri: thumbnailUrl}
			: webcamImages.has(thumbnail)
			? webcamImages.get(thumbnail)
			: transparentPixel

		return (
			// do not remove this View; it is needed to prevent extra highlighting
			<View style={styles.cell}>
				<Touchable
					highlight={true}
					onPress={this.handlePress}
					style={{width, height}}
					underlayColor={baseColor}
				>
					<Image
						accessibilityIgnoresInvertColors={true}
						resizeMode="cover"
						source={img}
						style={[StyleSheet.absoluteFill, {width, height}]}
					/>

					<View style={styles.titleWrapper}>
						<LinearGradient
							colors={[startColor, baseColor]}
							locations={[0, 0.8]}
						>
							<Text style={[styles.titleText, {color: textColor}]}>{name}</Text>
						</LinearGradient>
					</View>
				</Touchable>
			</View>
		)
	}
}

const CELL_MARGIN = 10
const styles = StyleSheet.create({
	cell: {
		overflow: 'hidden',
		margin: CELL_MARGIN / 2,
		borderRadius: 6,
	},
	titleWrapper: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	titleText: {
		backgroundColor: c.transparent,
		fontSize: 12,
		paddingHorizontal: 4,
		paddingVertical: 2,
		textAlign: 'center',
		fontWeight: 'bold',
	},
})
