import React, {Component} from 'react';
import styled, {keyframes} from 'styled-components';
import {zoomIn} from 'react-animations';
import BorderButton from './BorderButton';


export default class ConfirmDialog extends Component {

  constructor(props) {
    super(props);

    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.handleConfirm = this.props.onConfirmed;
  }

  onButtonClicked(isYes) {
    this.handleConfirm(isYes);
  }

  handleConfirm(isYes) {
    this.props.onConfirmed(isYes)
  }

  render() {
    const { txt, message } = this.props;

    return (
      <Container>
        <Overlay>
                <Window>
                  <Question>{message}</Question>
                  <Buttons>
                    <YesButton onClick={() => this.onButtonClicked(true)}>
                      {txt.get("yes")}
                    </YesButton>
                    
                    <NoButton
                      onClick={() => this.onButtonClicked(false)} 
                      txt={txt.get("no")}
                      color={'#009CFF'}
                      height={'60px'}
                      width={'200px'}
                      iconSize={'24px'}
                      border={'2px'}
                      radius={'4px'}
                      fontSize={'25px'}
                      hoverColor={'#3BAC2A'} />
                  </Buttons>
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

const Question = styled.div`
  font-size: 30px;
  font-weight: 100;
  padding: 2vh;
  text-align: center;
  line-height: 5vh;
`;
Question.displayName = 'Question';

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;
Buttons.displayName = 'Buttons';

const YesButton = styled.button`
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
YesButton.displayName = 'YesButton';

const NoButton = styled(BorderButton)`
`;
NoButton.displayName = 'NoButton';


