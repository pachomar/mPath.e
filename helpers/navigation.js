const messages = require('react-native-flash-message');

export function navigateToScreen(navigation, screenName, params) {
    navigation.navigate('Application', {screen: 'TabApplication', params: { screen: screenName, params: params }});
}

export function showOkMessage(title, description) {
    messages.showMessage({ message: title, description: description, type: "success", duration: 6000 })
}

export function showErrorMessage(title, description) {
    messages.showMessage({ message: title, description: description, type: "danger", duration: 6000 })
}