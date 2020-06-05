import Vue from "vue";
import Component from 'vue-class-component';
import VueRouter from "vue-router";
import Vuex from 'vuex';

export const BaseFramework = Vue;
export const BaseComponent = Component;
export const BaseRouter = VueRouter;
export const BaseStore =  Vuex;
export const BaseStoreInstance =  Vuex.Store;
export const Moment = (window as any).moment;
export const Collect = (window as any).collect;
export const Chart = (window as any).Highcharts;
