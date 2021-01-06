import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const ListResults = ({item, deleteItem, navigate}) => {

    const test = JSON
        .parse(item)
        .name
        .replace('""', ' ')
        .replace(/["]+/g, '')
    return (
        <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemView}>
                <Text style={styles.listItemText}>{test}</Text>
                <View style={{margin:5,  flexDirection: 'row',}}>
        {/*        <Icon
                    name='trash'
                    size={20}
                    color="firebrick"
                    onPress=
                    {() => deleteItem(item) }/>*/
        }

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
    }
})

export default ListResults;
