import { AsyncStorage } from 'react-native';

exports.request = async (method, url, data, token) => {
  let response = await fetch(url, {
    method: method,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": token ? token : null
    },
    body: data ? JSON.stringify(data) : null,
  });

  if(response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw new Error(response.status + " " + response._bodyText);
  }
};

exports.getToken = async() => {
  let accessToken = await AsyncStorage.getItem('accessToken');
  console.log('accessToken', accessToken);
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  return accessToken;
};
