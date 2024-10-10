import UserService from "./userService";

class GoogleService {

    static async GetCloudVision(image) {

        return fetch("https://vision.googleapis.com/v1/images:annotate?key=" + "AIzaSyA_I8gJd5PQkQr1aB54VaEgjAhan1wHtEQ", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requests: [
                    {
                        image: {
                            content: image
                        },
                        features: [
                            { type: "TEXT_DETECTION", maxResults: 5 },
                        ],
                    }
                ]
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

export default GoogleService;