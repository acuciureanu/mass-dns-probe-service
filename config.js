module.exports = {
    application: {
        port: 8989,
    },
    probe:{
        resolve: {
            concurrentTasks: 10,
            nameservers: [
                '8.8.8.8',
                '4.4.4.4',
                '1.1.1.1'
            ]
        },

    }
};