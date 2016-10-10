import React, {Component} from 'react';
import {Flex, Box} from 'reflexbox';
import YouTube from 'react-youtube';
import VideoManager from './VideoManager';


class App extends Component {
    constructor(props) {
        super(props);
        this.videoManager = new VideoManager();
        this.state = {nPosts: 0, current: null};
        this.goToNext = this.goToNext.bind(this);
        this.refreshPosts = this.refreshPosts.bind(this);
    }

    componentDidMount() {
        this.refreshPosts();
        setInterval(() => {
            this.refreshPosts();
        }, 60 * 30 * 1000);
    }

    refreshPosts() {
        [
            'https://www.reddit.com/r/youtubehaiku/top/.json?limit=1500&t=week',
            'https://www.reddit.com/r/youtubehaiku/top/.json?limit=1500&t=month',
            'https://www.reddit.com/r/youtubehaiku/top/.json?limit=1500&t=day',
            'https://www.reddit.com/r/youtubehaiku/new/.json?limit=1500',
            'https://www.reddit.com/r/youtubehaiku/.json?limit=1500',
        ].forEach((url) => {
            this.videoManager.addFromURL(url).then((info) => {
                console.log(info);
                this.recalculateNPosts();
            });
        });
    }

    recalculateNPosts() {
        this.setState({nPosts: this.videoManager.count()})
    }

    componentDidUpdate() {
        if (this.state.current === null && this.state.nPosts > 0) {
            this.goToNext();
        }
    }

    goToNext() {
        for (var i = 0; i < 10; i++) {
            const newPost = this.videoManager.sample();
            if (newPost === this.state.current) continue;
            this.setState({current: newPost});
            break;
        }
    }

    render() {
        const {current, nPosts} = this.state;
        const yt = (current ? <YouTube
            videoId={current.videoId}
            opts={{width: '100%', height: '100%'}}
            onReady={(e) => {
                e.target.playVideo();
            }}
            onStateChange={(e) => {
                if (e.data === 5) {
                    e.target.playVideo();
                }
            }}
            onEnd={this.goToNext}
            onError={this.goToNext}
        /> : null);
        return (
            <Flex column flexAuto>
                <Box flex flexAuto id="player-wrap">
                    {yt}
                </Box>
                <Box id="control-bar" flex>
                    <Box col={8}>{current ? current.title : null}</Box>
                    <Box col={3}>
                        <button onClick={() => this.goToNext()}>Next</button>
                    </Box>
                    <Box col={1}>
                        <button onClick={() => this.refreshPosts()}>Load More [{nPosts}]</button>
                    </Box>
                </Box>
            </Flex>
        );
    }
}

export default App;
