import jsonpPromise from './jsonp-promise';
import sample from 'lodash/sample';

function getPostsFromRedditJSON(data) {
    const postObjects = data.data.children;
    return postObjects
        .map((post) => post.data)
        .map(({title, url}) => {
            const match = (
                /youtu\.be\/([a-zA-Z0-9_-]+)/.exec(url) ||
                /v=([a-zA-Z0-9_-]+)/.exec(url)
            );
            return {
                title,
                url,
                videoId: match ? match[1] : null,
            };
        })
        .filter((data) => data.videoId);
}

export default class VideoManager {
    constructor() {
        this.posts = {};
        this.sampled = {};
    }

    addFromURL(url) {
        return jsonpPromise(url).then(([data]) => {
            return getPostsFromRedditJSON(data);
        }).then((posts) => {
            let nAdded = 0;
            posts.forEach((post) => {
                if (this.add(post)) {
                    nAdded += 1;
                }
            });
            return {url, nAdded};
        });
    }

    add(post) {
        if (!this.posts[post.videoId]) {
            this.posts[post.videoId] = post;
            return true;
        }
        return false;
    }

    sample(consume=true) {
        for(var i = 0; i < 500; i++) {
            const videoId = sample(Object.keys(this.posts));
            if(consume && this.sampled[videoId]) {
                continue;
            }
            this.sampled[videoId] = true;
            return this.posts[videoId];
        }
    }

    count() {
        return Object.keys(this.posts).length;
    }

    countUnseen() {
        return Object.keys(this.posts).filter((videoId) => !this.sampled[videoId]).length;
    }


}
