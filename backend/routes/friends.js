// routes/friendRoutes.js
const express = require('express');
const {
    searchUserByUsernameHandler,
    sendFriendRequestHandler,
    getIncomingRequestsHandler,
    respondToFriendRequestHandler,
    getFriendsHandler,
} = require('../middleware/friendsController'); // no .js needed for CommonJS


const router = express.Router();

router.get('/search/:username', searchUserByUsernameHandler);
router.post('/send-request', sendFriendRequestHandler);
router.get('/requests/:uid', getIncomingRequestsHandler);
router.post('/respond-request', respondToFriendRequestHandler);
router.get('/friends/:uid', getFriendsHandler);

module.exports = router;
