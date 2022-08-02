import React, { useEffect, useState } from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import Theme from '../core/theme';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDown from "react-native-paper-dropdown";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { filter } from '../redux/actions/filterActions';

function FilterScreen({ navigation }) {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const styles = StyleSheet.create({
        screen: {
            backgroundColor: '#fff',
            flex: 1,
            paddingHorizontal: 15,
            paddingTop: 5
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
        row: {
            flexDirection: 'row',
            marginTop: 4,
            marginBottom: 10
        },
    });

    const [dates, setDates] = useState({ start: state.filter.startDate, end: state.filter.endDate, startPicker: false, endPicker: false });
    const [dropdown, setDropdown] = useState(false);

    const [status, setStatus] = useState({ value: state.filter.status, error: '' });
    const statusTypes = [{ label: 'Bekleyenler', value: 'wait' }, { label: 'Tamamlananlar', value: 'completed' }];

    const formatDateTime = (date) => {
        let time = moment(date).format("DD/MM/YYYY");
        return time;
    }

    const handleFilter = () => {
        let fStartDate = moment(dates.start).format('YYYY-MM-DD')
        let fEndDate = moment(dates.end).format('YYYY-MM-DD');
        
        dispatch(filter({ startDate: fStartDate, endDate: fEndDate, status: status.value }));
        navigation.goBack();
    }

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Filtrele"
                    style={styles.headerTitleAppBar}
                    titleStyle={{ fontSize: 20 }}
                />
                <Appbar.Action />
            </Appbar.Header>
            <View style={styles.screen}>
                <View style={styles.row}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <TextInput
                            label='Teslim Başlangıç Tarihi'
                            value={formatDateTime() == 'Invalid date' ? dates.start : formatDateTime(dates.start)}
                            style={{ width: '98%', }}
                            onPressIn={() => setDates({ ...dates, startPicker: true })}
                            showSoftInputOnFocus={false}
                        />

                    </View>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <TextInput
                            label='Teslim Bitiş Tarihi'
                            value={formatDateTime(dates.end) == 'Invalid date' ? dates.end : formatDateTime(dates.end)}
                            style={{ width: '98%', marginLeft: '2%' }}
                            onPressIn={() => setDates({ ...dates, endPicker: true })}
                            showSoftInputOnFocus={false}
                        />
                    </View>
                </View>
                <DropDown
                    label="Sevkiyat Durumu"
                    mode="outlined"
                    visible={dropdown}
                    showDropDown={() => setDropdown(true)}
                    onDismiss={() => setDropdown(false)}
                    value={status.value}
                    setValue={(e) => setStatus({ ...status, value: e, error: '' })}
                    list={statusTypes}
                    error={!!status.error}
                />
                <Button mode="contained" onPress={handleFilter} style={{ backgroundColor: Theme.colors.secondary }}>
                    Uygula
                </Button>
            </View>
            <DateTimePickerModal
                isVisible={dates.startPicker}
                mode="date"
                onConfirm={(date) => setDates({ ...dates, start: date + '', startPicker: false })}
                onCancel={() => setDates({ ...dates, start: new Date(), startPicker: false })}
            />
            <DateTimePickerModal
                isVisible={dates.endPicker}
                mode="date"
                onConfirm={(date) => setDates({ ...dates, end: date + '', endPicker: false })}
                onCancel={() => setDates({ ...dates, end: new Date(), endPicker: false })}
            />
        </React.Fragment>
    )
}

export default FilterScreen;