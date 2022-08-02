import React, { useEffect, useState } from 'react';
import { View, BackHandler, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Appbar, Surface, Divider } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import Theme from '../core/theme';
import axios from 'axios';
import { API_URL } from '../core/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { complete } from '../redux/actions/complateAction';

//components
import SignLayout from '../components/SignLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import moment from 'moment';


function DetailScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const id = route.params?.id || '';


    const styles = StyleSheet.create({
        screen: {
            backgroundColor: '#fff',
            flex: 1
        },
        headerTitleAppBar: {
            justifyContent: 'center', alignItems: 'center'
        },
        centerContainer: {
            flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginTop: -30
        },
        centerTitle: {
            fontSize: 18,
            marginTop: 10
        },
        container: {
            elevation: 4,
            borderRadius: 5,
            margin: 15,
        },
        header: {
            height: 40,
            backgroundColor: Theme.colors.primary,
            flexDirection: 'row',
            alignContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
        },
        headerTitle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            flex: 1,
            marginTop: -1
        },
        contentBox: {
            display: 'flex',
            paddingLeft: 10,
            paddingRight: 10
        },
        itemBox: {
            flexDirection: 'row',
            alignContent: 'space-between',
            marginTop: 5,
            marginBottom: 5
        },
        title: {
            fontSize: 16,
            color: '#000',
            fontWeight: 'bold',
            flex: 1
        },
        desc: {
            fontSize: 16,
            flex: 1.4
        }
    })

    const [detail, setDetail] = useState({ order: {}, products: [], _wait: true, _errorMessage: '' });

    useEffect(() => {
        axios.get(API_URL + '?p=order-detail&id=' + id).then((resp) => {
            if (resp.data.status === 'success') {
                setDetail({ ...detail, order: resp.data.order, products: resp.data.products, _wait: false });
            }
            else {
                setDetail({ ...detail, _wait: false, _errorMessage: 'Bir sorun oluştu, lütfen internet bağlantınızı kontrol edin!' });
            }
        }).catch(() => {
            setDetail({ ...detail, _wait: false, _errorMessage: 'Bir sorun oluştu, lütfen internet bağlantınızı kontrol edin!' });
        })
    }, []);

    const [complate, setComplate] = useState({ code: '', desc: '', _wait: false });

    const handleComplate = () => {
        setComplate({ ...complate, _wait: true });

        axios.post(API_URL + '?p=complate', {
            id,
            smsCode: complate.code,
            desc: complate.desc
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((resp) => {
            setComplate({ ...complate, _wait: false });
            if (resp.data.status === 'success') {
                Alert.alert('Bilgi', 'Sevkiyat başarı ile tamamlandı!', [
                    {
                        text: "Tamam", onPress: () => {
                            dispatch(complete([id]));
                            navigation.goBack();
                        },
                    }
                ]);
            }
            else if (resp.data.status === 'invalid-code') {
                Alert.alert('Uyarı', 'SMS onay kodu yanlış, lütfen kontrol edin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            }
            else if (resp.data.status === 'empty-code') {
                Alert.alert('Uyarı', 'Lütfen SMS onay kodunu boş bırakmayın!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            }
        }).catch(() => {
            setComplate({ ...complate, _wait: false });
            Alert.alert('Uyarı', 'Sunucuya ulaşılamıyor, lütfen internet bağlantınızı kontrol edin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        })
    }

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Detaylar"
                    style={styles.headerTitleAppBar}
                    titleStyle={{ fontSize: 20 }}
                />
                <Appbar.Action />
            </Appbar.Header>
            <View style={styles.screen}>
                {detail._errorMessage ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.centerTitle}>{detail._errorMessage}</Text>
                    </View>
                ) : null}
                {detail._wait ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={Theme.colors.secondary} />
                        <Text style={styles.centerTitle}>Lütfen bekleyin...</Text>
                    </View>
                ) : (
                    <ScrollView>
                        <Surface style={styles.container}>
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Müşteri Bilgileri</Text>
                            </View>
                            <View style={styles.contentBox}>
                                <React.Fragment>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.title}>Müşteri Kodu:</Text>
                                        <Text style={styles.desc}>{detail.order.lKodu}</Text>
                                    </View>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.title}>Adı Soyadı:</Text>
                                        <Text style={styles.desc}>{detail.order.MusteriAdSoyad}</Text>
                                    </View>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.title}>Telefon:</Text>
                                        <Text style={styles.desc}>{detail.order.sGSM}</Text>
                                    </View>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.title}>Mağaza Adı:</Text>
                                        <Text style={styles.desc}>{detail.order.sMagazaAdi}</Text>
                                    </View>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.title}>Teslim Tarihi:</Text>
                                        <Text style={styles.desc}>{moment(detail.order.TeslimatTarihi).format('DD/MM/YYYY HH:mm')}</Text>
                                    </View>
                                    {detail.order?.Durum === "1" ? (
                                        <View style={styles.itemBox}>
                                            <Text style={styles.title}>Tamamlanma Tarihi:</Text>
                                            <Text style={styles.desc}>{moment(detail.order.TamamlanmaTarihi).format('DD/MM/YYYY HH:mm')}</Text>
                                        </View>
                                    ) : null}
                                    <View style={styles.itemBox}>
                                        <Text style={styles.title}>Adres:</Text>
                                        <Text style={styles.desc}>{(detail.order.sEvAdresi1 || '') + (detail.order.sEvAdresi2 || '') + (detail.order.sEvSemt || '') + (detail.order.sEvIl || '')}</Text>
                                    </View>
                                </React.Fragment>
                            </View>
                        </Surface>
                        <Surface style={styles.container}>
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Teslim Edilecek Ürünler</Text>
                            </View>
                            <View style={styles.contentBox}>
                                {detail.products.map((item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <View style={styles.itemBox}>
                                                <Text style={styles.title}>Stok Kodu:</Text>
                                                <Text style={styles.desc}>{item.sKodu}</Text>
                                            </View>
                                            <View style={styles.itemBox}>
                                                <Text style={styles.title}>Ürün Adı:</Text>
                                                <Text style={styles.desc}>{item.sAciklama}</Text>
                                            </View>
                                            <View style={styles.itemBox}>
                                                <Text style={styles.title}>Adet:</Text>
                                                <Text style={styles.desc}>{parseInt(item.lGCMiktar) || '-'}</Text>
                                            </View>
                                            {detail.products.length - 1 !== index ? (
                                                <Divider style={{ backgroundColor: '#000' }} />
                                            ) : null}
                                        </React.Fragment>
                                    )
                                })}
                            </View>
                        </Surface>
                        {detail.order?.Durum !== "1" ? (
                            <View style={{ marginHorizontal: 15 }}>
                                <TextInput
                                    label='SMS Onay Kodu'
                                    disabled={complate._wait}
                                    returnKeyType='next'
                                    onChangeText={text => setComplate({ ...complate, code: text })}
                                    value={complate.code}
                                    autoCapitalize='none'
                                />
                                <TextInput
                                    label='Açıklama'
                                    disabled={complate._wait}
                                    returnKeyType='next'
                                    onChangeText={text => setComplate({ ...complate, desc: text })}
                                    value={complate.desc}
                                    autoCapitalize='none'
                                />
                                <Button mode="contained" onPress={complate._wait ? null : handleComplate} style={{ backgroundColor: Theme.colors.secondary }} loading={complate._wait} >
                                    {complate._wait ? 'Lütfen bekleyin...' : 'Sevkiyatı Tamamla'}
                                </Button>
                            </View>
                        ) : null}

                    </ScrollView>
                )}
            </View>
        </React.Fragment>
    )
}

export default DetailScreen;