// @flow
import React, {Component} from "react";
import {observer} from "mobx-react";
import moment from "moment";
import {withRouter} from "react-router-dom";

import styles from "./add.module.scss";
import IdeaApi from "stores/IdeaApi";

type Props = {
  history: object
}

type State = {
  bodyCharCount: number,
  remainingChar: number
}

const Add = observer(
  class Add extends Component<Props, State> {

    state = {
      bodyCharCount : 0,
      remainingChar: 140
    }

    constructor(props) {
      super(props);
      this.titleRef = React.createRef();
      this.bodyRef = React.createRef();
    }

    componentDidMount() {
      IdeaApi.getNewIdea();
    }


    toggleIdeaForm() {
      this.props.history.push("/");
    }

    async saveIdea() {
      await IdeaApi.updateIdea({
        id: IdeaApi.newIdeaId,
        created_date: IdeaApi.newIdeaCreatedAt,
        title: this.titleRef.current.value,
        body: this.bodyRef.current.value
      });

      if (!IdeaApi.isIdeaUpdating) {
        this.props.history.push("/");
      }
    }

    countCharacter() {
      const body = this.bodyRef.current.value;
      this.setState({remainingChar: 140 - body.length, bodyCharCount: body.length});
    }

    render() {
      const {newIdeaId, newIdeaCreatedAt} = IdeaApi;
      const {bodyCharCount, remainingChar} = this.state;

      return (
        <div className={styles.add}>
          {!!newIdeaId.length && (<h3>Id: {newIdeaId}</h3>)}
          {newIdeaCreatedAt && (<h3>Created At: {moment.unix(newIdeaCreatedAt).format("YY-MM-DD h:mm:ss")}</h3>)}
          <input ref={this.titleRef} autoFocus={true} onBlur={() => this.saveIdea()}/>
          <textarea
            ref={this.bodyRef}
            maxLength={140}
            onKeyUp={() => this.countCharacter()}
            onBlur={() => this.saveIdea()}
          />
          {(remainingChar < 15) ? (<span>Character Count: {bodyCharCount}</span>): ""}
          <button onClick={() => this.toggleIdeaForm()} className={styles.cancel}>Cancel</button>
          <button onClick={() => this.saveIdea()}>Create</button>
        </div>
      )
    }
  });

export default withRouter(Add);