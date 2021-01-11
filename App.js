import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ImageBackground,
    Button
} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import AddFood from './components/AddFood';
import ScanBarcode from './components/ScanBarcode';
import ListItem from './components/ListItem';
import ListResults from './components/ListResults';
import ListRestaurants from './components/ListRestaurants';
import ListMenuItems from './components/ListMenuItems';

const App = () => {

    //  Screen1 displays user inputted list of foods that cause an allergy
    function Screen1() {
        const [items,
            setItems] = useState([])
        buildArr().then((newItems) => {
            setItems(newItems)
        })
        //  Deletes item from list and updates local storage
        const deleteItem = (title) => {
            deleteFood(title)
        }
        //  Adds new user input to items and updates local storage
        const addFood = (text) => {
            allergyList(text)
        }
        return (
            <ImageBackground
                source={require('./Images/Background.png')}
                style={{
                width: "100%",
                height: "100%"
            }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Enter Allergen</Text>
                    </View>
                    <View style={styles.footer}>
                        <AddFood addFood={addFood}/>
                        <FlatList
                            data={items}
                            renderItem={({item}) => <ListItem item={item} deleteItem={deleteItem}/>}/>
                    </View >
                </View>
            </ImageBackground>
        )

        //  Adds user inputed allergen in local storage
        async function allergyList(text) {
            if (!(parseInt(await AsyncStorage.getItem('numList'))) > 0) {
                await AsyncStorage.setItem('numList', "0")
            }
            if (text.length > 0) {
                try {
                    const num = parseInt(await AsyncStorage.getItem('numList')) + 1;
                    await AsyncStorage.setItem('numList', "" + num)
                    const location = "List" + num;
                    await AsyncStorage.setItem(location, text)
                    items.push(await AsyncStorage.getItem("List" + num))
                } catch (e) {}
            }

        }
        // Builds an array of food from the local storage
        async function buildArr() {
            const array = []
            if (!(parseInt(await AsyncStorage.getItem('numList'))) > 0) {
                await AsyncStorage.setItem('numList', "0")
            }
            const i = parseInt(await AsyncStorage.getItem('numList'));
            for (let j = 1; j < i + 1; j++) {
                array.push(await AsyncStorage.getItem("List" + j))
            }
            allergens = array
            return array;
        }
        //  Internal debugging method to clear array of food from the local memory
        async function deleteArr() {
            const i = parseInt(await AsyncStorage.getItem('numList'));
            await AsyncStorage.removeItem('numList')
            for (let j = 1; j < i; j++) {
                await AsyncStorage.removeItem("List" + j)
            }

        }
        //  Deletes single food allergen array and updates state
        async function deleteFood(text) {
            const i = parseInt(await AsyncStorage.getItem('numList'));
            for (let j = 1; j <= i; j++) {
                if ((await AsyncStorage.getItem("List" + j)) == (text)) {
                    for (let k = j; k < i; k++) {
                        await AsyncStorage.setItem("List" + k, await AsyncStorage.getItem("List" + (k + 1)))
                    }
                    const num = i - 1;
                    await AsyncStorage.setItem('numList', "" + num)
                    setItems([])
                    buildArr()
                }
            }

        }
    }

    //  Screen2 uses barcode to retrieve text ingredients
    function Screen2() {
        const getIng = (childData) => {
            sendData(childData)
        }
        return (<ScanBarcode receiveIng={getIng}/>)
    }
    //  Stores ingredients from barcode in local storage
    async function sendData(text) {
        if (text != null) {
            if (!(parseInt(await AsyncStorage.getItem('numResults'))) > 0) {
                await AsyncStorage.setItem('numResults', "0")
            }
            const num = parseInt(await AsyncStorage.getItem("numResults")) + 1;
            await AsyncStorage.setItem("numResults", "" + num)
            const location = "Result" + num;
            await AsyncStorage.setItem(location, text)
        }

    }

    //  Screen 3 displays results of scanned products
    function Screen3({navigation}) {

        // Array of results from barcode scans
        const [res,
            setres] = useState([])
        buildResults().then((newRes) => {
            setres(newRes)
        })

        //  Builds array of scan results from local storage
        async function buildResults() {
            const arr = []
            if (!(parseInt(await AsyncStorage.getItem('numResults'))) > 0) {
                await AsyncStorage.setItem('numResults', "0")
            }
            const i = parseInt(await AsyncStorage.getItem('numResults'));
            for (let j = 1; j < i + 1; j++) {
                arr.push(await AsyncStorage.getItem("Result" + j))
            }
            return arr;
        }

        //  Deletes all results from local storage and updates state
        async function deleteResults() {
            const i = parseInt(await AsyncStorage.getItem('numResults'));
            await AsyncStorage.removeItem('numResults')
            for (let j = 1; j <= i; j++) {
                await AsyncStorage.removeItem("Result" + j)
            }
            buildResults()
        }

        //  Opens new page with full ingredient list
        function nav(x) {
            navigation.navigate('Details', x)
        }

        return (
            <ImageBackground
                source={require('./Images/Background.png')}
                style={{
                width: "100%",
                height: "100%"
            }}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Results</Text>
                </View>
                <View style={styles.footer}>
                    <FlatList
                        data={res}
                        renderItem={({item}) => <ListResults navigate={nav} item={item} allergens={allergens}/>}/>
                    <Button
                        title="Delete All"
                        onPress={() => deleteResults()}
                        color="#841584"
                        accessibilityLabel="Delete All"/>

                </View>
            </ImageBackground>
        )
    }

    //  Screen 4 shows the menu items that contain allergens based on restaurant
    function Screen4({navigation}) {
        const [isLoading,
            setLoading] = useState(true)    
        const [restaurants,
            setRestaurants] = useState()    
        const [fullMenuData,
            setFullMenuData] = useState()

        // API call to Django/MySQL backend that returns restaurant menus    
        const url = 'http://XX-XXX-XXX-XX:XXXX/api/restaurantMenu' +
                's/view/'
        useEffect(() => {
            fetch(url).then((response) => response.json()).then((json) => {
                let tempRestaurants = []
                for (let i = 0; i < json.length; i++) {
                    if (tempRestaurants.indexOf(json[i].brand) == -1) 
                        tempRestaurants.push(json[i].brand)
                }
                setRestaurants(tempRestaurants)
                setFullMenuData(JSON.stringify(json))
                setLoading(false)
            })
        }, [])

        //  Opens the menu of the chosen restaurant
        function nav(x) {
            navigation.navigate('Restaurant Menu', x)
        }

        //  Loading screen until API data is received
        if (isLoading) {
            return (
                <ImageBackground
                    source={require('./Images/Background.png')}
                    style={{
                    width: "100%",
                    height: "100%"
                }}>

                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Loading</Text>
                        </View>
                        <View style={styles.footer}>
                        </View >
                    </View>
                </ImageBackground>

            )
        }
        // Standard screen that displays list of restaurants with see menu button
        return (
            <ImageBackground
                source={require('./Images/Background.png')}
                style={{
                width: "100%",
                height: "100%"
            }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Restaurants</Text>
                    </View>
                    <View style={styles.footer}>
                        <FlatList
                            data={restaurants}
                            renderItem={({item}) => <ListRestaurants item={item} navigate={nav} fullData={fullMenuData}/>}/>
                    </View >
                </View>
            </ImageBackground>

        )
    }

    //  Page opens when user wants to see full ingredient information from results page
    function ResultsInfo(route) {
        // formatting ingredients list for display
        const rawData = (JSON.stringify(route))
        const indexIng = rawData.search("ingredients") + 11
        let ing = rawData.substring(indexIng)
        ing = ing.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '');
        let confirmedAllergens = ""
        for (let i = 0; i < allergens.length; i++) {
            if (ing.includes(allergens[i].toLowerCase())) 
                confirmedAllergens += allergens[i] + " "
        }
        if (confirmedAllergens.length == 0) {
            confirmedAllergens = "No Allergens Detected"
        }
        return (
            <View>
                <Text style={{
                    fontSize: 30
                }}>Full Ingredients List:</Text>
                <Text style={{
                    fontSize: 20
                }}>{(ing)}</Text>
                <Text style={{
                    fontSize: 30
                }}>{"\nSuspected Allergens:"}</Text>
                <Text style={{
                    fontSize: 20
                }}>{(confirmedAllergens)}</Text>
            </View>
        )
    }

    //  Displays the full menu of chosen restaurant
    function DisplayFullMenu({route, navigation}) {
        const specificMenu = route.params
        let menuItems = []
        for (let i = 0; i < specificMenu.length; i++) {
            menuItems.push(specificMenu[i].menuItem)
        }
        // Opens new page with full ingredient list of chosen menu item
        function nav(x) {
            navigation.navigate('Menu Item Ingredients', x)
        }
        return (

            <View>
                <FlatList
                    data={menuItems}
                    renderItem={({item}) => <ListMenuItems
                    item={item}
                    allergens={allergens}
                    navigate={nav}
                    fullMenu={specificMenu}/>}/>

            </View>

        )
    }
    //  Displays the full ingredient list of the chosen menu item
    function MenuItemIngredientsList(route) {
        let ing = route.route.params
        let confirmedAllergens = ""
        for (let i = 0; i < allergens.length; i++) {
            if (ing.includes(allergens[i].toLowerCase())) 
                confirmedAllergens += allergens[i] + " "
        }
        if (confirmedAllergens.length == 0) {
            confirmedAllergens = "No Allergens Detected"
        }
        return (
            <View>
                <Text style={{
                    fontSize: 30
                }}>Full Ingredients List:</Text>
                <Text style={{
                    fontSize: 20
                }}>{(ing)}</Text>
                <Text style={{
                    fontSize: 30
                }}>{"\nSuspected Allergens:"}</Text>
                <Text style={{
                    fontSize: 20
                }}>{(confirmedAllergens)}</Text>
            </View>
        )

    }
    const ResultsStack = createStackNavigator();

    //  Handles navigation to the results ingredient page
    function ResultsStackScreen() {
        return (
            <ResultsStack.Navigator>
                <ResultsStack.Screen
                    options={{
                    headerShown: false
                }}
                    component={Screen3}name="Results"/>
                <ResultsStack.Screen name="Details" component={ResultsInfo}/>
            </ResultsStack.Navigator>
        );
    }

    const RestaurantsStack = createStackNavigator();

    //  Handles navigation to new pages from the Restaurant page
    function RestaurantsStackScreen() {
        return (
            <RestaurantsStack.Navigator>
                <RestaurantsStack.Screen
                    options={{
                    headerShown: false
                }}
                    component={Screen4}name="Restaurants"/>
                <RestaurantsStack.Screen name="Restaurant Menu" component={DisplayFullMenu}/>
                <RestaurantsStack.Screen
                    name="Menu Item Ingredients"
                    component={MenuItemIngredientsList}/>
            </RestaurantsStack.Navigator>
        );
    }

    const Tab = createBottomTabNavigator();

    return (
        <NavigationContainer>

            <Tab.Navigator
                screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if (route.name === 'Enter Allergy') {
                        iconName = focused
                            ? 'add-circle'
                            : 'add-circle-outline';
                    } else if (route.name === 'Scan Barcode') {
                        iconName = focused
                            ? 'camera'
                            : 'camera';
                    } else if (route.name === 'Scan Text') {
                        iconName = focused
                            ? 'camera'
                            : 'camera';
                    } else if (route.name === 'Results') {
                        iconName = focused
                            ? 'ios-list'
                            : 'ios-list';
                    } else if (route.name === 'Restaurants') {
                        iconName = focused
                            ? 'restaurant-outline'
                            : 'restaurant-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>;
                }
            })}
                tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray'
            }}>
                <Tab.Screen name="Enter Allergy" component={Screen1}/>
                <Tab.Screen name="Scan Barcode" component={Screen2}/>
                <Tab.Screen name="Results" component={ResultsStackScreen}/>
                <Tab.Screen name="Restaurants" component={RestaurantsStackScreen}/>
            </Tab.Navigator>

        </NavigationContainer>
    )
}

var allergens = []
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        justifyContent: 'center'
    },
    headerText: {
        color: '#FFFFFF',
        textAlign: "left",
        alignItems: 'baseline',
        fontSize: 40,
        margin: "3%"
    },
    footer: {
        flex: 4,
        backgroundColor: '#FFFFFF',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50
    }
})

export default App;
