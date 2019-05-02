import Vue from 'vue'
import * as types from '../index'

const vm = new Vue()
const locale = 'en'

let path: string

// localePath

path = vm.localePath('/')
path = vm.localePath('/', locale)
path = vm.localePath(vm.$route)
path = vm.localePath(vm.$route, locale)

// switchLocalePath

path = vm.switchLocalePath(locale)

// getRouteBaseName

const routeBaseName: string = vm.getRouteBaseName(vm.$route)
