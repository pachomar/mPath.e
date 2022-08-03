global.loggedUser = {};

export function setLoggedUser(userLogin) {
    global.loggedUser = userLogin;
}

export function getLoggedUser() {
    return global.loggedUser;
}

export function isLoggedUser() {
    return global.loggedUser.UserId != null;
}
