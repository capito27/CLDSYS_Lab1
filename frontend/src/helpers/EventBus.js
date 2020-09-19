// This helper create a Vue app on global (from the real context app) to create events and transmit it
import Vue from 'vue';
export const EventBus = new Vue();