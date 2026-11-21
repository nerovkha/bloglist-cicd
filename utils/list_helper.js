const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = blogs.reduce((byAuthor, blog) => {
    byAuthor[blog.author] = (byAuthor[blog.author] || 0) + 1
    return byAuthor
  }, {})

  const topAuthor = Object.entries(counts).reduce(([bestAuthor, bestCount], [author, count]) =>
    count > bestCount ? [author, count] : [bestAuthor, bestCount]
  )

  return { author: topAuthor[0], blogs: topAuthor[1] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likes = blogs.reduce((byAuthor, blog) => {
    byAuthor[blog.author] = (byAuthor[blog.author] || 0) + blog.likes
    return byAuthor
  }, {})

  const topAuthor = Object.entries(likes).reduce(([bestAuthor, bestLikes], [author, count]) =>
    count > bestLikes ? [author, count] : [bestAuthor, bestLikes]
  )

  return { author: topAuthor[0], likes: topAuthor[1] }
}

export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
