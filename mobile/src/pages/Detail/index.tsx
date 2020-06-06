import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import api from '../../services/api';

import styles from './styles';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    name: string;
    image: string;
    city: string;
    uf: string;
    email: string;
    whatsapp: string;
  }
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState<Data>({} as Data)
  const { point_id } = route.params as Params;

  useEffect(() => {
    api.get(`/points/${point_id}`)
      .then(response => {
        setData(response.data);
      })
  }, []);

  function handleNavigationBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de residuos',
      recipients: [data.point.email],
    })
  }
  
  function handleWhatsapp(){
    Linking.openURL(`whatsapp://send?phone=55${data.point.whatsapp}&text=Tenho interesse na coleta de residuos`)
  }

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{ uri: data.point.image }}
        />

        <Text style={styles.pointName}>
          {data.point.name}
        </Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>
            Endereço
        </Text>
          <Text style={styles.addressContent} >
            {data.point.city}, {data.point.uf}
          </Text>
        </View>
      </View>

      <View style={styles.footer} >
        <RectButton style={styles.button} onPress={handleWhatsapp} >
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>
            Whatsapp
          </Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail} >
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>
            Email
          </Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

export default Detail;