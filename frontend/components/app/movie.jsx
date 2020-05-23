import React from "react";
import { Link } from "react-router-dom";

class Movie extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            muted: true
        }

        this.fadeTime = 0;
        this.fadeInterval;


        // Function Binds
        this.setActiveMovie = this.setActiveMovie.bind(this);
        this.toggleSound = this.toggleSound.bind(this);
        this.togglePlayOn = this.togglePlayOn.bind(this);
        this.togglePlayOff = this.togglePlayOff.bind(this);
        // this.handleClick = this.handleClick.bind(this);

        this.fadeInfo = this.fadeInfo.bind(this);
        this.incrementFade = this.incrementFade.bind(this);
        this.startFadeTimer = this.startFadeTimer.bind(this);
        this.resetFadeTimer = this.resetFadeTimer.bind(this);
        this.endFadeTimer = this.endFadeTimer.bind(this);
    }

    componentWillUnmount() {
        this.endFadeTimer();
    }

    // handleClick() {
        
    //     if (this.props.activeRow && this.props.activeMovie) {
    //         console.log("Active Movie has been clicked")
    //         window.location = `/#/browse/${this.props.details.id}/watch`
    //     }
    // }

    togglePlayOn(event) {
        event.currentTarget.classList.add("playing")

        if (!this.props.activeRow) {
            const video = document.getElementById(this.props.details.id)
            video.play();
        }
    }

    togglePlayOff(event) {
        event.currentTarget.classList.remove("playing")

        if (!this.props.activeRow) {
            const video = document.getElementById(this.props.details.id)
            video.pause();
        }
    }

    toggleSound(event) {
        event.stopPropagation()

        this.setState({
            muted: !this.state.muted
        })
    }

    setActiveMovie() {
        this.props.setActiveMovie(this.props.details);
    }

    
    // Fade Timing Functions
    incrementFade() {
        if (!this.props.activeRow) {
            this.fadeTime++;
    
            if (this.fadeTime >= 3) {
                this.fadeInfo();
                this.fadeTime = 0;
            }
        }
    }

    startFadeTimer() {
        this.fadeInterval = window.setInterval(this.incrementFade, 1000)

        let container = document.getElementById(`${this.props.title}-info-container`)
        container.classList.remove("trigger-fade")
    }

    resetFadeTimer() {
        let container = document.getElementById(`${this.props.title}-info-container`)
        container.classList.remove("trigger-fade")

        this.fadeTime = 0;
        clearInterval(this.fadeInterval);
        this.fadeInterval = window.setInterval(this.incrementFade, 1000)
    }

    endFadeTimer() {
        this.fadeTime = 0;
        clearInterval(this.fadeInterval);

        let container = document.getElementById(`${this.props.title}-info-container`);
        if (container) container.classList.remove("trigger-fade");
    }

    fadeInfo() {
        let container = document.getElementById(`${this.props.title}-info-container`)
        container.classList.add("trigger-fade")
    }

    render() {

        let { activeRow, activeMovie } = this.props;
        let { title, details} = this.props;
        let { muted } = this.state;
        let moviePreview;

        let soundButton = muted ? (
            <div className="sound-btn-off" onClick={this.toggleSound} ></div>
        ) 
        : (
            <div className="sound-btn-on" onClick={this.toggleSound} ></div>
        );

        if (!activeRow) {
            moviePreview = (
                <div className="movie-preview-default" onClick={this.setActiveMovie} onMouseEnter={this.togglePlayOn} onMouseLeave={this.togglePlayOff} >
                    <img 
                        src="/assets/rogue_one_thumbnail.jpg" 
                        className="thumbnail" 
                        onMouseEnter={this.startFadeTimer} 
                    />

                    <div id={`${title}-info-container`}
                    className="trailer-container" 
                    onMouseMove={this.resetFadeTimer} 
                    onMouseLeave={this.endFadeTimer}
                    >
                        <video 
                            className="trailer"
                            id={details.id}
                            src="/assets/rogue_one_trailer.mp4"
                            loop
                            muted={muted}
                        />

                        <div className="trailer-info">
                            <div className="preview-details-container">
                                <div className="preview-details">
                                    <i className="fas fa-play-circle fa-3x"></i>
                                    <div className="preview-title">{title}</div>
                                    <div className="preview-details-box">
                                        <div className="preview-rating">{details.maturity_rating}</div>
                                        <div className="preview-duration">{details.duration}</div>
                                    </div>
                                </div>
                                <div className="preview-buttons">
                                    {soundButton}
                                    <div className="gap"></div>
                                    <div className="add-btn"></div>
                                </div>
                            </div>
                            <div className="preview-show-link">
                                <div className="preview-chev-down"></div>
                            </div>
                        </div>

                    </div>
                </div>
            )
        } else if (activeRow && activeMovie) {
            moviePreview = (
                <Link className="movie-preview-active playing" to={`/browse/${details.id}/watch`} onMouseEnter={this.togglePlayOn} onMouseLeave={this.togglePlayOff}>
                    <img src="/assets/rogue_one_thumbnail.jpg" className="thumbnail-active"/>
                    <div className="play-container">
                        <i className="fas fa-play-circle fa-6x preview-play-button hov-button"></i>
                    </div>
                </Link>
            )

            // moviePreview = (
            //     <div className="movie-preview-active playing" onClick={this.handleClick} onMouseEnter={this.togglePlayOn} onMouseLeave={this.togglePlayOff}>
            //         <img src="/assets/rogue_one_thumbnail.jpg" className="thumbnail-active"/>
            //         <div className="play-container">
            //             <i className="fas fa-play-circle fa-6x preview-play-button hov-button"></i>
            //         </div>
            //     </div>
            // )

        } else if (activeRow && !activeMovie) {
            moviePreview = (
                <div className="movie-preview-inactive" onClick={this.setActiveMovie} onMouseEnter={this.togglePlayOn} onMouseLeave={this.togglePlayOff} >
                    <img src="/assets/rogue_one_thumbnail.jpg" className="thumbnail-inactive"/>
                    <div className="chev-down hov-button"></div>
                </div>
            )
        }



        return (
            <main className="movie-main">
                {moviePreview}
            </main>
        )
    }

}

export default Movie;