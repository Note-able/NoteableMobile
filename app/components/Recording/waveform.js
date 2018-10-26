import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

Animatable.initializeRegistryWithDefinitions({
  waveform: {
    from: { maxHeight: 0, width: 0 },
    to: {
      maxHeight: '100%', width: 2.5,
    },
  },
});


class ItemView extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.index !== nextProps.index || this.props.item !== nextProps.item;
  }

  render() {
    let height;
    if (this.props.item < -50 || this.props.item === 0) {
      height = 3;
    } else if (this.props.item > 5) {
      height = 100;
    } else {
      height = ((((10 * this.props.item) + 500) ** 2) / 2500) + 3; // Math.max(Math.abs(item.currentMetering + 50) * 2, 0);
    }

    const margin = 150 - height;

    return <View style={{ width: 2, marginRight: 4, marginVertical: margin / 2, backgroundColor: '#31CB94', height, borderRadius: 3 }} />;
  }
}

export default class Waveform extends PureComponent {
  static propTypes = {
    waveData: PropTypes.number,
  }

  state = {
    buffer: [this.props.waveData],
    data: Array.from(new Array(16), () => this.props.waveData),
  }

  static getDerivedStateFromProps(props, state) {
    if (props.waveData === state.buffer[0]) {
      return null;
    }

    console.log(props.waveData);
    const buffer = [props.waveData, ...state.buffer].slice(0, 8);
    const sliceA = [...buffer].reverse();

    return {
      buffer,
      data: [...sliceA, props.waveData, ...sliceA.reverse()],
    };
  }

  renderItem = ({ item, index }) => <ItemView item={item} index={index} />

  setRef = (ref) => { this.scroll = ref; };

  scrollEnd = () => {
    if (this.scroll) {
      this.scroll.scrollToEnd({ animated: false });
    }
  }

  render() {
    return (
      <View style={{ height: 100, width: '100%', flexDirection: 'column', overflow: 'hidden' }}>
        <FlatList
          horizontal
          ref={this.setRef}
          onContentSizeChange={this.scrollEnd}
          contentContainerStyle={{ height: 100, width: '100%', justifyContent: 'center', alignItems: 'center' }}
          getItemLayout={(data, index) => (
            { length: 2.5, offset: 6 * index, index }
          )}
          data={this.state.data}
          refreshing={false}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => `waveform-${index}`}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

// <View style={{ height: 100, width: '100%', flexDirection: 'column', overflow: 'hidden' }}>
//         <FlatList
//           horizontal
//           ref={this.setRef}
//           onContentSizeChange={this.scrollEnd}
//           contentContainerStyle={{ height: 100 }}
//           getItemLayout={(data, index) => (
//             { length: 2.5, offset: 6 * index, index }
//           )}
//           data={this.props.waveData}
//           refreshing={false}
//           removeClippedSubviews={false}
//           keyExtractor={(item, index) => index}
//           renderItem={this.renderItem}
//         />
//       </View>
