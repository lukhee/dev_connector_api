const Post = require('../Models/PostModel')
const User = require('../Models/UserSchema')
const profile = require('../Models/ProfileSchema')
const { validationResult } = require('express-validator')

exports.createPost = async (req, res, next)=> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findOne({_id: req.user.id}).select('-password')
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        const post = new Post(newPost)
        await post.save()

        res.json(post)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
}

exports.getAllPost = async(req, res, next)=> {
    try {
        const post = await Post.find().sort({ date: -1})
        res.json(post)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Down')
    }
}

exports.getPostById = async(req, res, next)=> {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg: "Post not Found"})
        }
        res.json(post)
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg: "Post not Found"})
        }
        console.error(error.message)
        res.status(500).send('Server Down')
    }
}

exports.deletePostById = async (req, res, next)=> {
    try {
        await Post.findById(req.params.id)

        // Check user
        if(!req.user.toString() !== req.params.post_id){
            return res.status(400).json({msg: "User not authorized"})
        }

        await post.remove();

        res.json({ msg: "Post removed" })
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg: "Post not Found"})
        }
        console.error(error.message)
        res.status(500).send('Server Down')
    }
}

exports.likePost = async (req, res, next)=> {
    try {
        const post = await Post.findById(req.params.id);

        // Chech if its like
        if(post.likes.filter(like = like.user.toString() ===req.user.id).length > 0){
            return res.status(400).json({msg: 'Post already like'})
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg: "Post not Found"})
        }
        console.error(error.message)
        res.status(500).send('Server Down')
    }
}

exports.UnlikePost = async(req, res, next)=> {
    try {
        const post = await Post.findById(req.params.id);

        // Chech if its like
        if(post.likes.filter(like = like.user.toString() ===req.user.id).length === 0 ){            return res.status(400).json({msg: 'Post already like'})
            return res.status(400).json({msg: 'Post already like'})
        }

        const removeIndex = post.lokes.map(like => like.user.toString().indexOf(req.user.id))
        post.like.splice(removeIndex)

        await post.save()

        res.json(post.likes)
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg: "Post has not yet been like"})
        }
        console.error(error.message)
        res.status(500).send('Server Down')
    }
}

exports.addComment = async (req, res, next)=> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findOne({_id: req.user.id}).select('-password')
        const post = Post.findById(req.params.id)

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        post.comments.unshift(newComment)
        await post.save()

        res.json(post.comments)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
}

exports.deleteComment = async(req, res, next)=> {
    try {
        const user = await User.findOne({_id: req.user.id}).select('-password')
        const post = Post.findById(req.params.id)

        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id
        );
        // Check if comment exist
        if(!comment){
            return res.status(404).json({msg: "Comment does not exit"})
        }

        // Check user 
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: "User not authorized"})
        }
        // Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id))

        await post.save()

        res.json(post.comments)

        res.json(post.comments)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
}