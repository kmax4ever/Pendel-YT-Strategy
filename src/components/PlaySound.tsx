import React from "react";

export interface PlaySoundProps {
  url: any;
  play: boolean;
}

export interface PlaySoundState {}

export default class PlaySound extends React.Component<
  PlaySoundProps,
  PlaySoundState
> {
  audio: any;
  inputElement: any;
  constructor(props: PlaySoundProps) {
    super(props);
    this.state = {};
    this.audio = new Audio(this.props.url);
  }

  componentDidMount() {
    // this.audio.addEventListener('ended', () => this.setState({ play: false }));
  }

  componentWillUnmount() {
    // this.audio.removeEventListener('ended', () => this.setState({ play: false }));
  }

  render() {
    let { play } = this.props;
    if (play) {
      this.audio.play();
    }
    return (
      <>
        <div></div>
      </>
    );
  }
}
