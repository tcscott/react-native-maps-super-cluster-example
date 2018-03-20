
// @flow
'use-strict'

import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Marker } from 'react-native-maps'
import ClusteredMapView from 'react-native-maps-super-cluster'
import { generateRandomPoints, generateRandomPoint } from './generator'  

const italyCenterLatitude = 41.8962667,
      italyCenterLongitude = 11.3340056,
      radius = 600000 
export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      pins: []
    }

    this.reload = this.reload.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.renderMarker = this.renderMarker.bind(this)
  }

  componentDidMount() {
    this.reload()
  }

  reload = () => {
    const pins = generateRandomPoints({latitude: italyCenterLatitude, longitude: italyCenterLongitude}, radius, 50, this.state.pins.length)
    this.setState({ pins })
  }

  loadMore = () => {
    const pins = generateRandomPoints({latitude: italyCenterLatitude, longitude: italyCenterLongitude}, radius, 50, this.state.pins.length)
    this.setState({ pins: this.state.pins.concat(pins) })
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
          coordinate = cluster.coordinate,
          clusterId = cluster.clusterId

    return (
      <Marker identifier={`cluster-${clusterId}`} coordinate={coordinate} onPress={onPress}>
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>
            {pointCount}
          </Text>
        </View>
      </Marker>
    )
  }

  renderMarker = (pin) => {
    return (
      <Marker identifier={`pin-${pin.id}`} key={pin.id} coordinate={pin.location} />
    )
  }

  render() {
    return (
      <View style={styles.container} style={{flex: 1}}>

        {/* Cluster Map Example */}
        <ClusteredMapView
          style={{flex: 1}}
          data={this.state.pins}
          renderMarker={this.renderMarker}
          renderCluster={this.renderCluster}
          initialRegion={{latitude: italyCenterLatitude, longitude: italyCenterLongitude, latitudeDelta: 12, longitudeDelta: 12 }}>
          {/* 
            Markers rendered as children of ClusteredMapView are not taken in account by the clustering feature,
            they will just act as they were rendered within a normal react-native-maps instance
          */}
          <Marker coordinate={{ latitude: 44.710968, longitude: 10.640131 }} pinColor={'#65bc46'} />
        </ClusteredMapView>

        {/* Header - Control Test Bar */}
        <View style={styles.controlBar}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.reload}>
            <Text style={styles.text}>Reload</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.loadMore}>
            <Text style={styles.text}>Load more</Text>
          </TouchableOpacity>
        </View>

        <Image 
          source={require('./simbol.png')}
          style={{position: 'absolute', bottom: 8, right: 8, width: 64, height: 64}}
          resizeMode='contain' />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  clusterContainer: {
    width: 30,
    height: 30,
    padding: 6,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#65bc46',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  clusterText: {
    fontSize: 13,
    color: '#65bc46',
    fontWeight: '500',
    textAlign: 'center',
  },
  controlBar: {
    top: 24,
    left: 25,
    right: 25,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between', 
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  },
})