function filterMenu({ menuData = [], role_type }) {
  const filteredMenu = menuData.filter((item) => {
    const roleTypes = JSON.parse(item.role_type)

    if (roleTypes.includes(role_type)) {
      if (item.children && item.children.length > 0) {
        item.children = filterMenu({ menuData: item.children, role_type })
      }
      return true
    } else if (item.children && item.children.length > 0) {
      item.children = filterMenu({ menuData: item.children, role_type })
      return item.children.length > 0
    }

    return false
  })

  return filteredMenu
}

export { filterMenu }
