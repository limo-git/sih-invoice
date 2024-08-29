import Neode from 'neode';

const instance = new Neode(process.env.NEO4J_URI, process.env.NEO4J_USER, process.env.NEO4J_PASSWORD);


instance.model('Project', {
    title: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'string',
        required: true,
    },
    link: {
        type: 'string',
        required: true,
    },
    username:{
        type:'string',
        required:false,
    }
});


instance.model('User', {
    username: {
        type: 'string',
        required: true,
        unique: true,
    },
    email: {
        type: 'string',
        required: true,
        unique: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    isVerified: {
        type: 'boolean',
        default: false,
    },
    isAdmin: {
        type: 'boolean',
        default: false,
    },
    forgotPasswordToken: 'string',
    forgotPasswordTokenExpiry: 'datetime',
    verifyToken: 'string',
    verifyTokenExpiry: 'datetime',

    
    projects: {
        type: 'relationship',
        target: 'Project',
        relationship: 'HAS_PROJECT',
        direction: 'out',
        cascade: 'delete', 
        eager: true, 
    },
    following: {
        type: 'relationship',
        target: 'User',
        relationship: 'FOLLOWS',
        direction: 'out',
        eager: true,
    },

    followers: {
        type: 'relationship',
        target: 'User',
        relationship: 'FOLLOWS',
        direction: 'in',
        eager: true,
    }


});


export default instance;
