import React, {Component} from 'react';
import axios from 'axios';
import {
  TouchableOpacity,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showSnackbar} from '../redux/actions';

import network from '../helpers/network';

import {Text, MessageCard} from '../components';
import Loader from '../components/Loader';

import Data from './DataCentres';



class Centres extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.page = 1;
    state = {
      isLoading: false,
      centres: [],
    };
  }

  componentDidMount() {
    this.source = axios.CancelToken.source();
    this.fetchCentres(1);
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  static navigationOptions = {
      header: null,
  };

  async fetchCentres(page) {
    const {centres} = this.state;
    if (page === 1) {
      this.setState({isLoading: true});
    }
    try {
      const client = await network();
      const res = await axios.get(
        client(
          `page=${page}`,
          {
            cancelToken: this.source.token,
          },
        ),
      );

      if (res.data.success) {
        this.pages = res.data.pages;
        this.setState({
          centres:
            page === 1 ? res.data.centres : centres.concat(res.data.centres),
        });
      } else {
        this.props.showSnackbar({
          text: res.data.message || 'An unknown error occurred.',
          label: 'OK',
        });
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        this.props.showSnackbar({
          text: 'A network error occurred.',
          label: 'OK',
        });
      }
    } finally {
      this.setState({isLoading: false});
    }
  }

  onEndReached() {
    this.page = this.page + 1;
    if(this.page<=this.pages) {
      this.fetchCentres(this.page);
    }
  }

  renderItem = ({item: message, index}) => {
    const {navigation} = this.props;
    return (
      <MessageCard
        message={message}
        index={index}
        onPress={() => navigation.push('Message', {message})}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    let path1 = "&";
    if (Platform.OS === 'ios' && isLoading && !categories.length) {
      return <Loader loading />;
    }
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}>
          <Text
            bold
            style={{
              marginTop: 14,
              marginLeft: 16,
              fontSize: 14,
            }}>
            Centres
          </Text>
          <Text
            onPress={() => navigation.push('Messages', {
              title: 'All',
              path: `/all?centre=general${path1}`,
            })}
            caption
            medium
            style={{
              marginTop: 14,
              marginLeft: 6,
              marginRight: 15,
            }}>
            All
          </Text>
        </View>
        <SafeAreaView style={styles.flex}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            scrollEnabled
            refreshControl={
              <RefreshControl
                onRefresh={() => this.fetchCentres(1)}
              />
            }
          >
            {Data.map((centre, index) => (
              <View>
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('Messages', {
                      title: centre.name,
                      path: `/all?centre=${centre.slug}${path1}`,
                    })
                  }>
                  <Text
                    caption
                    color="black"
                    numberOfLines={2}
                    style={{
                      paddingTop: 8,
                      paddingBottom: 8,
                      paddingLeft: 12,
                      paddingRight: 12,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 99, 0, 1)',
                      fontWeight: '600',
                      fontSize: 14,
                      marginTop: 14,
                      marginLeft: 16,
                      marginRight: 1.5,
                      marginBottom: 2,
                      borderRadius: 8,
                      textTransform: 'capitalize',
                    }}>
                    {centre.name}
                    
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  columnWrapperStyle: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
  },
  flex: {flex: 1},
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showSnackbar,
    },
    dispatch,
  );

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Centres);
