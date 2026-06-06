import {
    StyleSheet,
    Text,
    View,
    Button,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    SafeAreaView,
    Alert,
} from 'react-native';
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import ImageContainer from '../Components/ImageContainer';
import CartItems from '../Components/CartItems';
import Resueltas from '../Components/obras/Resueltas';

function ObrasTerminadas() {
    const navigation = useNavigation();
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View>
                <View style={{ position: 'relative', marginTop: 40}}>
                    <TouchableOpacity
                        style={styles.backIcon}
                        onPress={()=> navigation.goBack()}
                    >
                        <AntDesign name="arrowleft" size={30} color="#ce112d" />
                    </TouchableOpacity>

                </View>
                <View style={{
                    alignItems: 'center',
                    marginTop: 50
                }}>
                    <Text style={styles.text_header}>Obras terminadas</Text>
                </View>
                <Resueltas/>
            </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    editIcon: {
      zIndex: 1,
      color: 'white',
      position: 'absolute',
      right: 2,
      margin: 15,
    },
    backIcon: {
      zIndex: 1,
      color: 'white',
      position: 'absolute',
      left: 2,
      margin: 15,
    },
    avatar: {
      borderRadius: 100,
      marginTop: -250,
      // marginLeft: 105,
      backgroundColor: 'white',
      height: 200,
      width: 200,
      padding: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      elevation: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // 420475
    nameText: {
      color: 'black',
      fontSize: 28,
  
      fontStyle: 'normal',
      fontFamily: 'Open Sans',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    bookCountMain: {
      borderColor: '#b0b0b0',
      borderWidth: 1,
      marginTop: 18,
      marginHorizontal: 20,
  
      borderRadius: 20,
      flexDirection: 'row',
      width: '88%',
    },
    bookCount: {
      width: '50%',
      borderColor: '#b0b0b0',
      borderRightWidth: 1,
      flexDirection: 'column',
      paddingHorizontal: 10,
      paddingVertical: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bookCountNum: {
      color: '#5D01AA',
      fontSize: 34,
      fontWeight: '800',
    },
    bookCountText: {color: '#b3b3b3', fontSize: 14, fontWeight: '500'},
    infoMain: {
      marginTop: 10,
    },
    infoCont: {
      width: '100%',
      flexDirection: 'row',
    },
    infoIconCont: {
      justifyContent: 'center',
      height: 40,
      width: 40,
      borderRadius: 20,
  
      alignItems: 'center',
      elevation: -5,
      borderColor: 'black',
      backgroundColor: 'black',
    },
  
    infoText: {
      width: '80%',
      flexDirection: 'column',
      marginLeft: 25,
      borderBottomWidth: 1,
      paddingBottom: 10,
      borderColor: '#e6e6e6',
    },
    infoSmall_Text: {
      fontSize: 13,
      color: '#b3b3b3',
      fontWeight: '500',
    },
    infoLarge_Text: {
      color: 'black',
      fontSize: 18,
      fontWeight: '600',
    },
    booksUploadedMain: {
      paddingHorizontal: 10,
      paddingBottom: 30,
      marginTop: 20,
    },
    flatlistDiv: {
      borderRadius: 15,
      paddingHorizontal: 10,
    },
    booksUploadedText: {
      fontSize: 26,
      color: 'black',
      fontWeight: '700',
      paddingLeft: 20,
      paddingBottom: 8,
    },
    booksUploadedCard: {
      flexDirection: 'row',
      width: '100%',
      marginTop: 9,
      marginBottom: 9,
  
      backgroundColor: '#f2f2f2',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 15,
      elevation: 3,
    },
    booksUploadedImgDiv: {
      width: '28%',
    },
    booksUploadedImg: {
      width: '100%',
      height: 120,
      borderRadius: 15,
    },
    cardMidDiv: {
      paddingHorizontal: 10,
      width: '55%',
      position: 'relative',
    },
    approvedText: {
      fontSize: 12,
      color: '#0d7313',
      fontWeight: '600',
      marginLeft: 5,
    },
    cardBookNameText: {
      fontSize: 24,
      color: 'black',
      fontWeight: '700',
      marginTop: 2,
    },
    cardBookAuthor: {
      fontSize: 14,
      color: 'black',
      fontWeight: '600',
      marginTop: 1,
    },
    cardRating: {
      position: 'absolute',
      bottom: 0,
      paddingHorizontal: 10,
      flexDirection: 'row',
    },
    cardRatingCount: {
      fontSize: 14,
      marginTop: -2,
      paddingLeft: 4,
      color: '#303030',
    },
    cardEditDiv: {
      width: '17%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardEditBtn: {
      height: 44,
      width: 44,
      backgroundColor: '#ce112d',
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footer: {
      padding: 10,
      justifyContent: 'center',
  
      flexDirection: 'row',
    },
    loadMoreBtn: {
      padding: 10,
      backgroundColor: '#ce112d',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      paddingHorizontal: 20,
    },
    btnText: {
      color: 'white',
      fontSize: 15,
      textAlign: 'center',
      fontWeight: '600',
    },
    text_header: {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: 30,
      margin: 15
    },
      button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
      },
      inBut: {
        width: '70%',
        backgroundColor: '#ce112d',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
      },
      textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
      text_container: {
        marginTop: 20,
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center', // Alinea verticalmente los elementos en el centro
      },
      text1: {
        fontSize: 17,
        fontWeight: '700',
      },
      text2: {
        fontSize: 14, // Ajusta el tamaño del segundo texto
        color: 'blue', // Cambia el color a azul
        marginLeft: 10, // Añade un espacio entre los textos
      },
      editIcon: {
        zIndex: 1,
        color: 'white',
        position: 'absolute',
        right: 2,
        margin: 15,
      },
      backIcon: {
        zIndex: 1,
        color: 'white',
        position: 'absolute',
        left: 2,
        margin: 15,
      },
      avatar: {
        borderRadius: 100,
        marginTop: -250,
        // marginLeft: 105,
        backgroundColor: 'white',
        height: 200,
        width: 200,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
      },
      // 420475
      nameText: {
        color: 'black',
        fontSize: 28,
    
        fontStyle: 'normal',
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      bookCountMain: {
        borderColor: '#b0b0b0',
        borderWidth: 1,
        marginTop: 18,
        marginHorizontal: 20,
    
        borderRadius: 20,
        flexDirection: 'row',
        width: '88%',
      },
      bookCount: {
        width: '50%',
        borderColor: '#b0b0b0',
        borderRightWidth: 1,
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bookCountNum: {
        color: '#5D01AA',
        fontSize: 34,
        fontWeight: '800',
      },
      bookCountText: {color: '#b3b3b3', fontSize: 14, fontWeight: '500'},
      infoMain: {
        marginTop: 10,
      },
      infoCont: {
        width: '100%',
        flexDirection: 'row',
      },
      infoIconCont: {
        justifyContent: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
    
        alignItems: 'center',
        elevation: -5,
        borderColor: 'black',
        backgroundColor: 'black',
      },
    
      infoText: {
        width: '80%',
        flexDirection: 'column',
        marginLeft: 25,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: '#e6e6e6',
      },
      infoSmall_Text: {
        fontSize: 13,
        color: '#b3b3b3',
        fontWeight: '500',
      },
      infoLarge_Text: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
      },
      booksUploadedMain: {
        paddingHorizontal: 10,
        paddingBottom: 30,
        marginTop: 20,
      },
      flatlistDiv: {
        borderRadius: 15,
        paddingHorizontal: 10,
      },
      booksUploadedText: {
        fontSize: 26,
        color: 'black',
        fontWeight: '700',
        paddingLeft: 20,
        paddingBottom: 8,
      },
      booksUploadedCard: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 9,
        marginBottom: 9,
    
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        elevation: 3,
      },
      booksUploadedImgDiv: {
        width: '28%',
      },
      booksUploadedImg: {
        width: '100%',
        height: 120,
        borderRadius: 15,
      },
      cardMidDiv: {
        paddingHorizontal: 10,
        width: '55%',
        position: 'relative',
      },
      approvedText: {
        fontSize: 12,
        color: '#0d7313',
        fontWeight: '600',
        marginLeft: 5,
      },
      cardBookNameText: {
        fontSize: 24,
        color: 'black',
        fontWeight: '700',
        marginTop: 2,
      },
      cardBookAuthor: {
        fontSize: 14,
        color: 'black',
        fontWeight: '600',
        marginTop: 1,
      },
      cardRating: {
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 10,
        flexDirection: 'row',
      },
      cardRatingCount: {
        fontSize: 14,
        marginTop: -2,
        paddingLeft: 4,
        color: '#303030',
      },
      cardEditDiv: {
        width: '17%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      cardEditBtn: {
        height: 44,
        width: 44,
        backgroundColor: '#ce112d',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
      },
      footer: {
        padding: 10,
        justifyContent: 'center',
    
        flexDirection: 'row',
      },
      loadMoreBtn: {
        padding: 10,
        backgroundColor: '#ce112d',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        paddingHorizontal: 20,
      },
      btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '600',
      },
      text_header: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 30,
        margin: 15
      },
        button: {
          alignItems: 'center',
          marginTop: -20,
          alignItems: 'center',
          textAlign: 'center',
          margin: 20,
        },
        inBut: {
          width: '70%',
          backgroundColor: '#ce112d',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 15,
          borderRadius: 50,
        },
        textSign: {
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white',
        },
        text_container: {
          marginTop: 20,
          marginLeft: 5,
          flexDirection: 'row',
          alignItems: 'center', // Alinea verticalmente los elementos en el centro
        },
        text1: {
          fontSize: 17,
          fontWeight: '700',
        },
        text2: {
          fontSize: 14, // Ajusta el tamaño del segundo texto
          color: 'blue', // Cambia el color a azul
          marginLeft: 10, // Añade un espacio entre los textos
        },
  });

export default ObrasTerminadas