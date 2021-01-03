import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const ListResults = ({item, deleteItem, navigate}) => {
    return (
        <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemView}>
    <Text style={styles.listItemText}>{JSON.parse(item).name}</Text>
                <Icon
                    name='trash'
                    size={20}
                    color="firebrick"
                    onPress=
                    {() => deleteItem(item) }/>

                <Button onPress={() => navigate(JSON.parse(item))} title="Info"/>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    listItem: {
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    listItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listItemText: {
        fontSize: 18
    }
})

export default ListResults;
