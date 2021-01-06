import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const AddFood = ({addFood}) => {
    const [text,
        setText] = useState('');

    const onChange = textValue => setText(textValue);

    return (
        <View style={styles.addFoodBox}><TextInput
            placeholder="Add Food..."
            style={styles.input}
            onChangeText={onChange}/>
            <TouchableOpacity style={styles.btn} onPress={() => addFood(text)}>
                <Text style={styles.btnText}><Icon name="plus" size={20}/> {//addFood
                }
                </Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    addFoodBox: {
        flexDirection:'row', 
        justifyContent: 'center',
    },
    input: {
        fontSize: 18,
        height: 60,
        padding: 8
    },
    btn: {
        margin: 5,
        padding: 9
    },
    btnText: {
        color: 'darkslateblue',
        fontSize: 20,
        textAlign: 'center'
    }
})

export default AddFood;
