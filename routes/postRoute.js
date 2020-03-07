const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check } = require('express-validator')
const postController = require('../controllers/postController')

//  @route  POST /post
//  @access Private
//  @desc   Create a post
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], postController.createPost)

//  @route  GET /post
//  @access Private
//  @desc   Get all post
router.get('/', auth, postController.getAllPost)

//  @route  GET /post/id
//  @access Private
//  @desc   Get post by id
router.get('/:id', auth, postController.getPostById)

//  @route  DELETE /post/id
//  @access Private
//  @desc   Delete post by id
router.delete('/:id', auth, postController.deletePostById)

//  @route  PUT /post/like/:id
//  @access Private
//  @desc   Like a post by id
router.put('/like/:id', auth, postController.likePost)

//  @route  PUT /post/like/:id
//  @access Private
//  @desc   Like a post by id
router.put('/unlike/:id', auth, postController.UnlikePost)

//  @route  PUT /comment/:id
//  @access Private
//  @desc   Add comment
router.put('/comment/:id' , [auth, [
    check('text', 'Text is required').not().isEmpty()
]], auth, postController.addComment)

//  @route  DeDELETE /comment/like/:id
//  @access Private
//  @desc   Remove a commment by id
router.delete('/comment/:id/:comment_id', auth, postController.deleteComment)

module.exports = router