const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        typpe: String
    },
    location: {
        type: String
    },
    skills: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    githubusername: {
        type: String
    },
experience: [
    {
        title: {
            type: String,
            required: true
        }, 
        company: {
            type: String,
            required: true
        },
        location: {
            type: String,
        },
        website: {
            type: String,
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
        },
        current: {
            type: Boolean,
            default: false
        },
    }
],
education: [
    {
        school: {
            type: String,
            required: true
        }, 
        degree: {
            type: String,
            required: true
        },
        fieldofstudy: {
            type: String,
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        },
        current: {
            type: Boolean,
            default: false
        },   
    }
],
social: {
    youtube: {
        type: String,
    }, 
    twitter: {
        type: String,
    },
    facebook: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    instagram: {
        type: String,
    }
}
}, {
    timestamps: true
})

module.exports = Profile = mongoose.model('profile', ProfileSchema )
