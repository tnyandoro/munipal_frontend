import UserService from "./userService";

var base_url = 'http://196.216.137.101:9000/';

class FailureService {

    static async confirm(userID, reason) {

        return fetch(base_url + 'failure/confirm', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: userID,
                reason: reason
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

export default FailureService;