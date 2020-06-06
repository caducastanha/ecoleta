import React, { useState, useEffect } from 'react';
import { Image, ImageBackground, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import styles from './styles';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      }).catch(error => {
        console.log(error)
      })
  });

  useEffect(() => {

    if (selectedUf === '0') {
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);

        setCities(cityNames);
      }).catch(error => {
        console.log(error)
      })
  }, [selectedUf]);

  function handleNavigationToPoints() {
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />

        <Text style={styles.title}>
          Seu marketplace de coleta de resíduos.
        </Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          onValueChange={(value) => {
            setSelectedCity('0')
            return setSelectedUf(value)
          }}
          items={
            ufs.map(uf => (
              { label: uf, value: uf, key: uf }
            ))
          }
          placeholder={{ label: 'Selecione a UF', value: 'uf' }}
          style={{
            inputIOS: styles.input,
            inputAndroid: styles.input,
          }}
        />

        <RNPickerSelect
          onValueChange={(value) => setSelectedCity(value)}
          items={
            cities.map(city => (
              { label: city, value: city, key: city }
            ))
          }
          placeholder={{ label: 'Selecione a Cidade', value: 'city' }}
          style={{
            inputIOS: styles.input,
            inputAndroid: styles.input,
          }}
        />

        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

export default Home;