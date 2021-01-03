import React, {Component} from 'react';
import {Button, Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Header from './Header';


class ProductScanRNCamera extends Component {

    constructor(props) {
        super(props);
        this.camera = null;
        this.barcodeCodes = [];

        this.state = {
            camera: {
                type: RNCamera.Constants.Type.back,
                flashMode: RNCamera.Constants.FlashMode.auto
            }
        };
    }

    onBarCodeRead(scanResult) {

        if (scanResult.data != null) {
            //need to say if item already scanned or if item is not valid
            //tell user when barcode captured
            if (!this.barcodeCodes.includes(scanResult.data)) {
                this
                    .barcodeCodes
                    .push(scanResult.data);
                const url = 'https://world.openfoodfacts.org/api/v0/product/' + scanResult.data + '.json';
                fetch(url).then((response) => response.json()).then((json) => {
                    let brand = JSON.stringify(json.product.brands)
                    let product = JSON.stringify(json.product.product_name_en)
                    let ing = JSON.stringify(json.product.ingredients_text)
                    let obj = JSON.stringify({name: brand+product,ingredients: ing})
                    this.sendData(obj);
                    // Show user that barcode was scanned and waiting in results, maybe through an
                    // alter send data to results

                }).catch((error) => {
                    console.warn(error);
                });
            
            }
        }
        return;
    }
sendData = (data) => {
this.props.receiveIng(data);
}     

    render() {

        return (
            <View style={styles.container}>
                  <Header title='Scan Barcode' />
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
            
                    <Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
                </View>
                {/*    <View style={[styles.overlay, styles.bottomOverlay]}>
                </View> */}
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
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    topOverlay: {
        top: 50,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    enterBarcodeManualButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40
    },
    scanScreenMessage: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default ProductScanRNCamera;