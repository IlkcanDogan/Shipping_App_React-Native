import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import { API_URL } from '../core/constants';

//components
import SignLayout from '../components/SignLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

function LoginScreen({ navigation }) {
    const { colors } = useTheme();
    const [wait, setWait] = useState(false);
    const [isLoggedWait, setIsLoggedWait] = useState(true);

    const [username, setUsername] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });

    //#region Is Login
    useEffect(() => {
        EncryptedStorage.getItem('user_session').then((data) => {
            let sessionJson = JSON.parse(data);

            if (sessionJson.isLogin) {
                navigation.navigate('HomeScreen');
            }

            setIsLoggedWait(false)
        }).catch((error) => {
            setIsLoggedWait(false)
        })
    }, [])
    //#endregion

    const handleLogin = () => {
        if (username.value) {
            if (password.value) {
                setWait(true);

                axios.post(API_URL, {
                    username: username.value.trim(),
                    password: password.value
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((resp) => {
                    setWait(false)

                    if (resp.data.status === 'success') {
                        EncryptedStorage.setItem('user_session', JSON.stringify({ isLogin: true, code: username.value })).then(() => {
                            setUsername({...username, value: ''});
                            setPassword({...password, value: ''});
                        })
                        navigation.navigate('HomeScreen');
                    }
                    else {
                        Alert.alert('Uyarı', 'Kullanıcı adı veya parolanız yanlış. Lütfen tekrar deneyin!', [
                            { text: "Tamam", onPress: () => { }, }
                        ]);
                    }
                }).catch((error) => {
                    setWait(false)
                    Alert.alert('Uyarı', 'Sunucuya ulaşılamıyor, lütfen internet bağlantınızı kontrol edin!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                    console.log(error)
                })
            }
            else {
                setPassword({ ...password, error: 'Lütfen boş bırakmayın!' });
            }
        }
        else {
            setUsername({ ...username, error: 'Lütfen boş bırakmayın!' });
        }
    }

    return (
        <React.Fragment>
            {isLoggedWait ? (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator size="large" color={colors.secondary} />
                </View>
            ) : (
                <React.Fragment>
                    <KeyboardAwareScrollView style={{ backgroundColor: colors.background, paddingTop: 50 }}>
                        <SignLayout>
                            <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 35, marginBottom: 50 }}>Sevkiyatçı</Text>
                            <TextInput
                                label='Kullanıcı Adı'
                                disabled={wait}
                                returnKeyType='next'
                                onChangeText={text => setUsername({ value: text, error: '' })}
                                value={username.value}
                                error={!!username.error}
                                errorText={username.error}
                                autoCapitalize='none'
                            />
                            <TextInput
                                label='Parola'
                                disabled={wait}
                                returnKeyType='done'
                                onChangeText={text => setPassword({ value: text, error: ''})}
                                value={password.value}
                                error={!!password.error}
                                errorText={password.error}
                                
                                secureTextEntry={true}
                            />
                            <Button mode="contained" onPress={wait ? null : handleLogin} style={{ backgroundColor: colors.primary }} loading={wait} >
                                {wait ? 'Lütfen bekleyin...' : 'Giriş Yap'}
                            </Button>
                        </SignLayout>
                    </KeyboardAwareScrollView>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default LoginScreen