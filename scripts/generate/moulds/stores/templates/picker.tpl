import { <%=modelName%>Collection as Collection } from '$domains/<%=modelName%>Collection';

import { createStore } from '$vuex-util';
import { baseStore, collectionStore, modelStore } from '$vuex-templates';

let collection = new Collection();

// properties of model
let filters = <%=JSON.stringify(properties,0,2)%>;

const store = createStore({
  namespaced: true,
  collection,
  filters,
  actions:{
    // 自定义action
    //'reset-password':async function({commit,state},payload){
      //await collection.select(payload.id).resetPassword();
    //},
  },

  stores: [
    baseStore, collectionStore
  ],
})

export default store;

