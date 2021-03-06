const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');


const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const user = checkAuth(context);

            if(body.trim() === ''){
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not empty!'
                    }
                })
            }

            const post = Post.findById(postId);

            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })

                await post.save();
                return post;
            }else{
                throw new UserInputError('Post not Found!');
            }
        },

        async deleteComment(_, { postId, commentId}, context){
            const user = checkAuth(context);

            const post = Post.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if(post.comments[commentIndex].username === user.username){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                }else{
                    throw new AuthenticationError('Action not Allowed');
                }
            }else{
                throw new UserInputError('Post not Found!');
            }
        }
    }
}