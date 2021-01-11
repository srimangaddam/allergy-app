import React, {Component} from 'react';
import {Button, Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

class ScanBarcode extends Component {

    constructor(props) {
        super(props);
        this.camera = null;
        this.barcodeCodes = [];

        this.state = {
            camera: {
                type: RNCamera.Constants.Type.back,
                flashMode: RNCamera.Constants.FlashMode.auto
            },
            status: "Searching For Barcode"
        };
    }

    onBarCodeRead(scanResult) {
        //checks if a barcode is scanned
        if (scanResult.data != null) {
            //checks if barcode is already scanned before
            if (!this.barcodeCodes.includes(scanResult.data)) {
                this
                    .barcodeCodes
                    .push(scanResult.data);
                const url = 'https://world.openfoodfacts.org/api/v0/product/' + scanResult.data + '.json';
                fetch(url).then((response) => response.json()).then((json) => {
                    console.warn(json)
                    if (JSON.stringify(json.status_verbose) != '"product not found"') {
                        let title = JSON.stringify(json.product.brands) + JSON.stringify(json.product.product_name_en)
                        // formats output by adding spaces where two double quotations exist removing
                        // all quotations from string and capitalizing only first letter of each word
                        title = title
                            .replace('""', ' ')
                            .replace(/["]+/g, '')
                            .toLowerCase()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                        this.setState({
                            status: title + " Confirmed \n Scan More Items or Open Results Page"
                        })
                        let brand = JSON.stringify(json.product.brands)
                        let product = JSON.stringify(json.product.product_name_en)
                        let ing = JSON.stringify(json.product.ingredients_text)
                        let obj = JSON.stringify({
                            name: brand + product,
                            ingredients: ing
                        })
                        //sending data to Results Screen
                        this.sendData(obj);
                    } else {
                        this.setState({status: "Item Not Found or Is Not a Food \n Try Another Item"})
                    }
                }).catch((error) => {
                    console.warn(error);
                });

            }
        }
        return;
    }
    sendData = (data) => {
        this
            .props
            .receiveIng(data);
    }

    render() {

        return (
            <View style={styles.container}>

                <RNCamera
                    captureAudio={false}
                    ref={ref => {
                    this.camera = ref;
                }}
                    defaultTouchToFocus
                    flashMode={this.state.camera.flashMode}
                    mirrorImage={false}
                    onBarCodeRead={this
                    .onBarCodeRead
                    .bind(this)}
                    onFocusChanged={() => {}}
                    onZoomChanged={() => {}}
                    style={styles.preview}
                    type={this.state.camera.type}/>
                <View style={[styles.overlay, styles.topOverlay]}>
                    <Text style={styles.scanScreenMessage}>
                        {"Please Scan the Barcode\n\n Status: " + this.state.status}</Text>
                </View>

            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        padding: "5%",
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    scanScreenMessage: {
        fontSize: 14,
        color: 'white'
    }
};

export default ScanBarcode;