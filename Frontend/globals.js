export let LoginStatus = { Login: 0, Data: {} };

export const setLoginStatus = (value) => {
  LoginStatus = {
    Login: value.Login !== undefined ? value.Login : LoginStatus.Login,
    Data: value.Data !== undefined ? value.Data : LoginStatus.Data,
  };
};
