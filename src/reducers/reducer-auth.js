
export default function LoginReducer (state = null, action) {
    if(action.payload && action.payload.response && action.payload.response.status === 401){
        localStorage.removeItem('login_session');
    }

    return state;
}