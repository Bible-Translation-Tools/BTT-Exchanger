import React, {Component} from 'react';
import styled, {keyframes} from 'styled-components';
import {zoomIn} from 'react-animations';


export default class MessageDialog extends Component {

  constructor(props) {
    super(props);

    this.onButtonClicked = this.props.onClick;
  }

  onButtonClicked() {
    this.props.onClick(false);
  }

  render() {
    const { txt, message } = this.props;

    return (
      <Container>
        <Overlay>
                <Window>
                  <Message>{message}</Message>
                  <OkButton onClick={() => this.onButtonClicked()}>
                    {txt.get("ok")}
                  </OkButton>
                </Window>
              </Overlay>
      </Container>
    );
  }
}

const zoomInAnimation = keyframes `${zoomIn}`;

const Container = styled.div`
`;
Container.displayName = 'Container'; 

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  z-index: 99;
`;
Overlay.displayName = 'Overlay';

const Window = styled.div`
  position: absolute;
  top: calc(50% - 20vh);
  left: calc(50% - 40vh);
  width: 80vh;
  height: 40vh;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  animation: ${zoomInAnimation} .2s ease-in;
`;
Window.displayName = 'Window';

const Message = styled.div`
  font-size: 30px;
  font-weight: 100;
  padding: 2vh;
  text-align: center;
  line-height: 5vh;
`;
Message.displayName = 'Message';

const OkButton = styled.button`
  background: linear-gradient(to bottom, #00C5FF, #009CFF);
  width: 200px;
  height: 60px;
  font-size: 25px;
  font-weight: 100;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: .3s ease-in-out;

  i {
    vertical-align: middle;
  }

  :hover{
    background: #3BAC2A;
    color: #FFF;
    border: 2px solid #3BAC2A;
  }
`;
OkButton.displayName = 'OkButton';


