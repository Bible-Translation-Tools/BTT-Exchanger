import React from 'react';
import styled, {keyframes} from 'styled-components';
import BorderButton from '../../../components/BorderButton';
import {zoomIn, fadeInLeft} from 'react-animations';
import getIllustrations from '../../../../js/getIllustrations';

export default class ProjectCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      displayDetails: false, 
      illustrations: null 
    };

    this.displayDetails = this.displayDetails.bind(this);
  }

  componentWillMount() {
    let illustrations = getIllustrations(this.props.slug);
    this.setState({ illustrations: illustrations});
  }

  displayDetails() {
    this.setState((prevState) => ({
      displayDetails: !prevState.displayDetails
    }));
  };

  ucwords(str) {
    if(str.length > 0) {
      str = str.split(" ");

      for (var i = 0, x = str.length; i < x; i++) {
          str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }
  
      return str.join(" ");
    }
    return str;
}

  render() {
    const { projectId, book, language, sourceLanguage, anthology, version, mode, txt } = this.props;
    const {illustrations, displayDetails} = this.state;
    
    return (
      <Card>
        {
          !displayDetails ?
            
              <CardWindow>
                <InformationContainer >
                  <TextContainer>
                    <BookText> {book.name} </BookText>
                    <Text>{language.name}</Text>
                    <Text>{this.ucwords(version.name)} ({this.ucwords(mode.name)})</Text>
                  </TextContainer>
                </InformationContainer>

                <ImageContainer>
                  <Image src={illustrations.picker} alt="Smiley face" height="106px" width="338px" />
                </ImageContainer>

                <ButtonsContainer>
                  <BlueButton onClick={() => this.displayDetails()} >
                    {txt.get("info")} <i className="material-icons">error_outline</i> 
                  </BlueButton>

                  <BorderButton
                    onClick={()=> this.props.onDeleteProject(projectId)} 
                    txt={txt.get("delete")}
                    color={'#ff0000'}
                    height={'40px'}
                    width={'154px'}
                    icon={'delete'}
                    iconSize={'24px'}
                    border={'2px'}
                    radius={'4px'}
                    fontSize={'14px'}
                    hoverColor={'#3BAC2A'}
                  />
                </ButtonsContainer>
            </CardWindow>

            :

            <CardDetails picker={illustrations.picker}>
              <Header>
                <Title>{txt.get("projectDetails")}</Title>
                <CloseButton onClick={() => this.displayDetails()}>
                  <i className="material-icons">highlight_off</i>
                </CloseButton>
              </Header>

              <Details>
                <DetailItem>
                  <span>ID:</span> {projectId}
                  </DetailItem>
                <DetailItem>
                  <span>{txt.get("language")}:</span> ({language.slug}) {language.name}
                  </DetailItem>
                <DetailItem>
                  <span>{txt.get("book")}:</span> ({book.slug}) {book.name}
                  </DetailItem>
                <DetailItem>
                  <span>{txt.get("version")}:</span> ({version.slug}) {this.ucwords(version.name)}
                  </DetailItem>
                <DetailItem>
                  <span>{txt.get("mode")}:</span> ({mode.unit == 1 ? "MULTI" : "SINGLE" }) {this.ucwords(mode.name)}
                  </DetailItem>
                <DetailItem>
                  <span>{txt.get("anthology")}:</span> ({anthology.slug}) {this.ucwords(anthology.name)}
                  </DetailItem>
                <DetailItem>
                  <span>{txt.get("sourceLanguage")}:</span> ({sourceLanguage.slug}) {sourceLanguage.name}
                  </DetailItem>
              </Details>
              
            </CardDetails>
        }
      </Card>

    );
  }

}

const zoomInAnimation = keyframes `${zoomIn}`;
const zoomInAnimation2 = keyframes `${fadeInLeft}`;

const Card = styled.div``;
Card.displayName = 'Card';

const CardWindow = styled.div`
  text-align: center;
  height: 226px
  width: 338.5px;
  min-width: 350px;
  border-radius: .5vw;
  box-shadow: 0px 1px 2px 4px rgba(0,0,0,0.2);
  overflow: hidden;
  background-color: white;
  margin: 0 4vw 3vw 0;
  animation: ${zoomInAnimation} .2s ease-in;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 14px;

`;
ButtonsContainer.displayName= 'ButtonsContainer';

const Image = styled.img`
   height: 106px;
   width: 100%;
`;
Image.displayName = 'Image';

const BookText = styled.p`
   font-size: 14px;
   font-weight: bold;
   margin-bottom: 0;
`;
BookText.displayName = 'BookText';

const Text = styled.p`
   font-size: 14px;
   color: #606060;
   margin: 0;
`;
Text.displayName = 'Text';

const InformationContainer = styled.div`
  position: relative;
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 5px;

`;
InformationContainer.displayName = 'InformationContainer';

const ImageIndicatorContainer = styled.div`
  width: 50;
`;
ImageIndicatorContainer.displayName = 'ImageIndicatorContainer';

const ImageContainer = styled.div`
  width: 100%;
  height: 106px;
  overflow: hidden;
`;
ImageContainer.displayName = 'ImageContainer';

const TextContainer = styled.div`
  padding-top: .5vw;
  padding-left: .7vw;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
TextContainer.displayName = 'TextContainer';

const ButtonContainer= styled.div`

    background: #009CFF;
    width: 100%;
    min-height: 40px;
    padding: 0.25vw;
    overflow: hidden;
    text-align: center;
    border-color: white;
    border-width: 1vw;
  `;
ButtonContainer.displayName = 'ButtonContainer';

const BlueButton = styled.button`
  background: linear-gradient(to bottom, #00C5FF, #009CFF);
  width: 154px;
  height: 40px;
  font-size: 20px;
  font-weight: 100;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
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

const CardDetails = styled.div`
  color: #0373da;
  text-align: center;
  height: 226px
  width: 338.5px;
  min-width: 350px;
  border-radius: .5vw;
  box-shadow: 0px 1px 2px 4px rgba(0,0,0,0.2);
  overflow: hidden;
  background-color: white;
  margin: 0 4vw 3vw 0;
  animation: ${zoomInAnimation2} .2s ease-in;
  position: relative;

  &:before {
    background: url(${props => props.picker});
    opacity: 0.15;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: "";
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5vh 0.5vh 0 0.5vh;
  border-bottom: 1px solid #ccc;
`;

const Title = styled.div`
  font-weight: bold;
`;

const CloseButton = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  z-index: 2;
  margin-top: -3px;

  i {
    margin: 0;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1vh;
`;


const DetailItem = styled.div`
  overflow: hidden;
  text-align: left;
  white-space: nowrap;
  margin-bottom: 6px;
  height: 20px;

  span {
    font-weight: bold;
  }
`;