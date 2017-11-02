// @flow
import React from 'react'
import {ScrollView, Image, StyleSheet, Text} from 'react-native'
import * as Icons from 'react-native-alternate-icons'
import {Section, Cell} from 'react-native-tableview-simple'
import {Column} from '../components/layout'
import includes from 'lodash/includes'
import * as c from '../colors'

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
  },
  icon: {
    width: 16,
    height: 16,
    borderColor: c.black,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
})

const icons = [
  {
    type: 'default',
    src: require('../../../images/about/IconTrans.png'),
    title: 'Old Main',
  },
  {
    type: 'icon_type_windmill',
    src: require('../../../ios/AllAboutOlaf/windmill.png'),
    title: 'Wind Turbine (Big Ole)',
  },
]

export default class IconSettingsView extends React.PureComponent {
  static navigationOptions = {
    title: 'App Icon',
  }

  state: {
    iconType: string,
  } = {
    iconType: '',
  }

  componentWillMount() {
    this.getIcon()
  }

  setIcon(iconType: string) {
    if (iconType === 'default') {
      Icons.reset()
    } else {
      Icons.setIconName(iconType)
    }

    this.getIcon()
  }

  getIcon() {
    Icons.getIconName(name => this.setState(() => ({iconType: name})))
  }

  render() {
    return (
      <ScrollView>
        <Section header={'CHANGE YOUR APP ICON'} separatorInsetLeft={58}>
          {icons.map(val => (
            <Cell
              key={val.title}
              onPress={() => this.setIcon(val.type)}
              disableImageResize={false}
              image={
                val.src ? (
                  <Image style={styles.icon} source={val.src} />
                ) : (
                  undefined
                )
              }
              accessory={
                includes(this.state.iconType, val.type)
                  ? 'Checkmark'
                  : undefined
              }
              cellStyle="RightDetail"
              cellContentView={
                <Column style={styles.content}>
                  <Text style={styles.title}>{val.title}</Text>
                </Column>
              }
            />
          ))}
        </Section>
      </ScrollView>
    )
  }
}
