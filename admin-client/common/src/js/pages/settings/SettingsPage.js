import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import { importLocalization, downloadLocalization } from '../../actions';
import {bindActionCreators} from 'redux';
import MessageDialog from '../../components/MessageDialog';

export class SettingsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serverName: localStorage.getItem("uploadServer") || "opentranslationtools.org",
      langCode: '',
      langName: '',
      localizationFile: '',
      isMessageDialogShown: false,
      dialogMessage: ""
    };

    this.onServerNameChange = this.onServerNameChange.bind(this);
    this.onLocalizationSelect = this.onLocalizationSelect.bind(this);
    this.onMessageDialogShown = this.onMessageDialogShown.bind(this);
  }

  componentWillMount() {
    
  }

  onServerNameChange(value) {
    this.setState({ serverName: value });
  }

  onLangCodeChange(value) {
    this.setState({ langCode: value })
  }

  onLangNameChange(value) {
    this.setState({ langName: value })
  }

  onLocalizationSelect() {
    if(this.inputElement.files[0] !== undefined) {
      this.setState({ localizationFile: this.inputElement.files[0] })
    }
  }

  onUploadLanguageSelect(elm) {
    if (elm.value != '') {
      document.querySelector("#langCode").value = elm.value;
      document.querySelector("#langName").value = elm.options[elm.selectedIndex].text;

      this.setState({ langCode: elm.value });
      this.setState({ langName: elm.options[elm.selectedIndex].text });
    } else {
      this.resetInputStates();
    }
  }

  onDownloadLanguageSelect(value) {
    if (value != '') {
      this.props.downloadLocalization(
        value, 
        (lang, response) => {
          let translation = response.hasOwnProperty("translation") 
            ? response.translation 
            : null;

          if (translation != null) {
            var data = encodeURIComponent(JSON.stringify(translation, null, 4));
            var jsonURL = "data:text/json;charset=utf-8," + data;
            var tempLink = document.createElement('a');
            tempLink.href = jsonURL;
            tempLink.setAttribute('download', `${lang}.json`);
            tempLink.click();
            tempLink.remove();
          }
        }
      );
      document.querySelector("#downloadLangSelect").value = "";
    }
  }

  onSaveClick() {
    localStorage.setItem("uploadServer", this.state.serverName);
    this.onMessageDialogShown(true, this.props.txt.get("settingsSaved"));
  }

  onRestoreClick() {
    this.setState({ serverName: "opentranslationtools.org" });
  }

  handleInputClick = () => {
    const {importLocalization, txt} = this.props;
    
    var data = new FormData();
    data.append('langCode', this.state.langCode);
    data.append('langName', this.state.langName);
    data.append('file', this.state.localizationFile);

    importLocalization(
      data, 
      () => {
        localStorage.setItem('language', this.state.langCode);
        this.onMessageDialogShown(true, txt.get("upload_success"));
        this.resetInputStates();
      }, 
      (error) => {
        this.onMessageDialogShown(true, `${txt.get("upload_failed")}: ${txt.get(error)}`);
        this.resetInputStates();
        console.log(error);
      }
    );
  }

  onMessageDialogShown(isShown, message) {
    this.setState({
      isMessageDialogShown: isShown,
      dialogMessage: message
    });
  }

  resetInputStates() {
    this.inputElement.value = "";
    document.querySelector("#uploadLangSelect").value = "";
    document.querySelector("#langCode").value = "";
    document.querySelector("#langName").value = "";

    this.setState({ langCode: '' });
    this.setState({ langName: '' });
    this.setState({ localizationFile: '' });
  }

  render() {
    const {txt, localization} = this.props;
    const { isMessageDialogShown, dialogMessage } = this.state;

    let languages = {};
    if(localization !== undefined) {
      languages = localization.languages;
    }

    return (
      <div>

          { isMessageDialogShown?
              <MessageDialog {...this.props} message={dialogMessage} onClick={this.onMessageDialogShown} />
            : ""
          }

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
              <SettingsTitle>{txt.get("uploadLocalization")}</SettingsTitle>
              <SettingsValue>
                <SettingsSelect id="uploadLangSelect" onChange={(e) => this.onUploadLanguageSelect(e.target)}>
                  <option value="">-- {txt.get("select")} --</option>
                  {Object.entries(languages).map(([code, lng]) => <option value={code}> {lng} </option> )}
                </SettingsSelect>

                <SettingsInput type="text" id="langCode"
                  onChange={(e) => { this.onLangCodeChange(e.target.value) }}
                  placeholder={txt.get("languageCode")} />
                
                <SettingsInput type="text" id="langName"
                  onChange={(e) => { this.onLangNameChange(e.target.value) }}
                  placeholder={txt.get("languageName")} />
                
                <SettingsInput type="file" id="localization" accept=".json"
                  onChange={(e) => {this.onLocalizationSelect()}}
                  innerRef={input => this.inputElement = input} />
                
                <SettingsFileInput onClick={this.handleInputClick}>{txt.get("upload")}</SettingsFileInput>
              
              </SettingsValue>
            </SettingsItem>
            
            <SettingsItem>
              <SettingsTitle>{txt.get("downloadLocalization")}</SettingsTitle>
              <SettingsSelect id="downloadLangSelect" onChange={(e) => this.onDownloadLanguageSelect(e.target.value)}>
                <option value="">-- {txt.get("select")} --</option>
                {Object.entries(languages).map(([code, lng]) => <option value={code}> {lng} </option> )}
              </SettingsSelect>
            </SettingsItem>
          
          </SettingsContainer>

          <ButtonsContainer>
            <SaveButton onClick={this.onSaveClick.bind(this)}>{txt.get("save")}</SaveButton>
            <RestoreDefaultsButton onClick={this.onRestoreClick.bind(this)}>{txt.get("restoreDefaults")}</RestoreDefaultsButton>
          </ButtonsContainer>

        </Container>

      </div>
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
  margin-bottom: 10px;
`;
SettingsInput.displayName = 'SettingsInput';

const SettingsSelect = styled.select`
  width: 300px;
  height: 30px;
  border-radius: 5px;
  padding: 0 5px;
  margin-bottom: 5px;
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
  return bindActionCreators({importLocalization, downloadLocalization}, dispatch);
};

const mapStateToProps = state => {
  const {txt, localization} = state.geolocation;
  return {txt, localization};
};

export default connect (mapStateToProps, mapDispatchToProps )(SettingsPage);
