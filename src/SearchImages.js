import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import {debounce} from 'underscore';
import CustomSearchBar from './CustomSearchBar';
import AppConstant from './AppConstant';

export default class SearchImages extends Component {
  constructor(props) {
    super(props);
    this.timeout = 0;
    this.state = {
      isLoading: true,
      responseList: [],
      fetchingStatus: false,
      setOnLoad: false,
      search: '',
    };

    this.page = 0;
  }

  componentDidMount() {
    // this.page = this.page + 1;
    if (this.state.search.length > 0) {
      this.apiCall();
    }
  }

  apiCall = () => {
    //var that = this;
    this.page = this.page + 1;
    this.setState({fetching_Status: true});
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=118041da9eb023eb04b34d9ef78d3c48&tags=${this.state.search}&per_page=20&page=${this.page}&format=json&nojsoncallback=1`;
    //const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=4b6251dee0b9d8f5d0d4ebe152713892&tags=${this.state.search}&per_page=21&page=${this.page}&format=json&nojsoncallback=1`;
    fetch(url + this.page)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (
          responseJson != undefined &&
          responseJson.photos != undefined &&
          responseJson.photos.photo != undefined
        ) {
          if (this.page > 1) {
            this.setState({
              responseList: [
                ...this.state.responseList,
                ...responseJson.photos.photo,
              ],
              isLoading: false,
              setOnLoad: true,
            }); //another array
          } else {
            this.setState({
              responseList: responseJson.photos.photo,
              isLoading: false,
              setOnLoad: true,
            });
          }
        } else {
          this.setState({
            responseList: [],
            isLoading: false,
            setOnLoad: true,
            fetching_Status: false,
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({setOnLoad: false, fetching_Status: false});
      });
  };

  BottomView = () => {
    return (
      <View style={styles.bottomViewLoaderStyle}>
        {!this.state.isLoading ? (
          <ActivityIndicator size="large" color={AppConstant.COLORS.RED} />
        ) : null}
      </View>
    );
  };

  handleEndReach = debounce(async () => {
    this.apiCall();
  }, 250);

  updateSearch = search => {
    this.setState({search: search});
    this.page = 0;
    this.state.responseList = [];
    if (search.length > 0) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.apiCall();
      }, 500);
    } else {
      this.state.responseList = [];
    }
  };

  updateMessage = message => this.setState({message});

  render() {
    return (
      <SafeAreaView style={styles.MainContainer}>
        <CustomSearchBar
          autoCapitalize={'none'}
          reference={ref => {
            this.textInputRef = ref;
          }}
          placeholder="Search"
          onChangeText={text => {
            this.updateSearch(text);
          }}
        />

        <FlatList
          style={styles.flatListStyle}
          keyExtractor={(item, index) => index}
          numColumns={3}
          data={this.state.responseList}
          initialNumToRender={4}
          maxToRenderPerBatch={1}
          onEndReachedThreshold={0.5}
          onEndReached={() => this.handleEndReach()}
          renderItem={({item, index}) => (
            <Image
              source={{
                uri: `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`,
              }}
              style={styles.imageStyle}
            />
          )}
          ListFooterComponent={this.BottomView}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  imageStyle: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: AppConstant.COLORS.WHITE,
    shadowColor: AppConstant.COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    width: (Dimensions.get('window').width - 40) / 3,
    height: 200,
    marginRight: 10,
    marginBottom: 10,
  },
  bottomViewLoaderStyle: {
    height: 50,
    marginTop: 10,
  },
  flatListStyle: {
    marginLeft: 10,
  },
});
