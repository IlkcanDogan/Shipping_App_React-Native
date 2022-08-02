import React, { useEffect, useState } from 'react';
import { View, BackHandler, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Theme from '../core/theme';
import axios from 'axios';
import { API_URL } from '../core/constants';
import { ScrollView } from 'react-native-gesture-handler';
import ShipmentCard from '../components/ShipmentCard';
import { useSelector } from 'react-redux';
import moment from 'moment';


function HomeScreen({ route, navigation }) {
    //#region BackButton Disable
    const isFocused = useIsFocused();
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => isFocused)
        return () => backHandler.remove()
    })
    //#endregion

    const state = useSelector((state) => state);

    const styles = StyleSheet.create({
        screen: {
            backgroundColor: '#fff',
            flex: 1
        },
        headerTitle: {
            justifyContent: 'center', alignItems: 'center'
        },
        centerContainer: {
            flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginTop: -30
        },
        centerTitle: {
            fontSize: 18,
            marginTop: 10
        }
    })

    const handleLogout = () => {
        Alert.alert('Uyarı', 'Çıkış yapmak istediğinize emin misiniz?', [
            {
                text: "Evet", onPress: () => {
                    EncryptedStorage.removeItem('user_session').then(() => {
                        navigation.navigate('LoginScreen');
                    })
                },
            },
            { text: "İptal", onPress: () => { }, }
        ]);
    }

    const [user, setUser] = useState(null);
    const [shipments, setShipments] = useState({ list: [], _wait: true, _errorMessage: '' });

    useEffect(() => {
        setShipments({ ...shipments, _wait: true });

        EncryptedStorage.getItem('user_session').then((data) => {
            let sessionJson = JSON.parse(data);
            axios.get(API_URL + '?p=shipments&code=' + sessionJson.code).then((resp) => {

                setShipments({ ...shipments, list: resp.data.shipments, _wait: false })

            }).catch((error) => {
                setShipments({ ...shipments, _wait: false, _errorMessage: 'Bir sorun oluştu, lütfen internet bağlantınızı kontrol edin!' })
            })

            setUser(sessionJson);
        }).catch((err) => {
            console.log(err)
        })
    }, []);

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.Action icon="filter-variant" size={30} onPress={() => navigation.navigate('FilterScreen')} />
                <Appbar.Content
                    title="Sevkiyat Listesi"
                    subtitle={state.filter.status === 'wait' ? 'Bekleyenler' : 'Tamamlananlar'}
                    style={styles.headerTitle}
                    titleStyle={{ fontSize: 20 }}
                />
                <Appbar.Action icon="power-standby" size={30} onPress={handleLogout} />
            </Appbar.Header>
            <View style={styles.screen}>
                {shipments._errorMessage ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.centerTitle}>{shipments._errorMessage}</Text>
                    </View>
                ) : null}
                {shipments._wait ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={Theme.colors.secondary} />
                        <Text style={styles.centerTitle}>Lütfen bekleyin...</Text>
                    </View>
                ) : (
                    shipments.list.length ? (
                        <ScrollView>
                            {shipments.list.map((item, index) => {
                                //#region Status Filter
                                if (state.filter.status === 'wait') {
                                    if (item.Durum === "1") return;
                                    //#region Completed Filter
                                    if (state.completed.filter(id => id === item.id).length) return;
                                    //#endregion
                                    
                                }
                                else {
                                    if (item.Durum !== "1" && !state.completed.filter(id => id === item.id).length) return;
                                    
                                }
                                //#endregion

                                //#region Date Filter
                                let fCurrentDate = moment(item.TeslimatTarihi).format('YYYY-MM-DD');
                                if(!moment(fCurrentDate).isBetween(state.filter.startDate, state.filter.endDate, undefined, '[]')) {
                                    return;
                                }
                                //#endregion

                                return (
                                    <ShipmentCard key={index} title={item.lKodu + ' - ' + item.MusteriAdSoyad} data={item} onPress={() => navigation.navigate('DetailScreen', { id: item.id })} />
                                )
                            })}
                        </ScrollView>
                    ) : (
                        <View style={styles.centerContainer}>
                            <Text style={styles.centerTitle}>Sevkiyat bulunamadı!</Text>
                        </View>
                    )
                )}
            </View>
        </React.Fragment>
    )
}

export default HomeScreen;