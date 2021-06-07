const frontend = require('../frontend/meta.json')
const loseweight = require('../loseWeight/meta.json')

function getHeader (posts) {
  const getPostPair = x => [x.path, x.sideTitle || x.title]
  if (posts[0] && posts[0].category) {
    let category = []
    for (const post of posts) {
      if (post.category) {
        category = [...category, { title: post.category, collapsable: false, children: [ getPostPair(post) ] }] 
      } else {
        category[category.length - 1].children.push(getPostPair(post))
      }
    }
    return category
  }
  return posts.map(getPostPair)
}

module.exports = {
  frontend: getHeader(frontend), 
  loseweight: getHeader(loseweight),
}
