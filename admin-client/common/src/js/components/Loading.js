import React, { Component } from 'react';
import styled from 'styled-components';
import loadingRingImg from '../../assets/images/loadingRing.svg';

class Loading extends Component {
  render() {
    const {height, top, message} = this.props;
    return (

      <Container height={height} top={top} >
        <h1>{message ? message : this.props.txt.get("loading")}</h1>
        <img src={loadingRingImg} alt="Loading..." />
      </Container>
    );
  }
}


const Container = styled.div`
  display: flex;
  width: 100%;
  height: ${props => props.height? props.height: '60vh' };
  top: ${props => props.top? props.top: 0};
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`;
Container.displayName = 'Container';

export default Loading;
