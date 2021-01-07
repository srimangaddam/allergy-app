import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
const ListResults = ({item, allergens, navigate}) => {

    //formats output from JSON output from barcode API
    const scanTitle = JSON
        .parse(item)
        .name
        .replace('""', ' ')
        .replace(/["]+/g, '')
    const ingredients = JSON.parse(item).ingredients.toLowerCase()
    let allergenFound = false
    for(let i =0; i<allergens.length; i++){
        if(ingredients.includes(allergens[i].toLowerCase()))
        allergenFound = true
    }
    if (allergenFound) 
        return (
            <TouchableOpacity style={styles.listItem}>
                <View style={styles.listItemView}>
                    <Text style={styles.iconWarning}>
                        <Icon name="warning" size={33}/></Text>
                    <Text style={styles.listItemText}>{scanTitle}</Text>
                    <View style={styles.btn}>
                        <Button
                            onPress={() => navigate(JSON.parse(item))}
                            title="Info"
                            color="#8b0000"/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    else 
        return (
            <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemView}>
                <Text style={styles.iconCheck}>
                    <Icon name="check" size={33}/></Text>
                <Text style={styles.listItemText}>{scanTitle}</Text>
                <View style={styles.btn}>
                        <Button
                            onPress={() => navigate(JSON.parse(item))}
                            title="Info"
                            color="#149414"/>
                    </View>
                </View>
            </TouchableOpacity>
        )
}

const styles = StyleSheet.create({
    listItem: {
        right: "1%",
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
    btn: {
        flexDirection: 'row',
        right: "2%"
    },
    iconWarning: {
        right: "30%",
        color: 'darkred',
        fontSize: 20,
        textAlign: 'center'
    },
    iconCheck: {
        right: "30%",
        color: 'green',
        fontSize: 20,
        textAlign: 'center'
    }
})

export default ListResults;
