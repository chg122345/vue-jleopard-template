const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  user: state => state.user.user,
  token: state => state.user.token,
  avatar: state => state.user.user.avatar,
  name: state => state.user.user.name,
  permission_routes: state => state.permission.routes
}
export default getters
