import React from 'react';
import UserCard from './components/UserCard';
import Loading from '../../components/Loading';
import {Grid} from 'semantic-ui-react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {bindActionCreators} from 'redux';
import {fetchUsers, identiconLogin, deleteUser} from '../../actions';

export class UserPage extends React.Component {

  constructor(props) {
    super(props);
    
    this.onDeleteUser = this.onDeleteUser.bind(this);
    this.handleConfirmDialogShown = this.props.onConfirmDialogShown;
    this.handleMessagDialogShown = this.props.onMessageDialogShown;
  }

  onDeleteUser(id) {
    const {txt} = this.props;
    this.handleConfirmDialogShown(true, txt.get("deleteConfirm"), (isYes) => {
      if(isYes) {
        this.props.deleteUser(id, this.props.history, (success, error) => {
          this.handleConfirmDialogShown(false, "", null);
          if(!success) {
            this.handleMessagDialogShown(true, this.props.txt.get("error"));
          }
        });
      }
    });
  }

  handleConfirmDialogShown(isShown, message) {
    this.props.onConfirmDialogShown(isShown, message)
  }

  handleMessagDialogShown(isShown, message) {
    this.props.onMessageDialogShown(isShown, message)
  }

  componentWillMount() {
    const {history, fetchUsers} = this.props;
    fetchUsers(history);
  }

  render() {

    const {users} = this.props;

    return (
      <Container>

        { this.props.loading?
            <Loading txt={this.props.txt} height={'auto'} top='10vh' />
            : 
            <Grid columns={16}>
              {
                users.length>0? users.map((user,index)  => {
                  return (
                    user.is_social? '' :
                      <Grid.Column width={2} key={user.id}>
                        <UserCard id={index} user={user} 
                          onDeleteUser={this.onDeleteUser}
                          {...this.props} />
                      </Grid.Column>
                  );}) :   ''

              }
            </Grid>
        }

      </Container>
    );

  }

}

const Container = styled.div`
  width: 100%;
  height:100vh;
  display: flex;
  flex-direction: column;
`;
Container.displayName = 'Container';

const mapStateToProps = state => {
  const { users, loading } = state.user;
  const {txt} = state.geolocation;
  return {users, loading, txt};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {  fetchUsers, identiconLogin, deleteUser }, dispatch);
};

export default connect (mapStateToProps, mapDispatchToProps )(UserPage);
