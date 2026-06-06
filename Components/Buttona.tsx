import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function Buttona({title, onPress, icon, color}){
    return(
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <AntDesign name={icon} size={30} color={color ? color : '#ce112d'}/>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ce112d',
        marginLeft: 10, 
    }

})