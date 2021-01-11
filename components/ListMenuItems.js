import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

//  List item showing a specific menu item of the chosen restaurant
const ListMenuItems = ({item, allergens, navigate, fullMenu}) => {
    let menuItemIngredients = ''
    // Locating ingredients of the menu item
    for (let i = 0; i < fullMenu.length; i++) {
        if (fullMenu[i].menuItem == item) 
            menuItemIngredients = fullMenu[i].ingredients
    }
    let allergenFound = false
    // Checking if allergens are present
    for (let i = 0; i < allergens.length; i++) {
        if (menuItemIngredients.toLowerCase().includes(allergens[i].toLowerCase())) 
            allergenFound = true
    }
    // Display showing particular menu item contains an allergen
    if (allergenFound) 
        return (
            <TouchableOpacity style={styles.listItem}>
                <View style={styles.listItemView}>
                    <Text style={styles.iconWarning}>
                        <Icon name="warning" size={33}/></Text>
                    <Text style={styles.listItemText}>{item}</Text>
                    <View style={styles.btn}>
                        <Button
                            onPress={() => navigate(menuItemIngredients)}
                            title="Info"
                            color="#8b0000"/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    //  Display showing particular menu item does not contain an allergen        
    else 
        return (
            <TouchableOpacity style={styles.listItem}>
                <View style={styles.listItemView}>
                    <Text style={styles.iconCheck}>
                        <Icon name="check" size={33}/></Text>
                    <Text style={styles.listItemText}>{item}</Text>
                    <View style={styles.btn}>
                        <Button
                            onPress={() => navigate(menuItemIngredients)}
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
        borderColor: '#dddddd'
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

export default ListMenuItems;
