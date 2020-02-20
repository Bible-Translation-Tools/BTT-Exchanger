import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import { importLocalization } from '../../actions';
import {bindActionCreators} from 'redux';
import Localization from '../../../languages/textToDisplay.json';

export class SettingsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serverName: localStorage.getItem("uploadServer") || "opentranslationtools.org"
    };

    this.onServerNameChange = this.onServerNameChange.bind(this);
    this.onLocalizationChange = this.onLocalizationChange.bind(this);
    this.onDefaultLocalizationDownload = this.onDefaultLocalizationDownload.bind(this);
    this.onUserLocalizationDownload = this.onUserLocalizationDownload.bind(this);
  }

  componentWillMount() {
    
  }

  onServerNameChange(value) {
    this.setState({ serverName: value });
  }

  onLocalizationChange() {
    const {importLocalization} = this.props;
    importLocalization(this.inputElement.files[0], (success) => {
      if(success) {
        alert(this.props.txt.get("upload_success"));
      } else {
        alert(this.props.txt.get("upload_failed"));
      }
    });
    this.inputElement.value = "";
  }

  onDefaultLocalizationDownload() {
    var data = encodeURIComponent(JSON.stringify(Localization, null, 4));
    var jsonURL = "data:text/json;charset=utf-8," + data;

    var tempLink = document.createElement('a');
    tempLink.href = jsonURL;
    tempLink.setAttribute('download', 'localization.json');
    tempLink.click();
    tempLink.remove();
  }

  onUserLocalizationDownload() {
    var data = encodeURIComponent(JSON.stringify(this.props.localization, null, 4));
    var jsonURL = "data:text/json;charset=utf-8," + data;

    var tempLink = document.createElement('a');
    tempLink.href = jsonURL;
    tempLink.setAttribute('download', 'localization.json');
    tempLink.click();
    tempLink.remove();
  }

  onSaveClick() {
    localStorage.setItem("uploadServer", this.state.serverName);
    alert("Settings saved! Please restart the app.");
  }

  onRestoreClick() {
    this.setState({ serverName: "opentranslationtools.org" });
  }

  handleInputClick = (e) => {
    this.inputElement.click();
  }

  render() {
    const {txt} = this.props;

    return (
      <Container>

        <BackLink onClick={()=> this.props.history.goBack()}>
          <i className="material-icons">arrow_backward </i> {txt.get("goBack")}
        </BackLink>

        <Header>
          {txt.get("settings")}
        </Header>

        <SettingsContainer>
          
          <SettingsItem>
            <SettingsTitle>{txt.get("serverName")}</SettingsTitle>
            <SettingsValue>
              <SettingsInput type="text" id="serverName" 
                value={this.state.serverName}
                onChange={(e) => {this.onServerNameChange(e.target.value)}} />
            </SettingsValue>
          </SettingsItem>
          
          <SettingsItem>
            <SettingsTitle>{txt.get("localizationFile")}</SettingsTitle>
            <SettingsValue>
              <SettingsFileInput onClick={this.handleInputClick}>{txt.get("upload")}</SettingsFileInput>
              <SettingsInput type="file" id="localization" accept=".json"
                onChange={(e) => {this.onLocalizationChange()}} 
                innerRef={input => this.inputElement = input}
                style={{display: 'none'}} />
                <DownloadLink onClick={this.onDefaultLocalizationDownload}>{txt.get("downloadDefaultLocal")}</DownloadLink>
                <DownloadLink onClick={this.onUserLocalizationDownload}>{txt.get("downloadUserLocal")}</DownloadLink>
            </SettingsValue>
          </SettingsItem>
        
        </SettingsContainer>

        <ButtonsContainer>
          <SaveButton onClick={this.onSaveClick.bind(this)}>{txt.get("save")}</SaveButton>
          <RestoreDefaultsButton onClick={this.onRestoreClick.bind(this)}>{txt.get("restoreDefaults")}</RestoreDefaultsButton>
        </ButtonsContainer>

      </Container>
    );

  }

}

const Container= styled.div`
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10vh;
  margin: 0 auto;
`;
Container.displayName = 'Container';

const Header = styled.div`
  font-size: 22px;
  margin-top: 10vh;
  text-align: center;
  height: 5vh;
  font-weight: bold;
`;
Header.displayName = 'Header';

const BackLink = styled.a`
  position: absolute;
  top: 30px;
  left: 30px;
  cursor: pointer;
  color: #4183c4 !important;
  display: block;
  font-size: 22px;
  i {
    width: 3vh;
  }
`;
BackLink.displayName = 'BackLink';

const SettingsContainer= styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;
SettingsContainer.displayName = 'SettingsContainer';

const SettingsItem = styled.div`
  display: flex;
  margin-top: 20px;
`;
SettingsItem.displayName = 'SettingsItem';

const SettingsTitle = styled.div`
  width: 200px;
  font-weight: bold;
`;
SettingsTitle.displayName = 'SettingsTitle';

const SettingsValue = styled.div`
  width: 300px;
`;
SettingsValue.displayName = 'SettingsValue';

const SettingsInput = styled.input`
  width: 300px;
  height: 30px;
  border-radius: 5px;
  padding: 0 5px;
`;
SettingsInput.displayName = 'SettingsInput';

const SettingsFileInput = styled.div`
  width: 300px;
  height: 30px;
  border-radius: 5px;
  padding: 0 5px;
  border: 1px solid #07c;
  text-align: center;
  background-image: linear-gradient(#83b2ff, #0095ff);
  cursor: pointer;
  box-shadow: inset 0 1px 0 #66bfff;
  color: white;
  font-weight: bold;
  padding-top: 3px;
`;
SettingsFileInput.displayName = 'SettingsFileInput';

const DownloadLink = styled.a`
  display: block;
  margin-top: 10px;
  cursor: pointer;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  margin-top: 50px;
  display: flex;
`;
ButtonsContainer.displayName = 'ButtonsContainer';

const SaveButton = styled.a`
  cursor: pointer;
  display: block;
  margin-right: 5vh;
  font-weight: bold;
`;
SaveButton.displayName = 'SaveButton';

const RestoreDefaultsButton = styled.a`
  cursor: pointer;
  display: block;
  font-weight: bold;
`;
RestoreDefaultsButton.displayName = 'RestoreDefaultsButton';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({importLocalization}, dispatch);
};

const mapStateToProps = state => {
  const {txt, localization} = state.geolocation;
  return {txt, localization};
};

export default connect (mapStateToProps, mapDispatchToProps )(SettingsPage);
