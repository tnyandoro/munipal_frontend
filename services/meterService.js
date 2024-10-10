import UserService from "./userService";

var base_url = 'http://196.216.137.101:9000/';

class MeterService {

    static async getCurrentMonthReadings(id) {

        return fetch(base_url + 'meter/getCurrentMonthReadings', {
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
                UserService.NetworkTimeoutNotification();
            });
    }

    static async getHistoryReadings(date, id) {

        return fetch(base_url + 'meter/getHistoryReadings', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                date: date,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                UserService.NetworkTimeoutNotification();

            });
    }

    static async checkNumber(formdata) {

        return fetch(base_url + 'meter/checkNumber', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formdata,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                UserService.NetworkTimeoutNotification();

            });
    }

    static async save(formdata) {
        return fetch(base_url + 'meter/saveReading', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formdata,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                UserService.NetworkTimeoutNotification();

            });
    }

    static async getReadingDetails(readingID, userID, tariff) {

        return fetch(base_url + 'meter/getReadingDetails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                readingID: readingID,
                userID: userID,
                tariff: tariff
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                UserService.NetworkTimeoutNotification();

            });
    }

    static async getLatestReading(userID, tariff, reading, utilityType) {

        return fetch(base_url + 'meter/getLatestReading', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: userID,
                tariff: tariff,
                reading: reading,
                utilityType: utilityType
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                UserService.NetworkTimeoutNotification();

            });
    }

    static async sendReadingEmail(userID, reading, emailToSendReadingTo, utilityType, date) {

        return fetch(base_url + 'meter/sendReadingEmail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: userID,
                reading: reading,
                emailToSendReadingTo: emailToSendReadingTo,
                utilityType: utilityType,
                date: date
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                UserService.NetworkTimeoutNotification();

            });
    }
}

export default MeterService;