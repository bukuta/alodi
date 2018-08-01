import { <%=modelName%>Model as Model} from '$domains/<%=modelName%>Model';

import { createStore } from '$vuex-util';
import { baseStore, collectionStore, modelStore } from '$vuex-templates';

let collection = new Model();

const store = createStore({
  namespaced: true,
  collection,
  actions:{
    // 自定义action
    //'reset-password':async function({commit,state},payload){
      //await collection.select(payload.id).resetPassword();
    //},
  },

  stores: [
    baseStore, modelStore
  ],
})

export default store;
