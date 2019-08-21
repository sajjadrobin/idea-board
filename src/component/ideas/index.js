// @flow
import React, {Component, Fragment} from "react";
import {observer} from "mobx-react";
import {withRouter} from "react-router-dom";
import moment from "moment";

import IdeaApi from "stores/IdeaApi";
import styles from "./idea.module.scss";


type Props = {
  history: object
}

const Index = observer(
  class Index extends Component<Props> {

    showDeleteIcon(event) {
      const parent = event.currentTarget;
      const allChildren = parent.children;
      const image = allChildren.item(4)
      image.style.display = "block";
    }

    hideDeleteIcon(event) {
      const parent = event.currentTarget.children;
      const image = parent.item(4)
      image.style.display = "none";
    }

    componentDidMount() {
      IdeaApi.getAllIdeas();
    }

    showAddForm() {
      this.props.history.push("/add")
    }

    deleteIdea(id) {
      IdeaApi.deleteIdea(id);
    }

    sortIdea(event) {
      const type = event.currentTarget.value;
      IdeaApi.sortIdea(type);
    }

    render() {
      const {ideaLists} = IdeaApi;

      return (
        <Fragment>
          <button onClick={() => this.showAddForm()} className={styles.addIdeaButton}>Add Idea</button>
          Sort By <select onChange={(event) => this.sortIdea(event)}>
            <option value="title">Title</option>
            <option value="created_date">Created Date</option>
          </select>
          <div className={styles.ideas}>
            {!!ideaLists.length ? (
              ideaLists.map((idea) =>
                <span
                  key={idea.id}
                  className={styles.ideaItem}
                  onMouseEnter={(event) => this.showDeleteIcon(event)}
                  onMouseLeave={(event) => this.hideDeleteIcon(event)}
                >
                  <span>ID: {idea.id}</span>
                  <span>Created: {moment.unix(idea.created_date).format("YY-MM-DD h:mm:ss")}</span>
                  <span>{idea.title}</span>
                  <span>{idea.body}</span>
                  <img
                    className={styles.delete}
                    onClick={() => this.deleteIdea(idea.id)}
                    src="https://img.icons8.com/wired/16/ff0000/delete-forever.png"/>
                </span>)
            ) : (<h3 className={styles.noList}>There is no idea. Please add One.</h3>)}
          </div>
        </Fragment>
      )
    }
  });

export default withRouter(Index);
