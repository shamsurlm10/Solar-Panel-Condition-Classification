import { Button } from '@react-native-material/core';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

const image = {
  uri: 'https://avatars.mds.yandex.net/i?id=dfcb735fd16a96e869fac89ee101ff77-4011861-images-thumbs&n=13',
};

const App = () => {
  const initialState = {
    photo: '',
    image: null,
  };
  const initialResult = {
    label: null,
    power: null,
  };

  const [state, setState] = useState(initialState);
  const [lux, setLux] = useState(null);
  const [time, setTime] = useState(null);
  const [temp, setTemp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(initialResult);

  const option = {
    mediaType: 'photo',
    quality: 1,
    saveToPhotos: true,
  };

  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const sendFile = async () => {
    setIsLoading(true);
    if (state.photo) {
      let formData = new FormData();
      formData.append('time', time);
      formData.append('lux', lux);
      formData.append('temp', temp);
      formData.append('file', {
        name: state.image.fileName,
        type: state.image.type,
        uri:
          Platform.OS === 'android'
            ? state.image.uri
            : state.image.uri.replace('file://', ''),
      });

      const url = 'http://192.168.0.107:5000/predict';
      axios
        .post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => response.data)
        .then(data => {
          if (data.label === null) {
            const error = new Error('Invalid inputs');
            error.status = '400';
            throw error;
          }
          setResult({
            label: data.label,
            power: data.power,
          });
          setIsLoading(false);
        })
        .catch(error => {
          const status_code = error.status || '400';
          showToast(
            'error',
            status_code,
            error.message || 'Unexpected error occurred',
          );
          setIsLoading(false);
        });
    }
  };

  const clear = () => {
    setState({photo: ''});
    setTemp('');
    setTime(null);
    setLux('');
    showToast('info', 'Cleared', 'The picture has been cleared');
  };

  const openCamera = () => {
    launchCamera(option, res => {
      if (res.didCancel) {
        showToast('error', 'Canceled', 'Take a picture is canceled');
      } else if (res.errorCode) {
        showToast('error', res.errorCode, 'Error while open camera');
      } else {
        setState({
          photo: res.assets[0].uri,
          image: res.assets[0],
        });
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary(option, res => {
      if (res.didCancel) {
        showToast('error', 'Canceled', 'Gallery open canceled');
      } else if (res.errorCode) {
        showToast('error', res.errorCode, 'Error while open camera');
      } else {
        setState({
          photo: res.assets[0].uri,
          image: res.assets[0],
        });
      }
    });
  };

  const resetValues = () => {
    setState(initialState);
    setLux(null);
    setTime(null);
    setTemp(null);
    setIsLoading(false);
    setResult(initialResult);
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={{margin: 25}}>
          <Text style={styles.title}>Solar Panel Power Prediction</Text>
        </View>

        {isLoading ? (
          <View>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            {result.label ? (
              <View style={styles.result}>
                <Text style={styles.labelText}>{result.label}</Text>
                <Text style={styles.powerText}>Power: {result.power}</Text>
              </View>
            ) : (
              <>
                <View style={{margin: 5, color: '#f9d3b4'}}>
                  <Text style={{color: '#f9d3b4', paddingLeft: 4}}>LUX</Text>
                  <TextInput
                    style={{color: '#f9d3b4'}}
                    placeholder="Enter lux value"
                    placeholderTextColor="#5E503A"
                    value={lux}
                    onChangeText={newText => setLux(newText)}
                  />
                </View>
                <View style={{margin: 5, color: '#f9d3b4'}}>
                  <Text style={{color: '#f9d3b4', paddingLeft: 4}}>
                    Temperature
                  </Text>
                  <TextInput
                    style={{color: '#f9d3b4'}}
                    placeholder="Enter temperature"
                    placeholderTextColor="#5E503A"
                    value={temp}
                    onChangeText={newText => setTemp(newText)}
                  />
                </View>
                <View style={{color: '#f9d3b4', marginBottom: 5}}>
                  <Picker
                    selectedValue={time}
                    style={{color: '#f9d3b4'}}
                    onValueChange={(itemValue, _itemIndex) =>
                      setTime(itemValue)
                    }>
                    <Picker.Item
                      enabled={false}
                      label="Select Time"
                      value="0"
                    />
                    <Picker.Item label="Morning" value="1" />
                    <Picker.Item label="Noon" value="2" />
                    <Picker.Item label="Afternoon" value="3" />
                  </Picker>
                </View>
              </>
            )}
          </>
        )}

        {state.photo == '' ? (
          <ImageBackground
            source={image}
            resizeMode="cover"
            style={styles.image}>
            <Text style={styles.text}>No image selected</Text>
          </ImageBackground>
        ) : (
          <>
            <Image source={{uri: state.photo}} style={styles.image} />
            <>
              {!result.label && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 200,
                    alignSelf: 'center',
                  }}>
                  <Button
                    style={styles.imageControlBtn}
                    onPress={clear}
                    title="Clear"
                    color="error"
                    disabled={isLoading}
                  />
                  <Button
                    style={styles.imageControlBtn}
                    onPress={sendFile}
                    title="Submit"
                    color="primary"
                  />
                </View>
              )}
            </>
          </>
        )}
        {result.label ? (
          <Button
            style={{
              marginTop: 10,
              width: 200,
              alignSelf: 'center',
              padding: 5,
            }}
            onPress={resetValues}
            title="Reset Values"
            color="error"
          />
        ) : (
          <>
            {!isLoading && (
              <>
                <Button
                  style={styles.openCamGalleryBtn}
                  onPress={openCamera}
                  title="Open Camera"
                  color="secondary"
                />
                <Button
                  style={styles.openCamGalleryBtn}
                  onPress={openGallery}
                  title="Open Gallery"
                  color="secondary"
                />
              </>
            )}
          </>
        )}
      </View>
      <Toast />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a1b',
    color: '#f9d3b4',
  },
  image: {
    height: 256,
    width: 256,
    alignSelf: 'center',
    margin: 5,
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    lineHeight: 70,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#f9d3b4',
  },
  loadingText: {
    color: '#fff',
    lineHeight: 80,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#000000c0',
    marginBottom: 15,
  },
  result: {
    color: '#f9d3b4',
    marginBottom: 15,
  },
  labelText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  powerText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  imageControlBtn: {
    marginTop: 5,
    width: 98,
    justifyContent: 'center',
  },
  openCamGalleryBtn: {
    marginTop: 5,
    width: 200,
    alignSelf: 'center',
    backgroundColor: '#f9d3b4',
    padding: 5,
  },
  input: {
    color: '#fff',
  },
});
