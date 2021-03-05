import { InjectionKey } from "vue";
import { Store, createStore, useStore as vuex_usestore } from "vuex";

type State = {

};

export const key: InjectionKey<Store<State>> = Symbol()

declare module "@vue/runtime-core" {
   interface ComponentCustomProperties {
      $store: Store<State>
   }
}

export const store = createStore<State>({
   state: {

   },
   getters: {

   },
   mutations: {

   },
   actions: {

   },
   modules: {

   }
});

export function usestore(): Store<State> {
   return vuex_usestore(key);
}
