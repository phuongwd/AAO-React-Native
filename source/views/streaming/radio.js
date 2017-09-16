// @flow
/**
 * All About Olaf
 * KSTO page
 */

import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  Image,
} from 'react-native'
import * as c from '../components/colors'
import Icon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'
import {Touchable} from '../components/touchable'
import {TabBarIcon} from '../components/tabbar-icon'

const kstoStream = 'https://cdn.stobcm.com/radio/ksto1.stream/master.m3u8'
const image = require('../../../images/streaming/ksto/ksto-logo.png')

type State = {
  refreshing: boolean,
  paused: boolean,
  streamError: ?Object,
  metadata: Object[],
}

export default class KSTOView extends React.PureComponent<void, void, State> {
  static navigationOptions = {
    tabBarLabel: 'KSTO',
    tabBarIcon: TabBarIcon('radio'),
  }

  state = {
    refreshing: false,
    paused: true,
    streamError: null,
    metadata: [],
  }

  changeControl = () => {
    this.setState(state => ({paused: !state.paused}))
  }

  // error from react-native-video
  onError = (e: any) => {
    this.setState(() => ({streamError: e, paused: true}))
    console.log(e)
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Logo />
          <PlayPauseButton
            onPress={this.changeControl}
            paused={this.state.paused}
          />
          <Title />

          {!this.state.paused
            ? <Video
                source={{uri: kstoStream}}
                playInBackground={true}
                playWhenInactive={true}
                paused={this.state.paused}
                onError={this.onError}
              />
            : null}
        </View>
      </ScrollView>
    )
  }
}

const Logo = () => {
  const viewport = Dimensions.get('window')
  const style = {
    maxWidth: viewport.width / 1.2,
    maxHeight: viewport.height / 2.0,
  }
  return (
    <View style={styles.wrapper}>
      <Image source={image} style={style} />
    </View>
  )
}

const Title = () => {
  const style = {fontSize: Dimensions.get('window').height / 30}
  return (
    <View style={styles.container}>
      <Text selectable={true} style={[styles.heading, style]}>
        St. Olaf College Radio
      </Text>
      <Text selectable={true} style={[styles.subHeading, style]}>
        KSTO 93.1 FM
      </Text>
    </View>
  )
}

class PlayPauseButton extends React.PureComponent {
  props: {
    paused: boolean,
    onPress: () => any,
  }

  render() {
    const {paused, onPress} = this.props
    return (
      <Touchable
        style={buttonStyles.button}
        hightlight={false}
        onPress={onPress}
      >
        <View style={buttonStyles.buttonWrapper}>
          <Icon
            style={buttonStyles.icon}
            name={paused ? 'ios-play' : 'ios-pause'}
          />
          <Text style={buttonStyles.action}>
            {paused ? 'Listen' : 'Pause'}
          </Text>
        </View>
      </Touchable>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wrapper: {
    padding: 10,
  },
  heading: {
    marginTop: 10,
    color: c.kstoPrimaryDark,
    fontWeight: '500',
  },
  subHeading: {
    marginTop: 5,
    marginBottom: 10,
    color: c.kstoPrimaryDark,
    fontWeight: '300',
  },
})

const landscape = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
  },
  logoWrapper: {
    flex: 0,
  },
})

const buttonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: c.denim,
    width: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  icon: {
    color: c.white,
    fontSize: 30,
  },
  action: {
    color: c.white,
    paddingLeft: 10,
    paddingTop: 7,
    fontWeight: '900',
  },
})
