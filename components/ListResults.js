import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const ListResults = ({item,navigate}) => {
    //formats output from JSON output from barcode API
    const test = JSON
        .parse(item)
        .name
        .replace('""', ' ')
        .replace(/["]+/g, '')
    return (
        <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemView}>
                <Text style={styles.listItemText}>{test}</Text>
                <View style={styles.btn}>
                <Button onPress={() => navigate(JSON.parse(item))} title="Info"/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    listItem: {
        padding: "7%",
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    listItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listItemText: {
        fontSize: 18,
        width: "80%"
    },
    btn:{
        margin:5,  
        flexDirection: 'row'
    }
})

export default ListResults;
