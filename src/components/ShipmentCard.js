import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { List, Surface } from 'react-native-paper';
import Theme from '../core/theme';
import moment from 'moment';
import { useSelector } from 'react-redux';

function ShipmentCard({ title, data, onPress }) {
    const state = useSelector((state) => state);

    const GetStatus = () => {
        if(data.Durum === "0") {
            return !state.completed.filter(id => id === data.id).length;
        }
        else {
            return false;
        }

    }

    const styles = StyleSheet.create({
        container: {
            elevation: 4,
            borderRadius: 5,
            margin: 15,
        },
        header: {
            height: 40,
            backgroundColor: GetStatus() ? '#FFE800' : '#19AF6A',
            flexDirection: 'row',
            alignContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
        },
        headerTitle: {
            color: GetStatus() ? '#000' : '#fff',
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
            flex: 1
        }
    })

    return (
        <Surface style={styles.container}>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <List.Icon icon={GetStatus() ? 'clock-outline' : 'check-bold'} style={{ margin: 0, marginRight: -10 }} color={GetStatus() ? '#000' : '#fff'} />
                </View>
                <View style={styles.contentBox}>
                    <React.Fragment>
                        <View style={styles.itemBox}>
                            <Text style={styles.title}>Telefon:</Text>
                            <Text style={styles.desc}>{data.sGSM || '-'}</Text>
                        </View>
                        <View style={styles.itemBox}>
                            <Text style={styles.title}>Teslim Tarihi:</Text>
                            <Text style={styles.desc}>{moment(data.TeslimatTarihi).format('DD/MM/YYYY HH:mm')}</Text>
                        </View>
                        <View style={styles.itemBox}>
                            <Text style={styles.title}>Mağaza Adı:</Text>
                            <Text style={styles.desc}>{data.sMagazaAdi}</Text>
                        </View>
                        <View style={styles.itemBox}>
                            <Text style={styles.title}>Adres:</Text>
                            <Text style={styles.desc}>{`${data.sEvAdresi1 || ''} ${data.sEvAdresi2 || ''} ${data.sEvSemt || ''} ${data.sEvIl || ''}`}</Text>
                        </View>
                    </React.Fragment>
                </View>
            </TouchableOpacity>
        </Surface>
    )
}

export default ShipmentCard;