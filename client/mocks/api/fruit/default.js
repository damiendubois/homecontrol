module.exports = {
    '/api/fruit': {
        GET: {
            data: [
                { name: 'Apple' },
                { name: 'Strawberry' }
            ],
            timeout: 100
        },
        POST: {
            data: {
                success: true
            },
            code: 201
        }
    }
};