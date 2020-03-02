import React from 'react';
import jdenticon from 'jdenticon';
import ReactPlayer from 'react-player';
import styled,  { keyframes } from 'styled-components';
import config from '../../../../config/config';
import { pulse, bounceIn } from 'react-animations';


export default class UserCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
    };
    this.play = this.play.bind(this);
    this.ended = this.ended.bind(this);
  }

  componentDidMount() {
    const {icon_hash} =this.props.user || '' ;
    jdenticon.update(`#canvas${this.props.id}` , icon_hash);
  }

  play() {
    this.setState({playing: true});
  }

  ended() {
    this.setState({playing: false});
  }
  render() {
    var key = this.props.id? this.props.id: 0;
    const {name_audio, icon_hash, id} = this.props.user || [];
    const audioURL = config.streamingUrl + name_audio;
    const {playing} = this.state;
    let icon = 'play_arrow';
    if (playing) {
      icon ='volume_up';
    }

    return (
      <UserCardContainer>
        <PulseEffect animate={playing}>
          <Card>
            <ImageContainer>
              <Image id={`canvas${key}`} data-jdenticon-hash={icon_hash} />
            </ImageContainer>

            <CardOptions>
              <Buttons>
                <PlayButton playing={playing} onClick={()=> this.play()}>  
                  <i className="material-icons" style={{fontSize:'3.5vw'}}>{icon}</i>
                </PlayButton>
                <Divider/>
                <DeleteButton onClick={()=> this.props.onDeleteUser(id)}>
                  <i className="material-icons" style={{fontSize:'2.8vw'}}>delete</i>
                </DeleteButton>
              </Buttons>
              <ReactPlayer url={audioURL} playing={this.state.playing} onEnded={()=> this.ended()}  />
            </CardOptions>
          </Card>
        </PulseEffect>
      </UserCardContainer>
    );
  }

}


// keyframes returns a unique name based on a hash of the contents of the keyframes
const pulse_animation = keyframes`${pulse}`;
const bounceInAnimations = keyframes`${bounceIn}`;


// Here we create a component that will rotate everything we pass in over two seconds
const PulseEffect = styled.div`
  animation: ${pulse_animation} ${props => props.animate ? '.7s' : '0s' } linear infinite;
`;

const UserCardContainer = styled.div``;

const Card = styled.div`
  text-align: center;
  height: 14vw;
  width: 10vw;
  border-radius: 1vw;
  box-shadow: 3px 4px 5px rgba(0,0,0,0.6);
  overflow: hidden;
  background-color: white;
  border: solid white;
  animation: ${bounceInAnimations} 1.5s ease-in;
`;

const ImageContainer = styled.div`
  padding: 1vw 0.2vw;
  cursor: pointer;
  transition: transform 300ms ease-in-out;
  &:hover {
  transform: scale(1.1);
}
`;

const Image = styled.svg`
  height: 8vw;
  width: 8vw;
`;

const PlayButton = styled.button`
  color: ${props => props.playing ? '#99ff99' : 'white'  } ;
  border: none;
  height: 3vw;
  width: 8vw;
  margin-top: -1.1vw;
  display: inline-block;
  background-color: #009CFF;
  padding: 0vw;
  cursor: pointer;
`;

const DeleteButton = styled(PlayButton)`
  color: black;
  margin-top: -0.5vw;
`;

const Divider = styled.div`
  border-left: 1px solid #e2e2e2;
  border-right: 1px solid blue;
  height: 2vw;
  margin-top: -0.4vw;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 0.8vw;
`;

const CardOptions = styled.div`
  background: #009CFF;
  width: inherit;
  overflow: hidden;
  border-color: white;
  border-width: 1vw;
`;