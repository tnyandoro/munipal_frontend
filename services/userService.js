import { AsyncStorage, Alert } from 'react-native';

var base_url = 'http://196.216.137.101:9000/';

class UserService {

    static async register(name, email, password, address, accountNumber, emailToSendReadingTo, ERF, tariff, utilityType) {

        return fetch(base_url + 'user/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: name,
                email: email,
                password: password,
                address: address, 
                accountNumber: accountNumber,
                emailToSendReadingTo: emailToSendReadingTo,
                erf: ERF,
                tariff: tariff,
                utilityType: utilityType
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                NetworkTimeoutNotification();

            });
    }

    static async login(email, password) {

        return fetch(base_url + 'user/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                NetworkTimeoutNotification();

            });
    }

    static async GenerateResetToken(email) {
        return fetch(base_url + 'user/generate', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                NetworkTimeoutNotification();

            });;
    }

    static async VerifyPasswordResetToken(email, token) {
        return fetch(base_url + 'user/verify', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                token: token
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                NetworkTimeoutNotification();

            });;
    }

    static async ResetPassword(email, password) {
        return fetch(base_url + 'user/reset', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                NetworkTimeoutNotification();

            });;
    }

    static async updateAccountDetails(id, address, accountNumber, emailToSendReadingTo, ERF, tariff, utilityType) {
        return fetch(base_url + 'user/updateAccountDetails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                address: address, 
                accountNumber: accountNumber,
                emailToSendReadingTo: emailToSendReadingTo,
                ERF: ERF,
                tariff: tariff,
                utilityType: utilityType
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                NetworkTimeoutNotification();

            });;
    }

    static async getDetailsByID(id) {

        return fetch(base_url + 'user/getByID', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                NetworkTimeoutNotification();
            });
    }

    static async Save(data) {
        await AsyncStorage.setItem("user", JSON.stringify(data));
    }

    static async getUser() {
        const value = await AsyncStorage.getItem("user");
        var toReturn = JSON.parse(value)
        return toReturn;
    }

    static async Logout() {
        await AsyncStorage.removeItem("user");
    }

    static NetworkTimeoutNotification() {
        Alert.alert(
            'Oops!',
            'Seems like the network is a bit slow, please try again',
            [
                { text: 'OK' },
            ],
            { cancelable: false },
        );
    }
}

export default UserService;