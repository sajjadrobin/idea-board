// @flow
import {decorate, observable, action} from "mobx";
import moment from "moment";
import Axios from "axios";

import {compareValues} from "./utils";

class IdeaApi {
  newIdeaId = "";
  newIdeaCreatedAt = 0;
  ideaLists = [];
  isIdeaUpdating = false;
  localStorageItem = "ideas";

  //async GET ideas/new
  getNewIdea() {
    try {
      //with backend
      //const result = await Axios.get("/ideas/new");
      this.newIdeaId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      this.newIdeaCreatedAt = moment().unix();

    } catch (e) {
      console.log(e);
    }
  }

  // async POST idea/update
  async updateIdea(idea: {
    id: string,
    created_date: number,
    title: string,
    body: string
  }) {
    try {
      this.isIdeaUpdating = true;
      //with backend
      //const result = await Axios.post("/idea/update", idea);

      let local = JSON.parse(localStorage.getItem(this.localStorageItem));
      if(!local) {
        local = [];
      }

      //remove existing idea with the same ID
      local = local.filter(localIdea => localIdea.id !== idea.id);

      local.push(idea);

      await localStorage.setItem(this.localStorageItem, JSON.stringify(local));
    } catch (e) {
      console.log(e);
    } finally {
      this.isIdeaUpdating = false;
    }
  }

  // async Get ideas/
  async getAllIdeas() {
    try {
      const result = await localStorage.getItem(this.localStorageItem);
      if(result) {
        this.ideaLists = JSON.parse(result);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // async Delete idea: POST idea/delete
  async deleteIdea(id: string) {
    try {
      this.isIdeaUpdating = true;
      const allIdeas = await localStorage.getItem(this.localStorageItem);

      if(allIdeas) {
        const result = JSON.parse(allIdeas).filter(idea => idea.id !== id);

        await localStorage.setItem(this.localStorageItem, JSON.stringify(result));
        this.ideaLists = result;
      }

    } catch (e) {
      console.log(e);
    } finally {
      this.isIdeaUpdating = false;
    }
  }

  // sort list
  async sortIdea(type) {
    const allIdeas = await localStorage.getItem(this.localStorageItem);

    if(allIdeas) {
      let result = JSON.parse(allIdeas);

      result = result.sort(compareValues(type, 'asc'));

      await localStorage.setItem(this.localStorageItem, JSON.stringify(result));
      this.ideaLists = result;
    }
  }

}

decorate(IdeaApi, {
  newIdeaId: observable,
  newIdeaCreatedAt: observable,
  ideaLists: observable,
  isIdeaUpdating: observable,
  getNewIdea: action,
  updateIdea: action,
  getAllIdeas: action
});

export default new IdeaApi();