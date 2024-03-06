const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if(blogs.length === 0){return 1}
  if(blogs.length === 1){return blogs[0].likes}
  const total = blogs.reduce((total,blog) =>  total + blog.likes ,0)
  return total
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0){return }
  const bestBlog = blogs.reduce((max,blog) => {
    return blog.likes > max.likes ? blog : max
  },blogs[0])
  const blog = {
    title: bestBlog.title,
    author: bestBlog.author,
    likes: bestBlog.likes
  }

  return blog
}


const mostBlogs = (blogs) => {
  let maxBlogger = {
    author: 'there are no authors',
    blogs: 0
  }
  let dicc = {}
  blogs.forEach( blog => {
    if(dicc[blog.author] === undefined){
      const blogger = {
        author: blog.author,
        blogs: 1
      }
      if(Object.entries(dicc).length === 0){maxBlogger=blogger}
      dicc[blog.author] = blogger
    }else {
      const blogger = dicc[blog.author]
      blogger.blogs += 1
      dicc[blogger.author] = blogger
      if(maxBlogger.blogs<blogger.blogs){maxBlogger=blogger}
    }
  })
  return maxBlogger
}

const mostLikes = (blogs) => {
  let maxBlogger = {
    author: 'there are no authors',
    likes: 0
  }
  let dicc = {}

  blogs.forEach( blog => {
    if(dicc[blog.author] === undefined) {
      const blogger = {
        author: blog.author,
        likes: blog.likes
      }
      if(Object.entries(dicc).length === 0){maxBlogger=blogger}
      dicc[blogger.author] = blogger
    }else {
      const blogger = dicc[blog.author]
      blogger.likes += blog.likes
      dicc[blogger.author] = blogger
      if(maxBlogger.likes<blogger.likes){maxBlogger=blogger}
    }
  })
  return maxBlogger
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}