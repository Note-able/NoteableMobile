
export const getNearby = () => {
    return (dispatch) => {
        const events = getEvents();
        dispatch({type: 'GET_NEARBY', events});
    };
} 

const getEvents = (filter) => {
    return [
        {
            id: 1,
            type: 'EVENT',
            user: {
                id: 123,
                name: 'Ian Mundy',
                profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
            },
            message: 'created a new event',
            image: 'http://images.8tracks.com/cover/i/009/636/693/coffee2-386.jpg?rect=0,0,1080,1080&q=98&fm=jpg&]fit=max&w=320&h=320',
            title: 'Noteable Launch Party',
            dateTime: '8pm Wednesday',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget maximus arcu. Nulla sit amet mattis arcu, sed vehicula leo. Pellentesque viverra blandit tristique. Nullam lorem ipsum, consequat id mollis in, tincidunt ut neque. Donec accumsan, risus eget dapibus commodo, dui ante accumsan massa, nec mollis odio nulla imperdiet diam. Nam sed neque nibh. Nunc mollis nibh eu dui faucibus, vitae maximus urna auctor. Integer vulputate quis felis id interdum. Aenean convallis, ligula et ultrices pellentesque, massa purus fermentum lectus, a ultricies dolor turpis sed felis. Cras cursus ullamcorper turpis at imperdiet. Donec faucibus turpis quis odio dignissim, a sagittis purus fermentum. Curabitur dapibus turpis vitae nunc viverra, et cursus risus rhoncus. In vitae congue tellus. Nam consequat purus id lectus varius cursus viverra sed nunc. Duis dapibus ut elit vel volutpat.',
        },
        {
            id: 2,
            type: 'JAM',
            user: {
                id: 123,
                name: 'Ian Mundy',
                profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
            },
            message: 'is looking to start a metal band in your area - ask to meet up!',
            musicians: ['drummer','singer','bassist'],
            comments: [
                {
                    id: 1,
                    user:  {
                        id: 123,
                        name: 'Ian Mundy',
                        profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                    },
                    content: '\m/ rock on!'
                }],
            likes: [
                {
                    id: 123,
                    name: 'Ian Mundy',
                    profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                },
                {
                    id: 234,
                    name: 'Sportnak',
                    profileImage: 'https://avatars.logoscdn.com/2383/5112383_large_1aed4286212c43a9ae74010dbc9a7be0.jpg', 
                }
            ]
        },
        {
            id: 3,
            type: 'SONG',
            user: {
                id: 123,
                name: 'Ian Mundy',
                profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
            },
            message: 'published a song',
            song: 'Closer (Acoustic)',
            comments: [
                {
                    id: 1,
                    user:  {
                        id: 123,
                        name: 'Ian Mundy',
                        profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                    },
                    content: '\m/ rock on!'
                }],
            likes: [
                {
                    id: 123,
                    name: 'Ian Mundy',
                    profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                },
                {
                    id: 234,
                    name: 'Sportnak',
                    profileImage: 'https://avatars.logoscdn.com/2383/5112383_large_1aed4286212c43a9ae74010dbc9a7be0.jpg', 
                }
            ]
        },
        {
            id: 4,
            type: 'JOINED',
            user: {
                id: 123,
                name: 'Ian Mundy',
                profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
            },
            message: 'and 5 others have joined notable near you. Check out their profiles.',
            users: [
                {
                    id: 123,
                    name: 'Ian Mundy',
                    profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                },
                {
                    id: 234,
                    name: 'Sportnak',
                    profileImage: 'https://avatars.logoscdn.com/2383/5112383_large_1aed4286212c43a9ae74010dbc9a7be0.jpg', 
                }
            ]
        },
    ];
}
