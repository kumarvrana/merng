const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');


const { UserInputError } = require('apollo-server');

module.exports = {
    Mutation: {
        likePost: async (_, { postId }, context) => {
            const { username } = checkAuth(context);
            
            const post = Post.findById(postId);

            if(post){
                if(post.likes.find(like => like.username === username)){
                    post.likes = post.likes.filter(like => like.username === username);
                }else{
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;                
            }else{
                throw new UserInputError('Post not Found!');
            }
        }
    }
}