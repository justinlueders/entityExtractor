require('dotenv').config({silent: true});

'use strict';
const _ = require('lodash'),
    TwitterApi = require('twitter'),
    app = require('../../../server/server');

let twitter_consumer_key =  process.env.TWITTER_CONSUMER_KEY,
    twitter_consumer_secret = process.env.TWITTER_CONSUMER_SECRET,
    twitter_access_token_key = process.env.TWITTER_ACCESS_TOKEN_KEY,
    twitter_access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET,
    twitterReady = _.every([twitter_consumer_key, twitter_consumer_secret,
        twitter_access_token_key, twitter_access_token_secret]);
let twitterClient = undefined;

if(twitterReady)
    twitterClient = new TwitterApi({
        consumer_key: twitter_consumer_key,
        consumer_secret: twitter_consumer_secret,
        access_token_key: twitter_access_token_key,
        access_token_secret: twitter_access_token_secret
    });

module.exports = {
    execute: function(filter, cb){
        if(!twitterReady){
            cb(null,{message:"twitter client not ready"});
            return;
        }
        var params = {screen_name: filter.userid};
        twitterClient.get('followers/ids', params, function(error, cursor, response) {
            if (error) {
                cb(null, error);
                return;
            }

            cb(null,cursor.ids);

        });
    }
};

/*
     function getEvent(eventId) {
 const Event = Twitter.app.models.Event;
 return Event.findById(eventId,{
 fields: ['cluster_ids']
 });
 }

 function getClusters(event){
 const PostsCluster = Twitter.app.models.postsCluster;
 let similarPostIds = _(clusters).map('similar_post_ids')
 .flatten().compact().uniq().value();

 similarPostIds = _.sampleSize(similarPostIds, sampleSize);

 return PostsCluster.find({
 where: {
 post_id: { inq: event.cluster_ids }
 },
 fields: ['similarPostIds']
 }).$promise;
 }

 Twitter.followerNetwork = function(id,cb){
 if(!twitterReady){
 cb(null,{message:"twitter client not ready"});
 return;
 }

 getEvent(id)
 .then(event=>{
 cb(null,{message:event.name});
 return;
 })
 };
* */



