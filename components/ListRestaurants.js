import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';

// List item showing a specific restaurant
const ListRestaurants = ({item, navigate, fullData}) => {
    // Array of menu items found in the specific restaurant to be sent 
    // to See Menu page is user selects the button
    let specificMenu = []
    const parsed = JSON.parse(fullData)
    for (let i = 0; i < parsed.length; i++) {
        if (parsed[i].brand == item) 
            specificMenu.push(parsed[i])
    }

    return (
        <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemView}>
                <Text style={styles.iconCheck}></Text>
                <Text style={styles.listItemText}>{item}</Text>
                <View style={styles.btn}>
                    <Button
                        onPress={() => navigate(specificMenu)}
                        title="See Menu"
                        color="#7E6EFE"/>
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
        fontSize: 20,
        width: "80%"
    },
    btn: {
        flexDirection: 'row',
        right: "5%"
    }
})

export default ListRestaurants;
