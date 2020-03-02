import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Loading from '../../components/Loading';
import { fetchAllProjects, deleteProject } from '../../actions';
import ProjectCard from './components/ProjectCard';

export class ProjectContainer extends Component {

  constructor(props) {
    super(props);
    
    this.onDeleteProject = this.onDeleteProject.bind(this);
    this.handleConfirmDialogShown = this.props.onConfirmDialogShown;
    this.handleMessagDialogShown = this.props.onMessageDialogShown;
  }

  onDeleteProject(id) {
    const {txt} = this.props;
    this.handleConfirmDialogShown(true, txt.get("deleteConfirm"), (isYes) => {
      if(isYes) {
        this.props.deleteProject(id, this.props.history, (success, error) => {
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
    const {history, fetchAllProjects} = this.props;
    fetchAllProjects('', history ); // use history for redirect to the error page
  }

  render() {
    const {projects, txt} = this.props;

    return (
      <Container>
          { this.props.loading?
            <Loading txt={txt} height={'auto'} top='10vh' />
            : 
            <CardsContainer>
            {
              projects.map( (p, index) =>
              <ProjectCard
                key={p.id}
                index={index}
                book={p.book}
                language={p.language}
                sourceLanguage={p.source_language}
                anthology={p.anthology}
                version={p.version}
                dateModified={p.date_modified ? p.date_modified.slice(0,10) : ''}
                projectId={p.id}
                onDeleteProject={this.onDeleteProject}
                mode={p.mode}
                {...this.props}
              /> )
            }
          </CardsContainer>
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

const CardsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction:row;
  flex-wrap: wrap;
  align-items: left;
  `;
CardsContainer.displayName = 'CardsContainer';


const mapDispatchToProps = dispatch => {
  return bindActionCreators({fetchAllProjects, deleteProject}, dispatch);
};

const mapStateToProps = state =>{
  const { projects, loading  } = state.Projects;
  const {txt} = state.geolocation;

  return {projects, loading, txt};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer);
