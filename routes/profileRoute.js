const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')


// @route Get profile/me
// @access Private
// @desc   get current users profile
router.get('/me',auth , profileController.getMyProfile)

// @route  POST profile
// @access Private
// @desc   Create or update profile
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required')
]], profileController.updateProfile)

// @route  Get /profiles
// @access public
// @desc   Get all profiles
router.get('/profiles', profileController.getAllProfiles)

//  @route  Get /profile/user/user_id
//  @access public
//  @desc   Get profile by id
router.get('/:user_id', profileController.getUserProfileByID)

//  @route  Delete /profile/user/user_id
//  @access Private
//  @desc   Delete profile, user & posts
router.delete('/', auth, profileController.deleteProfile)

//  @route  Put /profile/experience
//  @access Private
//  @desc   Add profile experience
router.put('/experience',  [auth, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], profileController.addExperience)

//  @route  Delete/profile/experience
//  @access Private
//  @desc   Delete experience from profile
router.delete('/experience/:exp_id',  auth,  profileController.deleteExperience)

//  @route  Put /profile/education
//  @access Private
//  @desc   Add profile education
router.put('/education',  [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('from', 'from is required').not().isEmpty(),
    check('to', 'status is required').not().isEmpty(),
]], profileController.addEducation)

//  @route  Delete/profile/education
//  @access Private
//  @desc   Delete education from profile
router.delete('/education/:edu_id',  auth,  profileController.deleteEducation)

//  @route  Delete/profile/githug
//  @access public
//  @desc   Get first resent 5 github repos
router.get('/github/:username', profileController.getGithubRepos)

module.exports = router