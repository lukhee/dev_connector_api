const Profile = require('../Models/ProfileSchema')
const { validationResult } = require('express-validator')
const User = require('../Models/UserSchema')
const request = require("request")
const config = require('config')

exports.getMyProfile = async (req, res, next)=>{
    try {
        const profile = await Profile.findOne({user : req.user.id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg: "There is no profile for this user"})
        }

        res.json(profile)

    } catch(err){
        console.error(err.message)
        res.status(500).send("server down")
    }
}

exports.updateProfile = async(req, res, next)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    // build profile object 
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.sklls =  skills.split(',').map(skill=>skill.trim())
    }

    // build profile social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube
    if(facebook) profileFields.social.facebook = facebook
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin

    try {
        let profile = await Profile.findOne({user: req.user.id})
        // update profile
        if(profile){
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )
            return res.json(profile)
        }

        // create if not found
        profile = new Profile(profileFields)

        await profile.save()
        res.json(profile)


    } catch(err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }

}

exports.getAllProfiles = async (req, res, next)=>{
    try {
        const profile = await Profile.find().populate('user', ['name', 'avatar'])

        // check if profile is empty
        if(profile.length === 0){
            return res.status(404).json({msg: 'No profile registered yet!!'})
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

exports.getUserProfileByID = async (req, res, next)=> {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar'])
        if(!profile) 
            return res.status(400).json({msg: "Profile not found"})
        res.json(profile)
    } catch (err) {
        if(err.kind == 'ObjectId')
            return res.status(400).json({msg: "Profile not found"})
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

exports.deleteProfile = async (req, res, next)=> {
    try {
        // Remove posts

        // Remove Profile
        await Profile.findOneAndRemove({user: req.user.id})
        // Remove User
        await User.findOneAndRemove({_id: req.user.id})
        res.json({msg: 'User delete'})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
        
    }
}

exports.addExperience = async(req, res, next)=> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id})
        console.log(profile)
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }

}

exports.deleteExperience = async(req, res, next)=> {
    try {
        const profile = await Profile.findOne({user: req.user.id})
        const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex, 1)
        await profile.save();

        res.json(profile)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Down')
    }
}

exports.addEducation = async(req, res, next)=> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
    } = req.body

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
    }

    try {
        const profile = await Profile.findOne({user: req.user.id})
        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }

}

exports.deleteEducation = async(req, res, next)=> {
    try {
        const profile = await Profile.findOne({user: req.user.id})
        const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1)
        await profile.save();

        res.json(profile)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Down')
    }
}

exports.getGithubRepos = async (req, res, next)=> {
    try {
        const options = {
            'url' : "https://api.github.com/orgs/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubSecretKey')}",
            'method': "GET",
            'headers': { 'user-agent': 'node.js'}
        }
        request(options, (error, response, body) =>{
            if(error) console.error(error);
            console.log(response)
            if(response.statusCode !== 200){
                return res.status(404).json({ msg: "No Github profile found" })
            }

            res.json(JSON.stringify(body))
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
}