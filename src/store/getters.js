const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.user.avatar,
  name: state => state.user.user.name
}
export default getters
