class AuthenticationService{

registerSuccessfulLogin(username,password){
    console.log('method called');
    sessionStorage.setItem('authenticatedUser', username)
}
logout(){
    sessionStorage.removeItem('authenticatedUser')
}
}

export default new AuthenticationService()